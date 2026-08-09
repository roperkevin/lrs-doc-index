"""Build OOXML fixtures for the v1.5-vs-v1.6 equivalence diff.

Produces real Office files via python-pptx / python-docx (independent zip
writer, genuine OOXML), records the planted ground-truth tokens for the
recall check, and emits .b64 companions for the Node runners.
"""
import base64
import io
import json
import os
import random
import struct
import zlib

from docx import Document
from pptx import Presentation
from pptx.util import Inches

random.seed(99)

VOCAB = ['route', 'measure', 'referent', 'calibration point', 'centerline', 'event',
         'LRS Network', 'segment', 'Merge Centerlines', 'Retire Routes', 'geoprocessing',
         'Straight Line Diagram', 'vertex spacing', 'positive case', 'negative case',
         'expected result', 'applyEdits', 'dominance', 'concurrency', 'Stay Put', 'Move',
         'Retire', 'Snap', 'Cover', 'iteration', 'estimate', 'assignment']


def sent(n):
    return ' '.join(random.choice(VOCAB) for _ in range(n))


def make_png(w=40, h=40):
    def chunk(tag, data):
        c = tag + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    raw = b''.join(b'\x00' + bytes(random.randrange(256) for _ in range(w * 3)) for _ in range(h))
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw))
            + chunk(b'IEND', b''))


tokens = {}

# fixture 1: realistic test-plan deck (tables, notes, images, issue urls)
prs = Presentation()
planted = []
for i in range(18):
    s = prs.slides.add_slide(prs.slide_layouts[5])
    title = f"Slide{i} " + sent(4)
    s.shapes.title.text = title
    planted += title.split()
    tb = s.shapes.add_textbox(Inches(0.5), Inches(1.5), Inches(8), Inches(2)).text_frame
    for _ in range(4):
        p = tb.add_paragraph()
        p.text = sent(12)
        planted += p.text.split()
    tbl = s.shapes.add_table(4, 3, Inches(0.5), Inches(4), Inches(8), Inches(2)).table
    for r in range(4):
        for c in range(3):
            v = f"cell{i}r{r}c{c} " + random.choice(VOCAB)
            tbl.cell(r, c).text = v
            planted += v.split()
    notes = s.notes_slide.notes_text_frame
    notes.text = (f"notes{i} PE: Claire Wang Dev: Ito — "
                  f"devtopia.esri.com/ArcGISPro/ps-location-referencing/issues/{4000 + i}")
    planted += notes.text.split()
    if i % 3 == 0:
        s.shapes.add_picture(io.BytesIO(make_png()), Inches(8.6), Inches(0.2), Inches(0.6), Inches(0.6))
prs.save('real_deck.pptx')
tokens['real_deck.pptx'] = planted

# fixture 2: docx with headings, nested + merged tables, unicode, issue refs, image
doc = Document()
planted = []
h = doc.add_heading('Merge Centerlines Test Plan V4 — café naïve 中文 🚀', 0)
planted += h.text.split()
for i in range(60):
    p = doc.add_paragraph(sent(14))
    planted += p.text.split()
t = doc.add_table(rows=5, cols=4)
t.style = 'Table Grid'
for r in range(5):
    for c in range(4):
        v = f"d{r}{c} " + random.choice(VOCAB)
        t.cell(r, c).text = v
        planted += v.split()
t.cell(0, 0).merge(t.cell(0, 1))            # merged cells -> gridSpan
inner = t.cell(2, 2).add_table(rows=2, cols=2)  # nested table
for r in range(2):
    for c in range(2):
        v = f"nest{r}{c}"
        inner.cell(r, c).text = v
        planted += [v]
p = doc.add_paragraph("see #4855 and "
                      "devtopia.esri.com/Beijing-R-D-Center/ExperienceBuilder-Web-Extensions/issues/26161")
planted += p.text.split()
doc.add_picture(io.BytesIO(make_png(60, 60)))
doc.save('real_doc.docx')
tokens['real_doc.docx'] = planted

# fixture 3: edge cases — blank slide, notes-only slide
prs2 = Presentation()
prs2.slides.add_slide(prs2.slide_layouts[6])
s2 = prs2.slides.add_slide(prs2.slide_layouts[6])
s2.notes_slide.notes_text_frame.text = "only notes here referent"
prs2.save('edge_deck.pptx')
tokens['edge_deck.pptx'] = ['only', 'notes', 'here', 'referent']

for f in tokens:
    with open(f, 'rb') as fh:
        open(f + '.b64', 'w').write(base64.b64encode(fh.read()).decode())
json.dump(tokens, open('planted_tokens.json', 'w'))
print({f: os.path.getsize(f) for f in tokens})
