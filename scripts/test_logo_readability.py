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

# Crop emblem bounding box tightly
# Original emblem bbox: y: 0..109, x: 83..234
emblem_crop_b = b_pre[:112, 80:238]
emblem_crop_g = g_pre[:112, 80:238]
emblem_crop_r = r_pre[:112, 80:238]
emblem_crop_a = a_f[:112, 80:238]

# Resize emblem to high-res (e.g. height 220px, width ~310px)
EH = 210
EW = int(158 * (EH / 112)) # ~ 296
e_b = cv2.resize(emblem_crop_b, (EW, EH), interpolation=cv2.INTER_LANCZOS4)
e_g = cv2.resize(emblem_crop_g, (EW, EH), interpolation=cv2.INTER_LANCZOS4)
e_r = cv2.resize(emblem_crop_r, (EW, EH), interpolation=cv2.INTER_LANCZOS4)
e_a = cv2.resize(emblem_crop_a, (EW, EH), interpolation=cv2.INTER_LANCZOS4)

eps = 1e-5
mask = e_a > eps
emblem_out = np.zeros((EH, EW, 4), dtype=np.uint8)
emblem_out[:, :, 0] = np.where(mask, np.clip(e_r / e_a, 0, 255), BRAND_R).astype(np.uint8)
emblem_out[:, :, 1] = np.where(mask, np.clip(e_g / e_a, 0, 255), BRAND_G).astype(np.uint8)
emblem_out[:, :, 2] = np.where(mask, np.clip(e_b / e_a, 0, 255), BRAND_B).astype(np.uint8)
emblem_out[:, :, 3] = np.clip(e_a * 255.0, 0, 255).astype(np.uint8)

emblem_pil = Image.fromarray(emblem_out, 'RGBA')

def create_logo_variant(canvas_w, canvas_h, emblem_scale, font1_name, font1_size, font2_name, font2_size, stroke2, gap1, gap2):
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    # Resize emblem
    ew_cur = int(EW * emblem_scale)
    eh_cur = int(EH * emblem_scale)
    emb_scaled = emblem_pil.resize((ew_cur, eh_cur), Image.LANCZOS)
    
    ex = (canvas_w - ew_cur) // 2
    canvas.paste(emb_scaled, (ex, 0), emb_scaled)
    
    draw = ImageDraw.Draw(canvas)
    f1 = ImageFont.truetype(f'C:/Windows/Fonts/{font1_name}', font1_size)
    f2 = ImageFont.truetype(f'C:/Windows/Fonts/{font2_name}', font2_size)
    
    t1 = 'OPERATIONALLY GENIUS HEAVY DUTY'
    t2 = "Your family's air-care expert"
    
    # Line 1
    bb1 = draw.textbbox((0, 0), t1, font=f1)
    w1 = bb1[2] - bb1[0]
    h1 = bb1[3] - bb1[1]
    x1 = (canvas_w - w1) // 2
    y1 = eh_cur + gap1
    draw.text((x1, y1), t1, font=f1, fill=(15, 23, 42, 255))
    
    # Line 2
    bb2 = draw.textbbox((0, 0), t2, font=f2, stroke_width=stroke2)
    w2 = bb2[2] - bb2[0]
    h2 = bb2[3] - bb2[1]
    x2 = (canvas_w - w2) // 2
    y2 = y1 + h1 + gap2
    draw.text((x2, y2), t2, font=f2, fill=(15, 23, 42, 255), stroke_width=stroke2, stroke_fill=(15, 23, 42, 255))
    
    # Accent lines flanking line 2
    line_y = y2 + h2 // 2 + 1
    rule_len = max(30, (x2 - 30) // 2)
    draw.line([(x2 - 15 - rule_len, line_y), (x2 - 15, line_y)], fill=(15, 23, 42, 255), width=3)
    draw.line([(x2 + w2 + 15, line_y), (x2 + w2 + 15 + rule_len, line_y)], fill=(15, 23, 42, 255), width=3)
    
    return canvas

# Let's generate a few variations:
# Canvas 640 x 300
# Var 1: Arial Bold + Georgia Bold Italic (strong solid strokes)
v1 = create_logo_variant(640, 310, 0.95, 'arialbd.ttf', 31, 'georgiaz.ttf', 27, 0.0, 10, 10)

# Var 2: Tahoma Bold + Georgia Bold Italic (screen optimized)
v2 = create_logo_variant(640, 310, 0.95, 'tahomabd.ttf', 30, 'georgiaz.ttf', 27, 0.0, 10, 10)

# Var 3: Verdana Bold + Georgia Bold Italic (maximum x-height & wide counters)
v3 = create_logo_variant(640, 310, 0.92, 'verdanab.ttf', 28, 'georgiaz.ttf', 26, 0.0, 10, 10)

# Var 4: Segoe UI Bold + Georgia Bold Italic
v4 = create_logo_variant(640, 310, 0.95, 'segoeuib.ttf', 31, 'georgiaz.ttf', 27, 0.0, 10, 10)

v1.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/test_v1_arial.png')
v2.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/test_v2_tahoma.png')
v3.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/test_v3_verdana.png')
v4.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/test_v4_segoe.png')

# Also simulate how each looks at 60px display height and 68px display height!
for name, img in [('v1', v1), ('v2', v2), ('v3', v3), ('v4', v4)]:
    h60 = img.resize((int(img.width * 60 / img.height), 60), Image.LANCZOS)
    h60.save(f'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/sim_60px_{name}.png')
    h68 = img.resize((int(img.width * 68 / img.height), 68), Image.LANCZOS)
    h68.save(f'C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/sim_68px_{name}.png')

print("All variations generated successfully!")
