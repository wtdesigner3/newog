import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# 1. Base original image
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

# Tightly crop emblem from original:
crop_b = b_pre[0:110, 83:235]
crop_g = g_pre[0:110, 83:235]
crop_r = r_pre[0:110, 83:235]
crop_a = a_f[0:110, 83:235]

# Scale emblem to high-res:
EMB_H = 196
EMB_W = int(152 * EMB_H / 110)

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

# Canvas: 640 wide x 286 tall
CANVAS_W = 640
CANVAS_H = 286
canvas = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))

# Place emblem horizontally centered
emb_x = (CANVAS_W - EMB_W) // 2
canvas.paste(emb_pil, (emb_x, 4), emb_pil)

# Render Typography
draw = ImageDraw.Draw(canvas)
font_l1 = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 31)
font_l2 = ImageFont.truetype('C:/Windows/Fonts/georgiaz.ttf', 33)

t1 = 'OPERATIONALLY GENIUS HEAVY DUTY'
t2 = "Your family's air-care expert"

# Line 1: Arial Bold
bb1 = draw.textbbox((0, 0), t1, font=font_l1)
w1 = bb1[2] - bb1[0]
h1 = bb1[3] - bb1[1]
x1 = (CANVAS_W - w1) // 2
y1 = EMB_H + 9
draw.text((x1, y1), t1, font=font_l1, fill=(15, 23, 42, 255))

# Line 2: Georgia Bold Italic
bb2 = draw.textbbox((0, 0), t2, font=font_l2)
w2 = bb2[2] - bb2[0]
h2 = bb2[3] - bb2[1]
x2 = (CANVAS_W - w2) // 2
y2 = y1 + h1 + 7
draw.text((x2, y2), t2, font=font_l2, fill=(15, 23, 42, 255))

# Accent lines flanking Line 2
line_y = y2 + h2 // 2 + 1
rule_w = (x2 - 25) // 2
draw.line([(x2 - 12 - rule_w, line_y), (x2 - 12, line_y)], fill=(15, 23, 42, 255), width=3)
draw.line([(x2 + w2 + 12, line_y), (x2 + w2 + 12 + rule_w, line_y)], fill=(15, 23, 42, 255), width=3)

# 2x Master output
out_2x = canvas
# 1x Master output
out_1x = canvas.resize((320, 143), Image.LANCZOS)

# Save to public/images/
dest_dir = 'd:/rahul latest/ogheavyduty-next/public/images/'
out_2x.save(dest_dir + 'og-logo-black-readable-2x.png')
out_1x.save(dest_dir + 'og-logo-black-readable.png')

# Also sync to existing variant filenames so any cache/reference gets the readable version
out_2x.save(dest_dir + 'og-logo-black-medium-2x.png')
out_1x.save(dest_dir + 'og-logo-black-medium.png')
out_2x.save(dest_dir + 'og-logo-black-clean-2x.png')
out_1x.save(dest_dir + 'og-logo-black-clean.png')
out_2x.save(dest_dir + 'og-logo-black-2x.png')
out_1x.save(dest_dir + 'og-logo-black.png')
out_2x.save(dest_dir + 'og-logo-dark-2x.png')
out_1x.save(dest_dir + 'og-logo-dark.png')

print("All destination files written successfully!")
