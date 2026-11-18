import cv2
import numpy as np
from PIL import Image

src_path = 'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/.user_uploaded/media_1794984823247_fee14bc8.png'
im = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(im)

# Emblem crop (tight)
# Original emblem: y 0..109, x 83..234
emb = im[0:110, 83:235]
# Text crop (tight)
# Original text: y 118..156, x 0..319
txt = im[116:157, 0:320]

# Let's clean up emblem to ensure brand blue #0F7AE0 is vibrant and badge text is pure white
emb_b, emb_g, emb_r, emb_a = cv2.split(emb)
BRAND_B, BRAND_G, BRAND_R = 224, 122, 15

# Colorize emblem:
for y in range(emb.shape[0]):
    for x in range(emb.shape[1]):
        if emb_a[y, x] > 20:
            # Check if this pixel is inside the "O.G. HEAVY DUTY" white badge
            # In original image, badge was around y: 52..67, x: 135..230 (in emb coords: x - 83 = 52..147)
            is_white_badge = (
                50 <= y <= 69
                and 48 <= x <= 152
                and emb_r[y, x] > 170
                and emb_g[y, x] > 170
                and emb_b[y, x] > 170
            )
            if is_white_badge:
                emb_b[y, x], emb_g[y, x], emb_r[y, x] = 255, 255, 255
            elif emb_b[y, x] > 150: # Blue regions
                emb_b[y, x], emb_g[y, x], emb_r[y, x] = BRAND_B, BRAND_G, BRAND_R

emb_cleaned = cv2.merge([emb_b, emb_g, emb_r, emb_a])

# Text cleanup: ensure deep slate black #0F172A
txt_b, txt_g, txt_r, txt_a = cv2.split(txt)
DARK_B, DARK_G, DARK_R = 42, 23, 15 # #0F172A in BGR
for y in range(txt.shape[0]):
    for x in range(txt.shape[1]):
        if txt_a[y, x] > 10:
            txt_b[y, x], txt_g[y, x], txt_r[y, x] = DARK_B, DARK_G, DARK_R

txt_cleaned = cv2.merge([txt_b, txt_g, txt_r, txt_a])

# Now scale to 2x master
# Emblem: 152x110 -> 304x220
# Text: 320x41 -> 640x82
SCALE = 2.0
emb_2x = cv2.resize(emb_cleaned, (int(emb.shape[1] * SCALE), int(emb.shape[0] * SCALE)), interpolation=cv2.INTER_LANCZOS4)
txt_2x = cv2.resize(txt_cleaned, (int(txt.shape[1] * SCALE), int(txt.shape[0] * SCALE)), interpolation=cv2.INTER_LANCZOS4)

# Create horizontal composite:
ew, eh = emb_2x.shape[1], emb_2x.shape[0]
tw, th = txt_2x.shape[1], txt_2x.shape[0]

gap = int(24 * (SCALE / 2.0))
pad_x = int(12 * (SCALE / 2.0))
pad_y = int(8 * (SCALE / 2.0))

total_w = pad_x + ew + gap + tw + pad_x
total_h = max(eh, th) + pad_y * 2

canvas = np.zeros((total_h, total_w, 4), dtype=np.uint8)

# Place emblem
ey = (total_h - eh) // 2
canvas[ey:ey+eh, pad_x:pad_x+ew] = emb_2x

# Place text vertically centered
ty = (total_h - th) // 2
tx = pad_x + ew + gap

# Alpha blend text onto canvas
txt_alpha = txt_2x[:, :, 3:4] / 255.0
canvas[ty:ty+th, tx:tx+tw] = (txt_2x * txt_alpha + canvas[ty:ty+th, tx:tx+tw] * (1 - txt_alpha)).astype(np.uint8)

# Save 2x and 1x
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-horizontal-2x.png', canvas)
canvas_1x = cv2.resize(canvas, (total_w // 2, total_h // 2), interpolation=cv2.INTER_AREA)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-horizontal.png', canvas_1x)

# Copy to brain for preview
cv2.imwrite('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/preview_original_shifted_2x.png', canvas)
cv2.imwrite('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/preview_original_shifted_1x.png', canvas_1x)

print(f"Shifted original logo created! 2x: {total_w}x{total_h}, 1x: {total_w//2}x{total_h//2}")
