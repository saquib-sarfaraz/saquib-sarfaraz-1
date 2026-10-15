/**
 * InCampus InBuzz API Client Adapter
 * Fetches verified public InBuzz video reels directly from the InCampus backend.
 * Configured strictly via import.meta.env.VITE_INCAMPUS_API_URL.
 * Read-only client: No posting, uploading, or mutating operations.
 */

/**
 * Resolves the InCampus API base URL strictly from environment variables.
 * Throws a clear development error if the environment variable is not defined.
 */
export function getInCampusApiBase() {
  const envUrl =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.VITE_INCAMPUS_API_URL
      : '';

  const trimmed = typeof envUrl === 'string' ? envUrl.trim() : '';

  if (!trimmed) {
    throw new Error(
      '[InCampus InBuzz] Missing required environment variable: VITE_INCAMPUS_API_URL. ' +
      'Please configure VITE_INCAMPUS_API_URL in your .env or .env.local file.'
    );
  }

  return trimmed.replace(/\/+$/, '');
}

// Known public creator IDs on InCampus for feed discovery pagination
const DISCOVERY_CREATOR_IDS = [
  '697e17bfc5c0e3aded584940', // Saquib-Official (Platform Creator)
  '697e3f05e604e635d0d0a398'  // Campus News / Student Updates
];

/**
 * Format numeric count to compact social notation (1.2K, 3.4M, etc.)
 */
export function formatReelCount(value) {
  const count = Number(value || 0);
  if (!Number.isFinite(count) || count <= 0) return '0';
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(count >= 10_000_000 ? 0 : 1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(count >= 100_000 ? 0 : 1)}K`;
  }
  return String(count);
}

/**
 * Normalizes an author object from InCampus backend schema
 */
function normalizeAuthor(rawAuthor) {
  if (!rawAuthor || typeof rawAuthor !== 'object') {
    return {
      id: 'incampus-user',
      fullName: 'InCampus Creator',
      displayName: 'InCampus Creator',
      username: 'incampus',
      profilePicUrl: '',
      collegeTagName: 'University Campus',
      isVerified: false
    };
  }

  const id = String(rawAuthor.id || rawAuthor._id || '').trim();
  const fullName = String(
    rawAuthor.fullName ||
    rawAuthor.displayName ||
    rawAuthor.name ||
    'InCampus Creator'
  ).trim();
  const rawUsername = String(rawAuthor.username || rawAuthor.handle || 'creator').trim();
  const username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;

  return {
    id,
    fullName,
    displayName: fullName,
    username,
    profilePicUrl: String(rawAuthor.profilePicUrl || rawAuthor.profilePic || rawAuthor.avatar || '').trim(),
    collegeTagName: String(rawAuthor.collegeTagName || rawAuthor.collegeName || 'Jamia Hamdard').trim(),
    isVerified: Boolean(rawAuthor.isVerified)
  };
}

/**
 * Normalizes an InBuzz reel record from the InCampus backend
 */
export function normalizeInBuzzReel(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id = String(raw.id || raw._id || '').trim();
  if (!id) return null;

  const base = getInCampusApiBase();
  const author = normalizeAuthor(raw.author || raw.userId || raw.user);
  const streamUrl =
    raw.streamUrl ||
    `${base}/inbuzz/stream/${encodeURIComponent(id)}`;

  const publicUrl =
    raw.publicUrl ||
    raw.shareUrl ||
    `https://incampus.online/inbuzz/reel/${encodeURIComponent(id)}`;

  const thumbnailUrl = String(raw.thumbnailUrl || raw.thumbnail || '').trim();

  return {
    id,
    caption: String(raw.caption || '').trim(),
    thumbnailUrl,
    streamUrl,
    publicUrl,
    author,
    durationSeconds: Number(raw.durationSeconds || raw.duration || 0),
    videoWidth: Number(raw.videoWidth || 720),
    videoHeight: Number(raw.videoHeight || 1280),
    viewsCount: Number(raw.viewsCount || raw.views || 0),
    likesCount: Number(raw.likesCount || raw.likes || 0),
    sharesCount: Number(raw.sharesCount || raw.shares || 0),
    commentsCount: Number(raw.commentsCount || raw.comments || 0),
    createdAt: raw.createdAt || raw.created_at || null
  };
}

/**
 * In-memory registry to coordinate paginated discovery without duplicate items.
 */
class InCampusInBuzzClient {
  constructor() {
    this.seenReelIds = new Set();
    this.creatorIndex = 0;
    this.trendingExhausted = false;
  }

  reset() {
    this.seenReelIds.clear();
    this.creatorIndex = 0;
    this.trendingExhausted = false;
    this.isFetching = false;
  }

  /**
   * Fetches the next page of InBuzz reels with concurrency protection.
   * Employs /api/inbuzz/trending first, then paginates through discovery creators.
   */
  async fetchNextPage({ limit = 10, signal = null } = {}) {
    if (this.isFetching) {
      return { reels: [], hasMore: true, totalLoaded: this.seenReelIds.size };
    }

    this.isFetching = true;
    const collectedReels = [];
    const base = getInCampusApiBase();

    try {
      // Step 1: Fetch Trending reels on initial load
      if (!this.trendingExhausted) {
        try {
          const trendingUrl = `${base}/inbuzz/trending?limit=${Math.min(limit * 2, 40)}`;
          const res = await fetch(trendingUrl, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal
          });

          if (res.ok) {
            const data = await res.json();
            const rawItems = Array.isArray(data?.items) ? data.items : Array.isArray(data?.reels) ? data.reels : [];

            for (const item of rawItems) {
              const normalized = normalizeInBuzzReel(item);
              if (normalized && !this.seenReelIds.has(normalized.id)) {
                this.seenReelIds.add(normalized.id);
                collectedReels.push(normalized);
              }
            }
          } else {
            console.warn(`[InCampus InBuzz] Trending fetch HTTP status: ${res.status}`);
          }
        } catch (err) {
          if (err.name === 'AbortError') throw err;
          console.warn('[InCampus InBuzz] Trending fetch warning:', err.message);
        } finally {
          this.trendingExhausted = true;
        }
      }

      // Step 2: If we still need items or trending is already loaded, paginate creator endpoints
      while (collectedReels.length < limit && this.creatorIndex < DISCOVERY_CREATOR_IDS.length) {
        const creatorId = DISCOVERY_CREATOR_IDS[this.creatorIndex];
        this.creatorIndex += 1;

        try {
          const creatorUrl = `${base}/inbuzz/user/${encodeURIComponent(creatorId)}?limit=15`;
          const res = await fetch(creatorUrl, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal
          });

          if (res.ok) {
            const data = await res.json();
            const rawItems = Array.isArray(data?.items) ? data.items : Array.isArray(data?.reels) ? data.reels : [];

            for (const item of rawItems) {
              const normalized = normalizeInBuzzReel(item);
              if (normalized && !this.seenReelIds.has(normalized.id)) {
                this.seenReelIds.add(normalized.id);
                collectedReels.push(normalized);
              }
            }
          }
        } catch (err) {
          if (err.name === 'AbortError') throw err;
          console.warn(`[InCampus InBuzz] Creator ${creatorId} fetch warning:`, err.message);
        }
      }
    } finally {
      this.isFetching = false;
    }

    const hasMore = this.creatorIndex < DISCOVERY_CREATOR_IDS.length;

    return {
      reels: collectedReels,
      hasMore,
      totalLoaded: this.seenReelIds.size
    };
  }

  /**
   * Fetches an individual reel by its unique ID.
   * Returns normalized reel object or null if not found.
   */
  async fetchSingleReel(id, { signal = null } = {}) {
    if (!id) return null;
    const base = getInCampusApiBase();
    try {
      const res = await fetch(`${base}/inbuzz/reel/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal
      });
      if (!res.ok) return null;
      const data = await res.json();
      return normalizeInBuzzReel(data);
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn(`[InCampus InBuzz] fetchSingleReel error for ${id}:`, err.message);
      return null;
    }
  }
}

export const inCampusInBuzzClient = new InCampusInBuzzClient();
