"""Export a geometrically centered logo with a 3% transparent radial margin."""
from pathlib import Path
from math import hypot
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/EchoesOfYesterdayLogo.png'
DEST = ROOT / 'public/EchoesOfYesterday_Profile_1080x1080.png'
SIZE = 1080
SUPERSAMPLE = 4


def main():
    original = Image.open(SOURCE).convert('RGBA')
    px = original.load()
    # All three channels must be below 245. Bounding extrema, rather than
    # pixel mass, make the center independent of the heavy interior artwork.
    min_x, min_y = original.width, original.height
    max_x = max_y = -1
    for y in range(original.height):
        for x in range(original.width):
            r, g, b, a = px[x, y]
            if a and max(r, g, b) < 245:
                min_x, min_y = min(min_x, x), min(min_y, y)
                max_x, max_y = max(max_x, x), max(max_y, y)
    if max_x < min_x or max_y < min_y:
        raise ValueError('No emblem detected against the white background')
    cx, cy = (min_x + max_x) / 2, (min_y + max_y) / 2
    radius = max(max_x - min_x, max_y - min_y) / 2
    if radius <= 3:
        raise ValueError('Emblem is too small to process')
    padded_radius = radius * 1.03

    # Extend brown edge colors into the discarded exterior before resizing.
    # This prevents white source pixels from contaminating the soft alpha edge.
    cleaned = original.copy()
    pixels = cleaned.load()
    for y in range(original.height):
        for x in range(original.width):
            dx, dy = x-cx, y-cy
            distance = hypot(dx, dy)
            if distance > radius-2:
                ratio = (radius-3)/distance
                sx = min(original.width-1, max(0, round(cx+dx*ratio)))
                sy = min(original.height-1, max(0, round(cy+dy*ratio)))
                pixels[x, y] = px[sx, sy]

    # Pillow resize accepts a fractional source box. Pixel centers are at
    # index + 0.5 in this coordinate system, avoiding integer-crop bias.
    box = (cx + 0.5 - padded_radius, cy + 0.5 - padded_radius,
           cx + 0.5 + padded_radius, cy + 0.5 + padded_radius)
    result = cleaned.resize((SIZE, SIZE), Image.Resampling.LANCZOS, box=box)
    high_size = SIZE * SUPERSAMPLE
    mask = Image.new('L', (high_size, high_size))
    center = (high_size - 1) / 2
    mask_radius = radius / (2 * padded_radius) * high_size
    # Symmetric integer bounds avoid rasterizer rounding introducing a shift.
    lo = round(center-mask_radius)
    hi = high_size-1-lo
    ImageDraw.Draw(mask).ellipse((lo, lo, hi, hi), fill=255)
    mask = mask.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    result.putalpha(mask)
    result.putdata([(r, g, b, a) if a else (0, 0, 0, 0)
                    for r, g, b, a in result.get_flattened_data()])
    result.save(DEST, optimize=True)

    check = Image.open(DEST)
    assert check.size == (SIZE, SIZE) and check.mode == 'RGBA'
    alpha = check.getchannel('A')
    bounds = alpha.getbbox()
    left, top, right, bottom = bounds
    assert abs(left - (SIZE-right)) <= 1
    assert abs(top - (SIZE-bottom)) <= 1
    assert all(alpha.getpixel(p) == 0 for p in [(0,0),(1079,0),(0,1079),(1079,1079)])
    assert alpha.getpixel((540,540)) == 255
    qa = Image.new('RGB', (1080, 540))
    preview = result.resize((540,540), Image.Resampling.LANCZOS)
    for i, color in enumerate(['#ffffff', '#17202b']):
        panel = Image.new('RGBA', (540,540), color)
        panel.alpha_composite(preview)
        qa.paste(panel.convert('RGB'), (i*540,0))
    (ROOT / 'out').mkdir(exist_ok=True)
    qa.save(ROOT / 'out/profile-picture-edge-review.png')
    print(f'Bounds: {(min_x, min_y, max_x, max_y)}')
    print(f'Center=({cx}, {cy}), R={radius}, padded R={padded_radius}')
    print(f'Alpha bounds: {bounds}; padding L/T/R/B: {left}/{top}/{SIZE-right}/{SIZE-bottom}')
    print(f'Ready: {DEST}')


if __name__ == '__main__':
    main()
