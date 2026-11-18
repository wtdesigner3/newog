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

# Original emblem bbox in 320x157 image: y: 0..109, x: 83..234
# Resize emblem from 0..114 to 640x228 (same as 2x scale of original)
b_2x = cv2.resize(b_pre[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)
g_2x = cv2.resize(g_pre[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)
r_2x = cv2.resize(r_pre[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)
a_2x = cv2.resize(a_f[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)

eps = 1e-5
mask_2x = a_2x > eps
b_emblem = np.where(mask_2x, np.clip(b_2x / a_2x, 0, 255), BRAND_B).astype(np.uint8)
g_emblem = np.where(mask_2x, np.clip(g_2x / a_2x, 0, 255), BRAND_G).astype(np.uint8)
r_emblem = np.where(mask_2x, np.clip(r_2x / a_2x, 0, 255), BRAND_R).astype(np.uint8)
a_emblem = np.clip(a_2x * 255.0, 0, 255).astype(np.uint8)

canvas = Image.new('RGBA', (640, 314), (0, 0, 0, 0))
emblem_pil = Image.fromarray(cv2.merge([r_emblem, g_emblem, b_emblem, a_emblem]), 'RGBA')
canvas.paste(emblem_pil, (0, 0), emblem_pil)

# Render Typography exactly matching the original font choices and full proportions
draw = ImageDraw.Draw(canvas)
font_l1 = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 30)
font_l2 = ImageFont.truetype('C:/Windows/Fonts/georgiaz.ttf', 34)

text_l1 = 'OPERATIONALLY GENIUS HEAVY DUTY'
text_l2 = "Your family's air-care expert"

# Line 1: Arial Bold
bb1 = draw.textbbox((0, 0), text_l1, font=font_l1)
w1 = bb1[2] - bb1[0]
h1 = bb1[3] - bb1[1]
x1 = (640 - w1) // 2
y1 = 232
draw.text((x1, y1), text_l1, font=font_l1, fill=(15, 23, 42, 255))

# Line 2: Georgia Bold Italic
bb2 = draw.textbbox((0, 0), text_l2, font=font_l2)
w2 = bb2[2] - bb2[0]
h2 = bb2[3] - bb2[1]
x2 = (640 - w2) // 2
y2 = 268
draw.text((x2, y2), text_l2, font=font_l2, fill=(15, 23, 42, 255))

# Accent lines flanking line 2
line_y = y2 + h2 // 2 + 1
rule_w = (x2 - 30) // 2
draw.line([(x2 - 15 - rule_w, line_y), (x2 - 15, line_y)], fill=(15, 23, 42, 255), width=3)
draw.line([(x2 + w2 + 15, line_y), (x2 + w2 + 15 + rule_w, line_y)], fill=(15, 23, 42, 255), width=3)

# Save high-res master
canvas.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/master_true_readable_2x.png')

# Also simulate at 60px and 68px
sim60 = canvas.resize((int(640 * 60 / 314), 60), Image.LANCZOS)
sim60.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/sim_true_60px.png')

sim68 = canvas.resize((int(640 * 68 / 314), 68), Image.LANCZOS)
sim68.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/sim_true_68px.png')

print(f"Generated successfully! w1={w1}, h1={h1}, w2={w2}, h2={h2}")
