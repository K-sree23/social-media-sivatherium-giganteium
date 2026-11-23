"""Create a 150px transparent YouTube watermark from the original emblem."""
from math import hypot
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/EchoesOfYesterdayLogo.png'
DEST = ROOT / 'public/EchoesOfYesterday_Watermark_150x150.png'
CROP_BOX = (102, 101, 921, 921)
SIZE = (150, 150)


def main():
    logo = Image.open(SOURCE).convert('RGBA').crop(CROP_BOX)
    width, height = logo.size
    cx, cy = (width - 1) / 2, (height - 1) / 2
    radius = min(width, height) / 2
    source_pixels = logo.copy().load()
    pixels = logo.load()
    # Extend dark border colors outward to prevent a white fringe when the
    # circular mask and image are resampled together.
    for y in range(height):
        for x in range(width):
            dx, dy = x-cx, y-cy
            distance = hypot(dx, dy)
            if distance > radius-2:
                ratio = (radius-3)/distance
                pixels[x, y] = source_pixels[round(cx+dx*ratio), round(cy+dy*ratio)]
    supersample = 4
    mask = Image.new('L', (width*supersample, height*supersample))
    mx, my = (mask.width-1)/2, (mask.height-1)/2
    mr = (min(mask.size)-1)/2
    ImageDraw.Draw(mask).ellipse((mx-mr, my-mr, mx+mr, my+mr), fill=255)
    mask = mask.resize(logo.size, Image.Resampling.LANCZOS)
    logo.putalpha(mask)
    watermark = logo.resize(SIZE, Image.Resampling.LANCZOS)
    watermark.putdata([(r,g,b,a) if a else (0,0,0,0)
                       for r,g,b,a in watermark.get_flattened_data()])
    watermark.save(DEST, optimize=True)
    with Image.open(DEST) as check:
        assert check.format == 'PNG' and check.mode == 'RGBA' and check.size == SIZE
        assert all(check.getpixel(p)[3] == 0 for p in [(0,0),(149,0),(0,149),(149,149)])
        assert check.getpixel((75,75))[3] == 255
    preview = Image.new('RGB', (300,150))
    for i, color in enumerate(['white', '#17202b']):
        panel = Image.new('RGBA', SIZE, color)
        panel.alpha_composite(watermark)
        preview.paste(panel.convert('RGB'), (i*150,0))
    (ROOT / 'out').mkdir(exist_ok=True)
    preview.save(ROOT / 'out/watermark-edge-review.png')
    print(f'Saved {DEST}: 150x150 RGBA PNG; all corners fully transparent; {DEST.stat().st_size:,} bytes')


if __name__ == '__main__':
    main()
