import cv2
import numpy as np
from PIL import Image

# Load original uploaded image
src_path = 'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/.user_uploaded/media_1794984823247_fee14bc8.png'
im = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(im)

# Original emblem: y 0..112, x 80..238
# Find tight bounding box of emblem
mask_emb = a[:114, :] > 10
pts_emb = np.argwhere(mask_emb)
y0_e, x0_e = pts_emb.min(axis=0)
y1_e, x1_e = pts_emb.max(axis=0)
print(f"Emblem bbox: y={y0_e}..{y1_e} (h={y1_e-y0_e+1}), x={x0_e}..{x1_e} (w={x1_e-x0_e+1})")

# Original text: y 114..157
mask_txt = a[114:, :] > 10
pts_txt = np.argwhere(mask_txt)
y0_t, x0_t = pts_txt.min(axis=0)
y1_t, x1_t = pts_txt.max(axis=0)
y0_t += 114
y1_t += 114
print(f"Text bbox: y={y0_t}..{y1_t} (h={y1_t-y0_t+1}), x={x0_t}..{x1_t} (w={x1_t-x0_t+1})")

# Crop original emblem and text
emblem_crop = im[y0_e:y1_e+1, x0_e:x1_e+1]
text_crop = im[y0_t:y1_t+1, x0_t:x1_t+1]

# Convert to PIL
emb_pil = Image.fromarray(cv2.cvtColor(emblem_crop, cv2.COLOR_BGRA2RGBA))
txt_pil = Image.fromarray(cv2.cvtColor(text_crop, cv2.COLOR_BGRA2RGBA))

# Layout 1: 1:1 original scale shifted horizontally
ew, eh = emb_pil.size
tw, th = txt_pil.size

gap = 16
pad_x = 8
pad_y = 6

canvas_w = pad_x + ew + gap + tw + pad_x
canvas_h = max(eh, th) + pad_y * 2

canvas1 = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
# Paste emblem
ey = (canvas_h - eh) // 2
canvas1.paste(emb_pil, (pad_x, ey), emb_pil)
# Paste text vertically centered
ty = (canvas_h - th) // 2
canvas1.paste(txt_pil, (pad_x + ew + gap, ty), txt_pil)

canvas1.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/shifted_1x.png')

# Layout 2: High-Resolution 2x / 4x with Lanczos resampling
# To ensure maximum crispness without pixelation on Retina screens:
SCALE = 3.0 # 3x master
ew_3x, eh_3x = int(ew * SCALE), int(eh * SCALE)
tw_3x, th_3x = int(tw * SCALE), int(th * SCALE)

emb_3x = emb_pil.resize((ew_3x, eh_3x), Image.LANCZOS)
txt_3x = txt_pil.resize((tw_3x, th_3x), Image.LANCZOS)

gap_3x = int(gap * SCALE)
pad_x_3x = int(pad_x * SCALE)
pad_y_3x = int(pad_y * SCALE)

total_w_3x = pad_x_3x + ew_3x + gap_3x + tw_3x + pad_x_3x
total_h_3x = max(eh_3x, th_3x) + pad_y_3x * 2

canvas_3x = Image.new('RGBA', (total_w_3x, total_h_3x), (0, 0, 0, 0))
ey_3x = (total_h_3x - eh_3x) // 2
canvas_3x.paste(emb_3x, (pad_x_3x, ey_3x), emb_3x)
ty_3x = (total_h_3x - th_3x) // 2
canvas_3x.paste(txt_3x, (pad_x_3x + ew_3x + gap_3x, ty_3x), txt_3x)

canvas_3x.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/shifted_3x.png')

# Layout 3: Text slightly scaled up (1.2x) relative to emblem for enhanced header legibility
SCALE_T = 1.25
tw_boost = int(tw * SCALE * SCALE_T)
th_boost = int(th * SCALE * SCALE_T)
txt_boost = txt_pil.resize((tw_boost, th_boost), Image.LANCZOS)

total_w_b = pad_x_3x + ew_3x + gap_3x + tw_boost + pad_x_3x
total_h_b = max(eh_3x, th_boost) + pad_y_3x * 2
canvas_boost = Image.new('RGBA', (total_w_b, total_h_b), (0, 0, 0, 0))
canvas_boost.paste(emb_3x, (pad_x_3x, (total_h_b - eh_3x) // 2), emb_3x)
canvas_boost.paste(txt_boost, (pad_x_3x + ew_3x + gap_3x, (total_h_b - th_boost) // 2), txt_boost)

canvas_boost.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/shifted_boost.png')

print("Generated shifted_1x, shifted_3x, and shifted_boost successfully!")
