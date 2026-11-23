"""Fit the unchanged original banner illustration into YouTube's safe zone."""
from pathlib import Path
from math import hypot
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(ROOT / 'public/youtube_banner.jpeg').convert('RGB')
art = source.resize((1200, round(source.height * 1200 / source.width)), Image.Resampling.LANCZOS)
w, h = art.size
W, H = 2560, 1440
left, top = (W-w)//2, (H-h)//2
# Mirror adjoining tiles at every edge: reflected pixels meet continuously.
reflection = Image.new('RGB', (W, H))
for row in range(-2, 3):
    for col in range(-2, 3):
        tile = art
        if col % 2:
            tile = ImageOps.mirror(tile)
        if row % 2:
            tile = ImageOps.flip(tile)
        reflection.paste(tile, (left+col*w, top+row*h))
# Blur progressively only outside the intact central image. Strong distant
# blur turns reflected geometry into warm parchment without replacing art.
soft = reflection.filter(ImageFilter.GaussianBlur(70))
blend = Image.new('L', (W,H))
data = bytearray(W*H)
for y in range(H):
    dy = max(top-y, y-(top+h-1), 0)
    for x in range(W):
        dx = max(left-x, x-(left+w-1), 0)
        t = min(1.0, hypot(dx,dy)/170)
        data[y*W+x] = round(255*t*t*(3-2*t))
blend.frombytes(bytes(data))
result = Image.composite(soft, reflection, blend)
result.paste(art, (left, top))
out = ROOT / 'out'
out.mkdir(exist_ok=True)
final = out / 'youtube-banner-final.png'
result.save(final, optimize=True, compress_level=9)
if final.stat().st_size >= 6_000_000:
    # Palette reduction is only a size fallback; maintain full RGB otherwise.
    result.quantize(colors=256, method=Image.Quantize.MEDIANCUT).save(final, optimize=True)
preview = result.copy()
ImageDraw.Draw(preview).rectangle((662,551,1896,888), outline='#00E5FF', width=3)
preview.save(out / 'youtube-banner-preview.png', optimize=True)
result.crop((662,551,1897,889)).save(out / 'youtube-banner-mobile-check.png')
check = Image.open(final)
assert check.size == (2560,1440) and check.format == 'PNG'
assert final.stat().st_size < 6_000_000
assert result.crop((left,top,left+w,top+h)).tobytes() == art.tobytes()
print(f'Artwork: {w}x{h} at ({left},{top}); central image pixels preserved after resizing.')
print(f'Final: {final}; {final.stat().st_size:,} bytes; {check.size}; {check.mode}')
