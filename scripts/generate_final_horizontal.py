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

# Tightly crop emblem: y: 0..110, x: 83..235 (152x110)
crop_b = b_pre[0:110, 83:235]
crop_g = g_pre[0:110, 83:235]
crop_r = r_pre[0:110, 83:235]
crop_a = a_f[0:110, 83:235]

# Scale emblem for 2x canvas: Height = 140px, Width = 193px
EMB_H = 140
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

def create_horizontal_variant(subtitle_text, subtitle_font, subtitle_size, filename_prefix):
    dummy = Image.new('RGBA', (10, 10))
    d = ImageDraw.Draw(dummy)
    f_title = ImageFont.truetype('C:/Windows/Fonts/arialbi.ttf', 46)
    f_sub = ImageFont.truetype(subtitle_font, subtitle_size)
    
    title_text = "O.G. HEAVY DUTY"
    bb_t = d.textbbox((0, 0), title_text, font=f_title)
    wt = bb_t[2] - bb_t[0]
    ht = bb_t[3] - bb_t[1]
    
    bb_s = d.textbbox((0, 0), subtitle_text, font=f_sub)
    ws = bb_s[2] - bb_s[0]
    hs = bb_s[3] - bb_s[1]
    
    text_w = max(wt, ws)
    gap = 20
    pad_left = 6
    pad_right = 16
    total_w = pad_left + EMB_W + gap + text_w + pad_right
    total_h = 152
    
    canvas = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    
    # Emblem vertically centered
    ey = (total_h - EMB_H) // 2
    canvas.paste(emb_pil, (pad_left, ey), emb_pil)
    
    draw = ImageDraw.Draw(canvas)
    tx = pad_left + EMB_W + gap
    
    # Title
    ty = ey + 14
    draw.text((tx, ty), title_text, font=f_title, fill=(15, 23, 42, 255))
    
    # Divider Rule
    line_y = ty + ht + 10
    draw.line([(tx, line_y), (tx + text_w, line_y)], fill=(15, 23, 42, 255), width=3)
    
    # Subtitle
    sy = line_y + 9
    draw.text((tx, sy), subtitle_text, font=f_sub, fill=(15, 23, 42, 255))
    
    # Save 2x and 1x
    dest_dir = 'd:/rahul latest/ogheavyduty-next/public/images/'
    canvas.save(dest_dir + f'{filename_prefix}-2x.png')
    
    out_1x = canvas.resize((total_w // 2, total_h // 2), Image.LANCZOS)
    out_1x.save(dest_dir + f'{filename_prefix}.png')
    
    return canvas

# Variant A: "Your family's air-care expert" (Georgia Bold Italic)
v_aircare = create_horizontal_variant(
    "Your family's air-care expert",
    'C:/Windows/Fonts/georgiaz.ttf',
    27,
    'og-logo-horizontal-aircare'
)

# Variant B: "Operationally Genius Products" (Arial Bold Italic)
v_products = create_horizontal_variant(
    '“Operationally Genius Products”',
    'C:/Windows/Fonts/arialbd.ttf',
    25,
    'og-logo-horizontal'
)

# Save both to brain for inspection
v_aircare.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/preview_horizontal_aircare_2x.png')
v_products.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/preview_horizontal_products_2x.png')

print("Horizontal logos created successfully!")
