import cv2
import numpy as np
from PIL import Image, ImageFont, ImageDraw

orig = Image.open('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/inspect_og_logo_original.png')
orig_2x = orig.resize((640, 314), Image.LANCZOS)
orig_2x.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/orig_2x_clean.png')

# Let's crop the text area from orig_2x
text_orig_2x = orig_2x.crop((0, 220, 640, 314))
text_orig_2x.save('C:/Users/LENOVO 2/.gemini/antigravity/brain/b700d335-92ad-4435-9806-0bae16884077/text_orig_2x.png')

print("Saved orig_2x_clean and text_orig_2x")
