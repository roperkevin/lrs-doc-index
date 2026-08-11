"""Build OOXML fixtures for the harness.

Produces real Office files via python-pptx / python-docx (independent zip
writer, genuine OOXML), records the planted ground-truth tokens for the
recall check, and emits .b64 companions for the Node runners.

Since the v1.7 formatting work the fixtures also plant *structure* —
slide titles, outline-leveled paragraphs, docx headings and numPr list
items, and a sheets.json workbook stand-in — recorded in
planted_format.json for check_format.py. run_diff.py (the v1.5/v1.6
equivalence gate) is unaffected: both versions see the same fixtures.

Since the v1.8 core-properties work the two "real" fixtures also plant
authorship core properties (author with an ampersand, last-modified-by
with a smart apostrophe — both exercise entity decoding — and a fixed
modified timestamp), recorded under each fixture's 'core' key in
planted_format.json, plus a noprops_deck.pptx.b64 companion (edge_deck
with docProps/core.xml stripped) for the degrades-to-empty case.
"""
import base64
import datetime
import io
import json
import os
import random
import struct
import zipfile
import zlib

from docx import Document
from docx.oxml.ns import qn
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
fmt = {}

# fixture 1: realistic test-plan deck (tables, notes, images, issue urls)
prs = Presentation()
planted = []
deck_fmt = {'titles': [], 'notes_count': 0, 'lvl1': [], 'lvl2': []}
for i in range(18):
    s = prs.slides.add_slide(prs.slide_layouts[5])
    title = f"Slide{i} " + sent(4)
    s.shapes.title.text = title
    planted += title.split()
    deck_fmt['titles'].append(title)
    tb = s.shapes.add_textbox(Inches(0.5), Inches(1.5), Inches(8), Inches(2)).text_frame
    for _ in range(4):
        p = tb.add_paragraph()
        p.text = sent(12)
        planted += p.text.split()
    # planted outline structure: explicit levels -> nested markdown lists
    p = tb.add_paragraph()
    p.text = f"level one item {i} " + sent(3)
    p.level = 1
    planted += p.text.split()
    deck_fmt['lvl1'].append(p.text)
    p = tb.add_paragraph()
    p.text = f"level two item {i} " + sent(2)
    p.level = 2
    planted += p.text.split()
    deck_fmt['lvl2'].append(p.text)
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
    deck_fmt['notes_count'] += 1
    if i % 3 == 0:
        s.shapes.add_picture(io.BytesIO(make_png()), Inches(8.6), Inches(0.2), Inches(0.6), Inches(0.6))
CORE_MODIFIED = datetime.datetime(2026, 7, 31, 18, 22, 4)
prs.core_properties.author = 'Claire Wang & Team'
prs.core_properties.last_modified_by = 'Miguel O’Brien'
prs.core_properties.modified = CORE_MODIFIED
prs.save('real_deck.pptx')
tokens['real_deck.pptx'] = planted
deck_fmt['core'] = {'author': 'Claire Wang & Team',
                    'lastEditedBy': 'Miguel O’Brien',
                    'lastEdited': '2026-07-31T18:22:04Z'}
fmt['real_deck.pptx'] = deck_fmt

# fixture 2: docx with headings, nested + merged tables, unicode, issue refs, image
doc = Document()
planted = []
doc_fmt = {'title': None, 'headings': {'1': [], '2': [], '3': []},
           'lists': {'0': [], '1': [], '2': []}}
h = doc.add_heading('Merge Centerlines Test Plan V4 — café naïve 中文 🚀', 0)
planted += h.text.split()
doc_fmt['title'] = h.text


def add_list_item(text, ilvl):
    """Plant a direct-formatting numPr paragraph (how Word marks list
    items on the paragraph itself, unlike python-docx's style-only
    List Bullet)."""
    p = doc.add_paragraph(text)
    ppr = p._p.get_or_add_pPr()
    numpr = ppr.makeelement(qn('w:numPr'), {})
    ilvl_el = ppr.makeelement(qn('w:ilvl'), {qn('w:val'): str(ilvl)})
    numid = ppr.makeelement(qn('w:numId'), {qn('w:val'): '1'})
    numpr.append(ilvl_el)
    numpr.append(numid)
    ppr.append(numpr)
    return p


for i in range(60):
    p = doc.add_paragraph(sent(14))
    planted += p.text.split()
    if i % 20 == 0:
        for lvl in (1, 2, 3):
            hh = doc.add_heading(f"Heading {lvl} section {i} " + sent(2), lvl)
            planted += hh.text.split()
            doc_fmt['headings'][str(lvl)].append(hh.text)
        for ilvl in (0, 1, 2):
            li = add_list_item(f"list item ilvl{ilvl} block {i} " + sent(2), ilvl)
            planted += li.text.split()
            doc_fmt['lists'][str(ilvl)].append(li.text)
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
doc.core_properties.author = 'Claire Wang & Team'
doc.core_properties.last_modified_by = 'Miguel O’Brien'
doc.core_properties.modified = CORE_MODIFIED
doc.save('real_doc.docx')
tokens['real_doc.docx'] = planted
doc_fmt['core'] = {'author': 'Claire Wang & Team',
                   'lastEditedBy': 'Miguel O’Brien',
                   'lastEdited': '2026-07-31T18:22:04Z'}
fmt['real_doc.docx'] = doc_fmt

# fixture 3: edge cases — blank slide, notes-only slide
prs2 = Presentation()
prs2.slides.add_slide(prs2.slide_layouts[6])
s2 = prs2.slides.add_slide(prs2.slide_layouts[6])
s2.notes_slide.notes_text_frame.text = "only notes here referent"
prs2.save('edge_deck.pptx')
tokens['edge_deck.pptx'] = ['only', 'notes', 'here', 'referent']
fmt['edge_deck.pptx'] = {'titles': [], 'notes_count': 1, 'lvl1': [], 'lvl2': []}

# fixture 3b: edge_deck with docProps/core.xml stripped — the v1.8
# core-properties degrades-to-empty case (b64 companion only; not in
# the tokens/recall set)
with zipfile.ZipFile('edge_deck.pptx') as zin, \
        zipfile.ZipFile('noprops_deck.pptx', 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        if item.filename != 'docProps/core.xml':
            zout.writestr(item, zin.read(item.filename))
with open('noprops_deck.pptx', 'rb') as fh:
    open('noprops_deck.pptx.b64', 'w', encoding='utf-8').write(base64.b64encode(fh.read()).decode())

# fixture 4: workbook stand-in for the WorkbookDump mock runner
# (wrap_workbook.py) — a 30-column row exercising the COLCAP cut, a
# pipe-bearing cell exercising escaping, a >300-char cell exercising
# CELLCAP truncation, and an empty sheet.
wide_header = [f"col{c}" for c in range(30)]
wide_row = [f"w{c}" for c in range(30)]
sheets = {
    'Schedule': [wide_header, wide_row, ['w0', 'w1']],
    'Notes': [
        ['Task', 'Detail'],
        ['pipes | in | cells', 'x' * 320],
        ['plain', 'referent calibration'],
    ],
    'Blank': [],
}
json.dump(sheets, open('sheets.json', 'w', encoding='utf-8'))

for f in tokens:
    with open(f, 'rb') as fh:
        open(f + '.b64', 'w', encoding='utf-8').write(base64.b64encode(fh.read()).decode())
json.dump(tokens, open('planted_tokens.json', 'w', encoding='utf-8'))
json.dump(fmt, open('planted_format.json', 'w', encoding='utf-8'))
print({f: os.path.getsize(f) for f in tokens})
