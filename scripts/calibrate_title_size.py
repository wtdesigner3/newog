import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Load base emblem from original og-logo.png
orig = cv2.imread('d:/rahul latest/ogheavyduty-next/public/images/og-logo.png', cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(orig)
BRAND_B, BRAND_G, BRAND_R = 224, 122, 15

# Colorize emblem to brand blue #0F7AE0, keeping badge text pure white
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

EMB_H = 136
EMB_W = int(152 * EMB_H / 110) # 187px

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

def make_variant(title_size, sub_size):
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
    gap = 18
    pad_left = 6
    pad_right = 14
    total_w = pad_left + EMB_W + gap + text_w + pad_right
    total_h = 146
    
    canvas = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    
    ey = (total_h - EMB_H) // 2
    canvas.paste(emb_pil, (pad_left, ey), emb_pil)
    
    draw = ImageDraw.Draw(canvas)
    tx = pad_left + EMB_W + gap
    
    # Vertically center the text block relative to the emblem
    # Total text block height = ht + 9 (gap) + 2.5 (line) + 8 (gap) + hs
    block_h = ht + 9 + 3 + 8 + hs
    block_top = (total_h - block_h) // 2
    
    ty = block_top
    draw.text((tx, ty), title_text, font=f_title, fill=(15, 23, 42, 255))
    
    line_y = ty + ht + 8
    draw.line([(tx, line_y), (tx + text_w, line_y)], fill=(15, 23, 42, 255), width=2)
    
    sy = line_y + 8
    draw.text((tx, sy), sub_text, font=f_sub, fill=(15, 23, 42, 255))
    
    return canvas

# Generate sizes: 36, 38, 40
v36 = make_variant(36, 25)
v38 = make_variant(38, 25)
v40 = make_variant(40, 26)

v36.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/opt_title_36.png')
v38.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/opt_title_38.png')
v40.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/opt_title_40.png')

# Create comparison at actual display height (48px)
sim36 = v36.resize((int(v36.width * 48 / v36.height), 48), Image.LANCZOS)
sim38 = v38.resize((int(v38.width * 48 / v38.height), 48), Image.LANCZOS)
sim40 = v40.resize((int(v40.width * 48 / v40.height), 48), Image.LANCZOS)

comp = Image.new('RGB', (max(s.width for s in [sim36, sim38, sim40]) + 40, 48 * 3 + 60), (255, 255, 255))
y = 15
for s in [sim36, sim38, sim40]:
    comp.paste(s, (20, y), s)
    y += 48 + 15
comp.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/comp_title_sizes.png')

print("All size options generated!")
