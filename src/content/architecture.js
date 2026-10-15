export const architectureNodes = [
  {
    id: 'client',
    title: 'Client Web Interface',
    tech: 'React 19 • Tailwind CSS • Framer Motion',
    type: 'Frontend Viewport',
    description: 'Renders optimistic UI updates, handles client routing, manages local state buffers, and displays real-time socket events.',
    status: 'Active • 60 FPS',
    color: '#FFFFFF'
  },
  {
    id: 'api',
    title: 'REST API & Router Middleware',
    tech: 'Node.js • Express • JWT OAuth',
    type: 'Backend Gateway',
    description: 'Handles authentication tokens, request validation, rate limiting, and business logic processing.',
    status: 'Sub-20ms Response',
    color: '#C6CBD6'
  },
  {
    id: 'database',
    title: 'MongoDB Atlas Database',
    tech: 'MongoDB • Aggregation • Compound Indexes',
    type: 'Persistent Data Store',
    description: 'Stores user accounts, campus feed posts, chat histories, and indexes data for high-speed regex queries.',
    status: 'Replicated Cluster',
    color: '#F5F6FA'
  },
  {
    id: 'socket',
    title: 'Socket.io Realtime Engine',
    tech: 'WebSockets • Event Rooms • Heartbeat Recovery',
    type: 'Real-Time Pipeline',
    description: 'Broadcasts instant 1-to-1 chat messages, turn updates in XYXO game rooms, and active presence status.',
    status: 'Sub-100ms Latency',
    color: '#C6CBD6'
  },
  {
    id: 'cdn',
    title: 'Cloudinary CDN Media Pipeline',
    tech: 'Cloudinary • Signed Direct Uploads',
    type: 'Media Storage & CDN',
    description: 'Optimizes images on the fly, serves WebP/AVIF formats globally, and manages secure student document uploads.',
    status: 'Global CDN Active',
    color: '#FFFFFF'
  }
];
