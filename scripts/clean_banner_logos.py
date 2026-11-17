import cv2
import numpy as np
import os

BASE_DIR = r"D:\rahul latest\ogheavyduty-next\public\images"

def clean_window_ac():
    path = os.path.join(BASE_DIR, "banner_window_ac_horizontal.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return
    
    # Inpaint Haier logo and R32 text on horizontal band:
    # y 334 to 348, x 545 to 600
    # y 337 to 346, x 636 to 650
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[334:348, 545:600] = 255
    mask[337:346, 636:650] = 255

    # Side barcode label: y 370 to 520, x 385 to 420
    mask[370:520, 385:420] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)

    # Let's smooth over the Haier area using clean neighbor texture from x 480 to 535
    src_patch = cleaned[326:348, 480:535]
    patch = cv2.resize(src_patch, (55, 22))
    # Adjust lighting
    mean_src = np.mean(patch, axis=(0,1))
    mean_tgt = (np.mean(cleaned[326:348, 540:545], axis=(0,1)) + np.mean(cleaned[326:348, 600:605], axis=(0,1))) / 2.0
    patch = np.clip(patch.astype(np.float32) + (mean_tgt - mean_src), 0, 255).astype(np.uint8)
    
    # Alpha blend softly
    w = 55
    alpha = np.ones((22, w, 1), dtype=np.float32)
    for i in range(8):
        alpha[:, i, :] = i / 8.0
        alpha[:, w - 1 - i, :] = i / 8.0
    cleaned[326:348, 545:600] = (patch * alpha + cleaned[326:348, 545:600] * (1.0 - alpha)).astype(np.uint8)

    cv2.imwrite(path, cleaned)
    print("Cleaned banner_window_ac_horizontal.jpg")

def clean_survivor_ac():
    path = os.path.join(BASE_DIR, "banner_survivor_ac_horizontal.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return

    # TRANE logo badge: y 272 to 320, x 535 to 630
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[272:320, 535:630] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=4, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(path, cleaned)
    print("Cleaned banner_survivor_ac_horizontal.jpg")

def clean_split_ac():
    path = os.path.join(BASE_DIR, "banner_split_ac_horizontal.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    # Left logo on indoor unit: y 178 to 192, x 346 to 380
    mask[178:192, 346:380] = 255
    # Right mark under LED: y 214 to 220, x 553 to 570
    mask[214:220, 553:570] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=2, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(path, cleaned)
    print("Cleaned banner_split_ac_horizontal.jpg")

def clean_cassette_ac():
    path = os.path.join(BASE_DIR, "banner_cassette_ac_horizontal.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return

    # Mitsubishi 3 diamonds and text: y 165 to 187, x 645 to 732
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[165:187, 645:732] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(path, cleaned)
    print("Cleaned banner_cassette_ac_horizontal.jpg")

def clean_residence_ac():
    path = os.path.join(BASE_DIR, "banner_application_residence.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    # Mitsubishi logo: y 169 to 180, x 272 to 306
    mask[169:180, 272:306] = 255
    # Right corner icons: y 206 to 222, x 388 to 402
    mask[206:222, 388:402] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=2, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(path, cleaned)
    print("Cleaned banner_application_residence.jpg")

def clean_ductable_ac():
    path = os.path.join(BASE_DIR, "banner_ductable_ac_horizontal.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    # Foreground iMac Apple logo: y 548 to 602, x 962 to 990
    mask[548:602, 962:990] = 255
    # Far left iMac Apple logo: y 535 to 558, x 128 to 145
    mask[535:558, 128:145] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(path, cleaned)
    print("Cleaned banner_ductable_ac_horizontal.jpg")

def clean_banquet_ac():
    path = os.path.join(BASE_DIR, "banner_application_banquet.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return

    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    # Left tower Haier text: y 395 to 408, x 195 to 222
    mask[395:408, 195:222] = 255
    # Right tower Haier text: y 395 to 408, x 1168 to 1198
    mask[395:408, 1168:1198] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(path, cleaned)
    print("Cleaned banner_application_banquet.jpg")

def clean_restaurant_ac():
    path = os.path.join(BASE_DIR, "banner_application_restaurant.jpg")
    img = cv2.imread(path)
    if img is None:
        print("Failed to load", path)
        return

    # Inpaint text on central cassette rim:
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    # Top rim text: y 98 to 110, x 630 to 710
    mask[98:110, 630:710] = 255
    # Bottom rim text: y 228 to 238, x 630 to 710
    mask[228:238, 630:710] = 255
    # Left rim text: y 140 to 195, x 580 to 595
    mask[140:195, 580:595] = 255
    # Right rim text: y 140 to 195, x 748 to 763
    mask[140:195, 748:763] = 255

    cleaned = cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
    cv2.imwrite(path, cleaned)
    print("Cleaned banner_application_restaurant.jpg")

if __name__ == "__main__":
    clean_window_ac()
    clean_survivor_ac()
    clean_split_ac()
    clean_cassette_ac()
    clean_residence_ac()
    clean_ductable_ac()
    clean_banquet_ac()
    clean_restaurant_ac()
    print("All banner images cleaned successfully!")
