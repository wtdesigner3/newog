import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# 1. Load original clean logo for the emblem
orig = cv2.imread('d:/rahul latest/ogheavyduty-next/public/images/og-logo.png', cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(orig)
BRAND_B, BRAND_G, BRAND_R = 224, 122, 15

# Clean emblem area (y < 114)
# Preserve full white badge text 'O.G. HEAVY DUTY' spanning y: 52..67, x: 135..230
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
            b[y, x] = 255
            g[y, x] = 255
            r[y, x] = 255
        else:
            b[y, x] = BRAND_B
            g[y, x] = BRAND_G
            r[y, x] = BRAND_R

# 2. Scale emblem to 2x (640 x 228) using alpha-aware Lanczos
b_f = b.astype(np.float32)
g_f = g.astype(np.float32)
r_f = r.astype(np.float32)
a_f = a.astype(np.float32) / 255.0
b_pre, g_pre, r_pre = b_f * a_f, g_f * a_f, r_f * a_f

b_2x = cv2.resize(b_pre[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)
g_2x = cv2.resize(g_pre[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)
r_2x = cv2.resize(r_pre[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)
a_2x = cv2.resize(a_f[:114, :], (640, 228), interpolation=cv2.INTER_LANCZOS4)

eps = 1e-5
mask_2x = a_2x > eps
b_emblem = np.zeros_like(b_2x)
g_emblem = np.zeros_like(g_2x)
r_emblem = np.zeros_like(r_2x)
b_emblem[mask_2x] = np.clip(b_2x[mask_2x] / a_2x[mask_2x], 0, 255)
g_emblem[mask_2x] = np.clip(g_2x[mask_2x] / a_2x[mask_2x], 0, 255)
r_emblem[mask_2x] = np.clip(r_2x[mask_2x] / a_2x[mask_2x], 0, 255)
b_emblem[~mask_2x] = BRAND_B
g_emblem[~mask_2x] = BRAND_G
r_emblem[~mask_2x] = BRAND_R
a_emblem = np.clip(a_2x * 255.0, 0, 255).astype(np.uint8)

# 3. Create 2x Master Canvas (640 x 314)
canvas = Image.new('RGBA', (640, 314), (0, 0, 0, 0))
emblem_pil = Image.fromarray(cv2.merge([
    r_emblem.astype(np.uint8),
    g_emblem.astype(np.uint8),
    b_emblem.astype(np.uint8),
    a_emblem
]))
canvas.paste(emblem_pil, (0, 0), emblem_pil)

# 4. Render clean, light-weight, high-legibility typography
draw = ImageDraw.Draw(canvas)
font_l1 = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 24)
font_l2 = ImageFont.truetype('C:/Windows/Fonts/georgiai.ttf', 21)

text_l1 = 'OPERATIONALLY  GENIUS  HEAVY  DUTY'
text_l2 = "Your family's air-care expert"

# Center Line 1 (Clean regular sans-serif, spacious kerning)
bbox1 = draw.textbbox((0, 0), text_l1, font=font_l1)
w1 = bbox1[2] - bbox1[0]
x1 = (640 - w1) // 2
y1 = 236
draw.text((x1, y1), text_l1, font=font_l1, fill=(15, 23, 42, 255))

# Center Line 2 (Refined light italic serif)
bbox2 = draw.textbbox((0, 0), text_l2, font=font_l2)
w2 = bbox2[2] - bbox2[0]
x2 = (640 - w2) // 2
y2 = 272
draw.text((x2, y2), text_l2, font=font_l2, fill=(15, 23, 42, 240))

# Fine accent lines
line_y = y2 + 13
draw.line([(x2 - 80, line_y), (x2 - 15, line_y)], fill=(15, 23, 42, 220), width=2)
draw.line([(x2 + w2 + 15, line_y), (x2 + w2 + 80, line_y)], fill=(15, 23, 42, 220), width=2)

# Convert to OpenCV BGRA
canvas_np = np.array(canvas)
out_2x = cv2.cvtColor(canvas_np, cv2.COLOR_RGBA2BGRA)

# 5. Create 1x version (320 x 157) using high-quality area downsampling
out_1x = cv2.resize(out_2x, (320, 157), interpolation=cv2.INTER_AREA)

# Save both 2x and 1x variants
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-black-2x.png', out_2x)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-dark-2x.png', out_2x)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-black.png', out_1x)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-dark.png', out_1x)

print('Successfully generated refined, light-weight, ultra-readable logo assets!')
