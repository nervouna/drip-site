"""Resize the unmodified store screenshots; the app repository is read-only."""
import sys
from pathlib import Path
from PIL import Image

app = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else Path.home() / 'Develop/Projects/drip'
for lang in ['en', 'zh-Hans']:
    target = Path('assets/screens') / lang
    target.mkdir(parents=True, exist_ok=True)
    for name in ['01-entry', '02-ledger', '03-stats', '04-templates', '05-accounts', '07-privacy', '08-widgets']:
        with Image.open(app / 'Store/raw' / lang / f'{name}.png') as source:
            for scale in [1, 2]:
                width = 300 * scale
                image = source.convert('RGB').resize((width, round(width * source.height / source.width)), Image.Resampling.LANCZOS)
                image.save(target / f'{name}@{scale}x.png', optimize=True)
                image.save(target / f'{name}@{scale}x.webp', quality=85, method=6)
