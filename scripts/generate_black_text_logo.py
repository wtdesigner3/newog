import cv2
import numpy as np

# Load original base logo
orig = cv2.imread('d:/rahul latest/ogheavyduty-next/public/images/og-logo.png', cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(orig)

BRAND_B, BRAND_G, BRAND_R = 224, 122, 15
DARK_B, DARK_G, DARK_R = 15, 23, 42  # Deep crisp slate black (#0F172A)

# 1. Emblem (y < 114): Ensure full brand blue without any white fringe
for y in range(0, 114):
    for x in range(320):
        if not (53 <= y <= 66 and 132 <= x <= 193):
            b[y, x] = BRAND_B
            g[y, x] = BRAND_G
            r[y, x] = BRAND_R

# 2. Text (y >= 114): Deep bold black with boosted stroke density for maximum legibility
text_a = a[114:157, :].copy()
kernel = np.ones((2, 2), np.uint8)
dilated = cv2.dilate(text_a, kernel, iterations=1)
boosted_a = np.maximum(text_a, (dilated * 0.75).astype(np.uint8))
mask = boosted_a > 10
val = boosted_a[mask] / 255.0
boosted_a[mask] = np.clip((val ** 0.55) * 255, 0, 255).astype(np.uint8)
a[114:157, :] = boosted_a

for y in range(114, 157):
    for x in range(320):
        b[y, x] = DARK_B
        g[y, x] = DARK_G
        r[y, x] = DARK_R

# 2x High DPI rendering with premultiplied alpha Lanczos scaling
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

# Non-opaque background RGB to prevent anti-aliasing color bleeding:
b_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_B
g_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_G
r_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_R

b_out_2x[228:, :][~mask_2x[228:, :]] = DARK_B
g_out_2x[228:, :][~mask_2x[228:, :]] = DARK_G
r_out_2x[228:, :][~mask_2x[228:, :]] = DARK_R

a_out_2x = np.clip(a_2x * 255.0, 0, 255).astype(np.uint8)

# Save standard 1x and high-DPI 2x variants
out_1x = cv2.merge([b, g, r, a])
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-black.png', out_1x)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-dark.png', out_1x)

out_2x = cv2.merge([
    b_out_2x.astype(np.uint8),
    g_out_2x.astype(np.uint8),
    r_out_2x.astype(np.uint8),
    a_out_2x
])
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-black-2x.png', out_2x)
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-dark-2x.png', out_2x)
print('Successfully generated og-logo-black.png, og-logo-dark.png, og-logo-black-2x.png, and og-logo-dark-2x.png')
