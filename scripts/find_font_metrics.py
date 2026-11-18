from PIL import Image, ImageFont, ImageDraw

canvas = Image.new('RGBA', (640, 314), (0, 0, 0, 0))
draw = ImageDraw.Draw(canvas)

print("--- Line 1 Arial Bold ---")
for size in range(28, 44, 2):
    f = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', size)
    bb = draw.textbbox((0, 0), 'OPERATIONALLY GENIUS HEAVY DUTY', font=f)
    w = bb[2] - bb[0]
    h = bb[3] - bb[1]
    if w <= 620:
        print(f'size {size}: width={w}, height={h}')

print("--- Line 2 Georgia Bold Italic ---")
for size in range(28, 44, 2):
    f = ImageFont.truetype('C:/Windows/Fonts/georgiaz.ttf', size)
    bb = draw.textbbox((0, 0), "Your family's air-care expert", font=f)
    w = bb[2] - bb[0]
    h = bb[3] - bb[1]
    if w <= 540:
        print(f'size {size}: width={w}, height={h}')
