import os
import subprocess
import numpy as np
from PIL import Image

def build_ai_assets():
    os.makedirs('public/assets/ai', exist_ok=True)
    
    # 1. Source image
    source_img_path = '/Users/saquibsarfaraz/.gemini/antigravity-ide/brain/3371769e-0155-4a20-a732-a43b24797def/.user_uploaded/media_1792841096136.png'
    src_im = Image.open(source_img_path).convert('RGBA')
    
    # Save standard logo
    src_im.save('public/assets/ai/ai-logo.png', 'PNG')
    src_im.save('public/assets/ai/ai-logo-source.png', 'PNG')
    src_im.save('public/ai-search-logo.png', 'PNG')
    print("Saved static logo to public/assets/ai/ai-logo.png and public/ai-search-logo.png")

    # 2. Extract frames from gemini video
    video_source = 'src/assets/gemini_generated_video_803569a1.mp4'
    w, h = 1280, 720
    frame_bytes = w * h * 3
    
    cmd = [
        'ffmpeg', '-y', '-i', video_source,
        '-f', 'image2pipe', '-pix_fmt', 'rgb24', '-vcodec', 'rawvideo', '-'
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw_frames = []
    
    while True:
        raw = proc.stdout.read(frame_bytes)
        if len(raw) < frame_bytes:
            break
        raw_frames.append(np.frombuffer(raw, dtype=np.uint8).reshape((h, w, 3)))
    proc.stdout.close()
    proc.wait()
    
    print(f"Loaded {len(raw_frames)} frames from source video")
    
    # 3. Clean any watermark on every frame (in 16:9 canvas)
    # The watermark is at x=1140..1185, y=555..605 in the bottom right corner
    cleaned_frames = []
    y1, y2 = 550, 610
    x1, x2 = 1135, 1185
    # Mirrored clean background from left side
    ref_x1, ref_x2 = 1280 - x2, 1280 - x1
    
    for idx, f in enumerate(raw_frames):
        arr = f.copy().astype(float)
        # Watermark removal via mirrored dark background blend
        ref_patch = np.fliplr(arr[y1:y2, ref_x1:ref_x2, :])
        sub = arr[y1:y2, x1:x2, :]
        # Background reference
        bg_mean = (arr[y1:y2, x1-15:x1, :].mean(axis=(0,1)) + arr[y1:y2, x2:x2+15, :].mean(axis=(0,1))) / 2
        diff = np.linalg.norm(sub - bg_mean, axis=2)
        mask = np.clip((diff - 6) / 10, 0, 1)[:, :, None]
        arr[y1:y2, x1:x2, :] = (1 - mask) * sub + mask * ref_patch
        cleaned_frames.append(arr.astype(np.uint8))
        
    print("Cleaned watermark from all frames")
    
    # 4. Generate Dark Introduction & Atmospheric Particle Entrance (36 frames = 1.5s at 24fps)
    # Target frame at the end of intro is cleaned_frames[70] (where energy swirl begins)
    target_frame = cleaned_frames[70].astype(float)
    intro_frames = []
    num_intro = 36
    
    # Create atmospheric background matching portfolio #080A12
    base_bg = np.zeros((h, w, 3), dtype=float)
    base_bg[:, :] = [8, 10, 18] # #080A12
    
    # Pre-generate some floating particle coordinates for intro
    np.random.seed(42)
    num_particles = 80
    px = np.random.uniform(200, 1080, num_particles)
    py = np.random.uniform(100, 620, num_particles)
    pspeed = np.random.uniform(0.5, 2.0, num_particles)
    pangle = np.random.uniform(0, 2 * np.pi, num_particles)
    pcolor = []
    for _ in range(num_particles):
        # Cyan, Violet, Magenta tones
        c_choice = np.random.choice([0, 1, 2])
        if c_choice == 0:
            pcolor.append([0, 210, 255]) # Cyan
        elif c_choice == 1:
            pcolor.append([168, 85, 247]) # Violet
        else:
            pcolor.append([236, 72, 153]) # Magenta
    pcolor = np.array(pcolor)
    
    # Coordinate grid for radial glow
    yy, xx = np.mgrid[:h, :w]
    cx, cy = 640, 360
    dist_from_center = np.sqrt((xx - cx)**2 + (yy - cy)**2)
    
    for i in range(num_intro):
        progress = i / (num_intro - 1) # 0.0 to 1.0
        frame_canvas = base_bg.copy()
        
        # Central pulsing radial glow (starts faint, blooms)
        glow_radius = 80 + progress * 240
        glow_intensity = 0.05 + 0.35 * (progress ** 1.8)
        glow_mask = np.exp(-((dist_from_center / glow_radius) ** 2)) * glow_intensity
        
        # Cyan-to-magenta radial gradient in glow
        radial_angle = np.arctan2(yy - cy, xx - cx)
        cyan_factor = np.clip((np.cos(radial_angle) + 1) / 2, 0, 1)[:, :, None]
        glow_rgb = cyan_factor * np.array([0, 220, 255]) + (1 - cyan_factor) * np.array([230, 60, 180])
        frame_canvas += glow_mask[:, :, None] * glow_rgb
        
        # Draw micro atmospheric particles drifting
        p_alpha = np.clip(progress * 1.5, 0, 1)
        for p_idx in range(num_particles):
            cur_x = int(px[p_idx] + np.cos(pangle[p_idx]) * pspeed[p_idx] * i)
            cur_y = int(py[p_idx] + np.sin(pangle[p_idx]) * pspeed[p_idx] * i)
            if 1 <= cur_x < w - 1 and 1 <= cur_y < h - 1:
                col = pcolor[p_idx] * p_alpha
                frame_canvas[cur_y, cur_x] += col
                frame_canvas[cur_y-1:cur_y+2, cur_x-1:cur_x+2] += col * 0.35
                
        # In second half of intro, fade in the neural energy trails
        if progress > 0.4:
            trail_fade = (progress - 0.4) / 0.6
            # Use smooth cubic easing
            trail_fade = trail_fade * trail_fade * (3 - 2 * trail_fade)
            
            # Reveal outward radially: inner emblem and rays emerge
            reveal_r = (progress - 0.4) / 0.6 * 400
            radial_reveal_mask = np.clip((reveal_r - dist_from_center) / 60, 0, 1)[:, :, None]
            
            blended = (1 - trail_fade * radial_reveal_mask) * frame_canvas + (trail_fade * radial_reveal_mask) * target_frame
            frame_canvas = blended
            
        intro_frames.append(np.clip(frame_canvas, 0, 255).astype(np.uint8))
        
    print(f"Generated {len(intro_frames)} intro frames")
    
    # 5. Compose the full sequence:
    # Intro (36 frames) -> Swirl & Neural Activation (cleaned_frames[70:195], 125 frames) -> Settle to idle (cleaned_frames[195:240], 45 frames)
    # Total reveal sequence: 36 + 125 + 45 = 206 frames (~8.6 seconds at 24fps)
    reveal_sequence = intro_frames + cleaned_frames[70:240]
    
    # Make the end of the reveal sequence seamlessly loopable:
    # Crossfade the last 24 frames of reveal_sequence with the idle baseline (cleaned_frames[195:219])
    loop_overlap = 24
    idle_base = cleaned_frames[195:195 + loop_overlap]
    for k in range(loop_overlap):
        blend_factor = k / (loop_overlap - 1)
        tail_idx = len(reveal_sequence) - loop_overlap + k
        reveal_sequence[tail_idx] = (
            (1 - blend_factor) * reveal_sequence[tail_idx].astype(float) +
            blend_factor * idle_base[k].astype(float)
        ).astype(np.uint8)
        
    print(f"Composed reveal sequence with {len(reveal_sequence)} frames")
    
    # 6. Also create a seamless idle loop (60 frames = 2.5s)
    # Extracted from frames 180 to 240 with crossfade
    idle_raw = cleaned_frames[180:240]
    idle_loop = [f.copy() for f in idle_raw]
    idle_cross = 18
    for k in range(idle_cross):
        blend = k / (idle_cross - 1)
        idle_loop[len(idle_loop) - idle_cross + k] = (
            (1 - blend) * idle_loop[len(idle_loop) - idle_cross + k].astype(float) +
            blend * idle_raw[k].astype(float)
        ).astype(np.uint8)
    print(f"Composed idle loop with {len(idle_loop)} frames")

    # 7. Square (1:1) Cropped Frames (720x720) centered on emblem (x=280..1000)
    # The square crop perfectly isolates the circular emblem and guarantees zero watermark trace
    reveal_square = [f[:, 280:1000, :] for f in reveal_sequence]
    idle_square = [f[:, 280:1000, :] for f in idle_loop]
    
    # 8. Save Poster Frames (Idle peak & reveal peak)
    poster_idx = min(180, len(reveal_square) - 1)
    poster_im = Image.fromarray(reveal_square[poster_idx])
    poster_im.save('public/assets/ai/ai-logo-poster.webp', 'WEBP', quality=95)
    poster_im.save('public/assets/ai/ai-logo-poster.jpg', 'JPEG', quality=95)
    print("Saved poster images to public/assets/ai/ai-logo-poster.webp and .jpg")
    
    # 9. Encode Videos with FFmpeg
    def encode_video(frame_list, out_w, out_h, out_path, is_webm=False):
        fps = 24
        if is_webm:
            cmd = [
                'ffmpeg', '-y',
                '-f', 'rawvideo', '-vcodec', 'rawvideo',
                '-s', f'{out_w}x{out_h}', '-pix_fmt', 'rgb24', '-r', str(fps),
                '-i', '-',
                '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '26',
                '-pix_fmt', 'yuv420p',
                '-an', # NO AUDIO
                out_path
            ]
        else:
            cmd = [
                'ffmpeg', '-y',
                '-f', 'rawvideo', '-vcodec', 'rawvideo',
                '-s', f'{out_w}x{out_h}', '-pix_fmt', 'rgb24', '-r', str(fps),
                '-i', '-',
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
                '-pix_fmt', 'yuv420p',
                '-movflags', '+faststart',
                '-an', # NO AUDIO
                out_path
            ]
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
        for frame in frame_list:
            proc.stdin.write(frame.tobytes())
        proc.stdin.close()
        proc.wait()
        size_kb = os.path.getsize(out_path) / 1024
        print(f"Encoded {out_path} ({size_kb:.1f} KB)")

    print("Encoding videos...")
    # Square 720x720 primary assets:
    encode_video(reveal_square, 720, 720, 'public/assets/ai/ai-logo-reveal.webm', is_webm=True)
    encode_video(reveal_square, 720, 720, 'public/assets/ai/ai-logo-reveal.mp4', is_webm=False)
    
    # Lightweight idle loop assets:
    encode_video(idle_square, 720, 720, 'public/assets/ai/ai-logo-idle.webm', is_webm=True)
    encode_video(idle_square, 720, 720, 'public/assets/ai/ai-logo-idle.mp4', is_webm=False)
    
    # 16:9 cinematic reveal assets:
    encode_video(reveal_sequence, 1280, 720, 'public/assets/ai/ai-logo-reveal-16x9.webm', is_webm=True)
    encode_video(reveal_sequence, 1280, 720, 'public/assets/ai/ai-logo-reveal-16x9.mp4', is_webm=False)

    print("All AI video and image assets generated successfully!")

if __name__ == '__main__':
    build_ai_assets()
