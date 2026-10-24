"""Make the background of a capybara cut-out transparent.

Flood-fills light, low-saturation pixels connected to the image border, then feathers
the edge. Usage: cutout.py in.jpg out.png
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
light = (a.min(axis=2) > 205) & ((a.max(axis=2) - a.min(axis=2)) < 38)
lab, _ = ndimage.label(light)
edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, edge[edge > 0])
alpha = Image.fromarray(((~bg) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))
out = im.convert("RGBA")
out.putalpha(alpha)
bbox = out.getbbox()
out.crop(bbox).save(dst, optimize=True)
print(dst, out.crop(bbox).size)
