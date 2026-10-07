"""Build static 600-weight, heading-only WOFF2 subsets from OFL sources."""
import json
import sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


def build(source, target, chars, axes):
    # Keep the source's head.modified so identical input gives byte-identical output.
    font = instantiateVariableFont(TTFont(source, recalcTimestamp=False), axes, inplace=True)
    options = subset.Options()
    options.layout_features = ['*']  # Retain halt punctuation alternates.
    worker = subset.Subsetter(options=options)
    worker.populate(text=chars)
    worker.subset(font)
    font.flavor = 'woff2'
    font.save(target)
    actual = set(font.getBestCmap())
    assert actual == set(map(ord, chars)), (target, actual ^ set(map(ord, chars)))
    return Path(target).stat().st_size


headings = json.loads(Path(sys.argv[1]).read_text())
latin = ''.join(chr(i) for i in range(32, 127)) + '©–—’'
build('tools/fonts/Newsreader.ttf', 'assets/fonts/newsreader-latin.woff2', latin, {'wght': 600, 'opsz': 48})
report = {}
for page, text in headings.items():
    chars = ''.join(sorted(set(c for c in text if '\u3000' <= c <= '\u303f' or '\u3400' <= c <= '\u9fff' or '\uff00' <= c <= '\uffef')))
    size = build('tools/fonts/NotoSerifSC.ttf', f'assets/fonts/{page}.woff2', chars, {'wght': 600})
    report[page] = {'characters': chars, 'bytes': size}
    ranges = ','.join(f'U+{ord(c):04X}' for c in chars)
    Path(f'assets/fonts/{page}.css').write_text('@font-face{font-family:"Drip Serif SC";src:url("/assets/fonts/' + page + '.woff2") format("woff2");font-weight:600;font-display:swap;unicode-range:' + ranges + '}\n')
Path('tools/font-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
