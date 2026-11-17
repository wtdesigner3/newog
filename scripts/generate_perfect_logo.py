import cv2
import numpy as np

# Load original base logo
orig = cv2.imread('d:/rahul latest/ogheavyduty-next/public/images/og-logo.png', cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(orig)

BRAND_B, BRAND_G, BRAND_R = 224, 122, 15

# Height: 157, Width: 320
# 1. In emblem area (y < 114):
# The inner badge text "O.G. HEAVY DUTY" is at y: 55..65, x: 130..195
# Everywhere else in the emblem area (y < 114), set RGB to brand blue!
for y in range(0, 114):
    for x in range(320):
        # If outside the inner white text of the badge
        if not (53 <= y <= 66 and 132 <= x <= 193):
            b[y, x] = BRAND_B
            g[y, x] = BRAND_G
            r[y, x] = BRAND_R

# 2. In text area below emblem (y >= 114):
# Make all pixels (visible and transparent) have RGB = 255, 255, 255 (crisp white)
for y in range(114, 157):
    for x in range(320):
        b[y, x] = 255
        g[y, x] = 255
        r[y, x] = 255

out_1x = cv2.merge([b, g, r, a])
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-white.png', out_1x)

# 3. For 2x High-DPI version (640x314):
# Scale with proper alpha-aware interpolation
# To resize RGBA properly without fringing:
# Convert to float
b_f = b.astype(np.float32)
g_f = g.astype(np.float32)
r_f = r.astype(np.float32)
a_f = a.astype(np.float32) / 255.0

# Premultiply
b_pre = b_f * a_f
g_pre = g_f * a_f
r_pre = r_f * a_f

# Resize premultiplied and alpha separately with LANCZOS4
b_2x = cv2.resize(b_pre, (640, 314), interpolation=cv2.INTER_LANCZOS4)
g_2x = cv2.resize(g_pre, (640, 314), interpolation=cv2.INTER_LANCZOS4)
r_2x = cv2.resize(r_pre, (640, 314), interpolation=cv2.INTER_LANCZOS4)
a_2x = cv2.resize(a_f, (640, 314), interpolation=cv2.INTER_LANCZOS4)

# Unpremultiply where a > 0
eps = 1e-5
mask_2x = a_2x > eps
b_out_2x = np.zeros_like(b_2x)
g_out_2x = np.zeros_like(g_2x)
r_out_2x = np.zeros_like(r_2x)

b_out_2x[mask_2x] = np.clip(b_2x[mask_2x] / a_2x[mask_2x], 0, 255)
g_out_2x[mask_2x] = np.clip(g_2x[mask_2x] / a_2x[mask_2x], 0, 255)
r_out_2x[mask_2x] = np.clip(r_2x[mask_2x] / a_2x[mask_2x], 0, 255)

# Set non-opaque / boundary RGB cleanly
# In emblem area (y < 228 in 2x): set non-opaque RGB to brand blue
b_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_B
g_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_G
r_out_2x[:228, :][~mask_2x[:228, :]] = BRAND_R

# In text area (y >= 228 in 2x): set non-opaque RGB to white
b_out_2x[228:, :][~mask_2x[228:, :]] = 255
g_out_2x[228:, :][~mask_2x[228:, :]] = 255
r_out_2x[228:, :][~mask_2x[228:, :]] = 255

a_out_2x = np.clip(a_2x * 255.0, 0, 255).astype(np.uint8)

out_2x = cv2.merge([
    b_out_2x.astype(np.uint8),
    g_out_2x.astype(np.uint8),
    r_out_2x.astype(np.uint8),
    a_out_2x
])
cv2.imwrite('d:/rahul latest/ogheavyduty-next/public/images/og-logo-white-2x.png', out_2x)
print("Successfully generated perfect og-logo-white.png and og-logo-white-2x.png!")
