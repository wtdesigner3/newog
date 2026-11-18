import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Load high-res emblem from our clean generator
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

# Scale emblem to height 160px for 2x canvas (80px at 1x)
EMB_H = 150
EMB_W = int(152 * EMB_H / 110) # ~ 207px

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

def make_horizontal_logo(title, subtitle, font_title_path, font_title_size, font_sub_path, font_sub_size, use_line=True):
    # Calculate text widths
    dummy = Image.new('RGBA', (10, 10))
    d = ImageDraw.Draw(dummy)
    f_title = ImageFont.truetype(font_title_path, font_title_size)
    f_sub = ImageFont.truetype(font_sub_path, font_sub_size)
    
    bb_t = d.textbbox((0, 0), title, font=f_title)
    wt = bb_t[2] - bb_t[0]
    ht = bb_t[3] - bb_t[1]
    
    bb_s = d.textbbox((0, 0), subtitle, font=f_sub)
    ws = bb_s[2] - bb_s[0]
    hs = bb_s[3] - bb_s[1]
    
    text_w = max(wt, ws)
    gap_emblem = 24
    padding_x = 10
    total_w = padding_x + EMB_W + gap_emblem + text_w + padding_x + 10
    total_h = 160
    
    canvas = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    
    # Paste emblem vertically centered
    ey = (total_h - EMB_H) // 2
    canvas.paste(emb_pil, (padding_x, ey), emb_pil)
    
    draw = ImageDraw.Draw(canvas)
    tx = padding_x + EMB_W + gap_emblem
    
    if use_line:
        # Title at top
        ty = ey + 18
        draw.text((tx, ty), title, font=f_title, fill=(15, 23, 42, 255))
        
        # Divider line
        line_y = ty + ht + 12
        line_w = text_w
        draw.line([(tx, line_y), (tx + line_w, line_y)], fill=(15, 23, 42, 255), width=3)
        
        # Subtitle below line
        sy = line_y + 10
        draw.text((tx, sy), subtitle, font=f_sub, fill=(15, 23, 42, 255))
    else:
        # Without line
        ty = ey + 24
        draw.text((tx, ty), title, font=f_title, fill=(15, 23, 42, 255))
        sy = ty + ht + 12
        draw.text((tx, sy), subtitle, font=f_sub, fill=(51, 65, 85, 255))
        
    return canvas

# Design H1: Official brand styling from og-logo.svg: "O.G. HEAVY DUTY" + "“Operationally Genius Products”"
h1 = make_horizontal_logo(
    "O.G. HEAVY DUTY",
    "“Operationally Genius Products”",
    'C:/Windows/Fonts/arialbi.ttf', # Arial Bold Italic
    48,
    'C:/Windows/Fonts/arialbd.ttf', # Arial Bold
    26,
    use_line=True
)

# Design H2: "O.G. HEAVY DUTY" + "Your family's air-care expert"
h2 = make_horizontal_logo(
    "O.G. HEAVY DUTY",
    "Your family's air-care expert",
    'C:/Windows/Fonts/arialbi.ttf',
    48,
    'C:/Windows/Fonts/georgiaz.ttf', # Georgia Bold Italic
    28,
    use_line=True
)

# Design H3: "OPERATIONALLY GENIUS HEAVY DUTY" + "Your family's air-care expert"
h3 = make_horizontal_logo(
    "OPERATIONALLY GENIUS HEAVY DUTY",
    "Your family's air-care expert",
    'C:/Windows/Fonts/arialbd.ttf', # Arial Bold
    34,
    'C:/Windows/Fonts/georgiaz.ttf',
    28,
    use_line=True
)

# Design H4: Clean Modern Sans "O.G. HEAVY DUTY" + "Operationally Genius Air Care"
h4 = make_horizontal_logo(
    "O.G. HEAVY DUTY",
    "AIR CONDITIONERS • NEW DELHI",
    'C:/Windows/Fonts/segoeuib.ttf',
    46,
    'C:/Windows/Fonts/seguisb.ttf',
    22,
    use_line=True
)

h1.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/horiz_h1.png')
h2.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/horiz_h2.png')
h3.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/horiz_h3.png')
h4.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/horiz_h4.png')

# Also simulate how each looks when scaled to 52px header height
for name, img in [('h1', h1), ('h2', h2), ('h3', h3), ('h4', h4)]:
    h52 = img.resize((int(img.width * 52 / img.height), 52), Image.LANCZOS)
    h52.save(f'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/sim_52px_{name}.png')

print("All horizontal designs generated!")
