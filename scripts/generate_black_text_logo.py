import cv2
import numpy as np

# Load original clean logo
orig = cv2.imread('d:/rahul latest/ogheavyduty-next/public/images/og-logo.png', cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(orig)

BRAND_B, BRAND_G, BRAND_R = 224, 122, 15
DARK_B, DARK_G, DARK_R = 15, 23, 42  # Deep crisp slate black (#0F172A)

# 1. Emblem (y < 114):
# White badge text 'O.G. HEAVY DUTY' spans y: 52..67, x: 135..230
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

# 2. Text (y >= 114):
# Natural, un-bloated typography: preserve original letter weights and open counters
for y in range(114, 157):
    for x in range(320):
        b[y, x] = DARK_B
        g[y, x] = DARK_G
        r[y, x] = DARK_R
        # Keep original alpha channel exactly as designed without artificial dilation

# 3. Save standard 1x resolution
out_1x = cv2.merge([b, g, r, a])
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-black.png', out_1x)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-dark.png', out_1x)

# 4. 2x High-DPI version using premultiplied alpha Lanczos scaling
b_f = b.astype(np.float32)
g_f = g.astype(np.float32)
r_f = r.astype(np.float32)
a_f = a.astype(np.float32) / 255.0

b_pre = b_f * a_f
g_pre = g_f * a_f
r_pre = r_f * a_f

b_2x = cv2.resize(b_pre, (640, 314), interpolation=cv2.INTER_LANCZOS4)
g_2x = cv2.resize(g_pre, (640, 314), interpolation=cv2.INTER_LANCZOS4)
r_2x = cv2.resize(r_pre, (640, 314), interpolation=cv2.INTER_LANCZOS4)
a_2x = cv2.resize(a_f, (640, 314), interpolation=cv2.INTER_LANCZOS4)

eps = 1e-5
mask_2x = a_2x > eps
b_out_2x = np.zeros_like(b_2x)
g_out_2x = np.zeros_like(g_2x)
r_out_2x = np.zeros_like(r_2x)

b_out_2x[mask_2x] = np.clip(b_2x[mask_2x] / a_2x[mask_2x], 0, 255)
g_out_2x[mask_2x] = np.clip(g_2x[mask_2x] / a_2x[mask_2x], 0, 255)
r_out_2x[mask_2x] = np.clip(r_2x[mask_2x] / a_2x[mask_2x], 0, 255)

# Non-opaque background RGB to prevent fringe
b_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_B
g_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_G
r_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_R

b_out_2x[228:, :][~mask_2x[228:, :]] = DARK_B
g_out_2x[228:, :][~mask_2x[228:, :]] = DARK_G
r_out_2x[228:, :][~mask_2x[228:, :]] = DARK_R

a_out_2x = np.clip(a_2x * 255.0, 0, 255).astype(np.uint8)

out_2x = cv2.merge([
    b_out_2x.astype(np.uint8),
    g_out_2x.astype(np.uint8),
    r_out_2x.astype(np.uint8),
    a_out_2x
])

cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-black-2x.png', out_2x)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-dark-2x.png', out_2x)
print('Successfully generated clean, readable og-logo-black.png and og-logo-black-2x.png!')
