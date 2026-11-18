import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

orig = cv2.imread('d:/rahul latest/ogheavyduty-next/public/images/og-logo.png', cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(orig)
BRAND_B, BRAND_G, BRAND_R = 224, 122, 15

for y in range(0, 114):
    for x in range(320):
        is_badge_text = (
            52 <= y <= 67
            and 135 <= x <= 230
            and r[y, x] > 180
            and g[y, x] > 180
            and b[y, x] > 180
            and a[y, x] > 50
        )
        if is_badge_text:
            b[y, x], g[y, x], r[y, x] = 255, 255, 255
        else:
            b[y, x], g[y, x], r[y, x] = BRAND_B, BRAND_G, BRAND_R

b_f = b.astype(np.float32)
g_f = g.astype(np.float32)
r_f = r.astype(np.float32)
a_f = a.astype(np.float32) / 255.0
b_pre, g_pre, r_pre = b_f * a_f, g_f * a_f, r_f * a_f

crop_b = b_pre[0:110, 83:235]
crop_g = g_pre[0:110, 83:235]
crop_r = r_pre[0:110, 83:235]
crop_a = a_f[0:110, 83:235]

EMB_H = 130
EMB_W = int(152 * EMB_H / 110) # 179px

emb_b = cv2.resize(crop_b, (EMB_W, EMB_H), interpolation=cv2.INTER_LANCZOS4)
emb_g = cv2.resize(crop_g, (EMB_W, EMB_H), interpolation=cv2.INTER_LANCZOS4)
emb_r = cv2.resize(crop_r, (EMB_W, EMB_H), interpolation=cv2.INTER_LANCZOS4)
emb_a = cv2.resize(crop_a, (EMB_W, EMB_H), interpolation=cv2.INTER_LANCZOS4)

eps = 1e-5
mask = emb_a > eps
emb_final = np.zeros((EMB_H, EMB_W, 4), dtype=np.uint8)
emb_final[:, :, 0] = np.where(mask, np.clip(emb_r / emb_a, 0, 255), BRAND_R).astype(np.uint8)
emb_final[:, :, 1] = np.where(mask, np.clip(emb_g / emb_a, 0, 255), BRAND_G).astype(np.uint8)
emb_final[:, :, 2] = np.where(mask, np.clip(emb_b / emb_a, 0, 255), BRAND_B).astype(np.uint8)
emb_final[:, :, 3] = np.clip(emb_a * 255.0, 0, 255).astype(np.uint8)

emb_pil = Image.fromarray(emb_final, 'RGBA')

def make_refined(title_size, sub_size, line_mode='max'):
    dummy = Image.new('RGBA', (10, 10))
    d = ImageDraw.Draw(dummy)
    f_title = ImageFont.truetype('C:/Windows/Fonts/arialbi.ttf', title_size)
    f_sub = ImageFont.truetype('C:/Windows/Fonts/georgiaz.ttf', sub_size)
    
    title_text = "O.G. HEAVY DUTY"
    sub_text = "Your family's air-care expert"
    
    bb_t = d.textbbox((0, 0), title_text, font=f_title)
    wt = bb_t[2] - bb_t[0]
    ht = bb_t[3] - bb_t[1]
    
    bb_s = d.textbbox((0, 0), sub_text, font=f_sub)
    ws = bb_s[2] - bb_s[0]
    hs = bb_s[3] - bb_s[1]
    
    text_w = max(wt, ws)
    line_w = wt + 6 if line_mode == 'title' else text_w
    
    gap = 18
    pad_left = 6
    pad_right = 14
    total_w = pad_left + EMB_W + gap + text_w + pad_right
    total_h = 140
    
    canvas = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    
    ey = (total_h - EMB_H) // 2
    canvas.paste(emb_pil, (pad_left, ey), emb_pil)
    
    draw = ImageDraw.Draw(canvas)
    tx = pad_left + EMB_W + gap
    
    # Vertically center text block
    block_h = ht + 8 + 2.5 + 8 + hs
    block_top = int((total_h - block_h) // 2)
    
    ty = block_top
    draw.text((tx, ty), title_text, font=f_title, fill=(15, 23, 42, 255))
    
    line_y = int(ty + ht + 8)
    draw.line([(tx, line_y), (tx + line_w, line_y)], fill=(15, 23, 42, 255), width=2)
    
    sy = line_y + 7
    draw.text((tx, sy), sub_text, font=f_sub, fill=(15, 23, 42, 255))
    
    return canvas

# S1: size 35 (compact, refined)
s1 = make_refined(35, 24, line_mode='max')
# S2: size 36 (perfect balance)
s2 = make_refined(36, 24, line_mode='max')
# S3: size 36 with title underline
s3 = make_refined(36, 24, line_mode='title')

s1.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/opt_s1_35.png')
s2.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/opt_s2_36.png')
s3.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/opt_s3_title_line.png')

# Save S2 as the primary horizontal logo
dest_dir = 'd:/rahul latest/ogheavyduty-next/public/images/'
s2.save(dest_dir + 'og-logo-horizontal-2x.png')
s2_1x = s2.resize((s2.width // 2, s2.height // 2), Image.LANCZOS)
s2_1x.save(dest_dir + 'og-logo-horizontal.png')

print(f"Refined horizontal logo saved: {s2.size} -> 1x: {s2_1x.size}")
