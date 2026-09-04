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

# ---- v1.9 batch fixtures (check_batch.py) --------------------------------
# New-behavior fixtures for the SC-2..SC-14/FL-5 script batch. Not part
# of the recall set or the v1.8 check_format list — check_batch.py owns
# their assertions until the batch is promoted.
import re as _re


def _rezip(path, transform):
    """Round-trip a zip, letting transform(name, bytes) edit members."""
    with zipfile.ZipFile(path) as zin:
        items = [(i.filename, zin.read(i.filename)) for i in zin.infolist()]
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as zout:
        for name, data in items:
            zout.writestr(name, transform(name, data))


def _b64(path):
    with open(path, 'rb') as fh:
        open(path + '.b64', 'w', encoding='utf-8').write(base64.b64encode(fh.read()).decode())


# SC-2: reordered_deck — sldIdLst reversed vs part numbering
prs_r = Presentation()
for i in range(4):
    s = prs_r.slides.add_slide(prs_r.slide_layouts[5])
    s.shapes.title.text = f"OrderTitle{i}"
    s.shapes.add_textbox(Inches(0.5), Inches(2), Inches(6), Inches(1)).text_frame.text = f"orderbody{i}"
prs_r.save('reordered_deck.pptx')


def _reverse_sldidlst(name, data):
    if name != 'ppt/presentation.xml':
        return data
    xml = data.decode('utf-8')
    m = _re.search(r'(<p:sldIdLst>)(.*?)(</p:sldIdLst>)', xml, _re.S)
    ids = _re.findall(r'<p:sldId [^>]*/>', m.group(2))
    return (xml[:m.start()] + m.group(1) + ''.join(reversed(ids)) + m.group(3)
            + xml[m.end():]).encode('utf-8')


_rezip('reordered_deck.pptx', _reverse_sldidlst)
_b64('reordered_deck.pptx')

# SC-3: merged_deck — pptx table with a real hMerge continuation cell
prs_m = Presentation()
s_m = prs_m.slides.add_slide(prs_m.slide_layouts[6])
tbl_m = s_m.shapes.add_table(3, 3, Inches(0.5), Inches(1), Inches(8), Inches(2)).table
for r in range(3):
    for c in range(3):
        tbl_m.cell(r, c).text = f"m{r}{c}"
tbl_m.cell(0, 0).text = 'mergedhead'
# spec-shaped horizontal merge: origin carries gridSpan, covered cell
# stays in the markup flagged hMerge (what the SC-3 fix must skip)
tr0 = tbl_m._tbl.tr_lst[0]
tcs = tr0.findall(qn('a:tc'))
tcs[0].set('gridSpan', '2')
tcs[1].set('hMerge', '1')
prs_m.save('merged_deck.pptx')
_b64('merged_deck.pptx')

# SC-4: bigimg_deck — one referenced small png, one referenced over-cap png
prs_b = Presentation()
s_b = prs_b.slides.add_slide(prs_b.slide_layouts[6])
s_b.shapes.add_picture(io.BytesIO(make_png()), Inches(0.5), Inches(0.5), Inches(1), Inches(1))
s_b.shapes.add_picture(io.BytesIO(make_png(450, 300)), Inches(2), Inches(0.5), Inches(3), Inches(2))
prs_b.save('bigimg_deck.pptx')
_b64('bigimg_deck.pptx')

# SC-6: relswap_deck — slide rels rewritten with Target BEFORE Id
prs_s = Presentation()
s_s = prs_s.slides.add_slide(prs_s.slide_layouts[6])
s_s.shapes.add_picture(io.BytesIO(make_png()), Inches(0.5), Inches(0.5), Inches(1), Inches(1))
prs_s.save('relswap_deck.pptx')


def _swap_rel_attrs(name, data):
    if not name.startswith('ppt/slides/_rels/'):
        return data
    xml = data.decode('utf-8')

    def swap(m):
        tag = m.group(0)
        parts = [_re.search(r'Target="[^"]*"', tag),
                 _re.search(r'TargetMode="[^"]*"', tag),
                 _re.search(r'Type="[^"]*"', tag),
                 _re.search(r'Id="[^"]*"', tag)]
        return '<Relationship ' + ' '.join(p.group(0) for p in parts if p) + '/>'

    return _re.sub(r'<Relationship [^>]*/>', swap, xml).encode('utf-8')


_rezip('relswap_deck.pptx', _swap_rel_attrs)
_b64('relswap_deck.pptx')

# SC-5 / SC-7 / SC-10 / FL-5: edgecase2_deck — astral entity, pasted-
# markdown H1 line, long digit run, malformed dcterms:modified
prs_e = Presentation()
s_e = prs_e.slides.add_slide(prs_e.slide_layouts[6])
tf = s_e.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(8), Inches(3)).text_frame
tf.text = "ASTRALMARK smiley survives"
tf.add_paragraph().text = "# Roadmap pasted markdown"
tf.add_paragraph().text = "digits12345678901234 glue run"
prs_e.core_properties.modified = CORE_MODIFIED
prs_e.save('edgecase2_deck.pptx')


def _edge_edits(name, data):
    if name == 'ppt/slides/slide1.xml':
        return data.replace(b'ASTRALMARK', b'&#x1F600;')
    if name == 'docProps/core.xml':
        return _re.sub(rb'(<dcterms:modified[^>]*>)[^<]*(</dcterms:modified>)',
                       rb'\1yesterday-ish\2', data)
    return data


_rezip('edgecase2_deck.pptx', _edge_edits)
_b64('edgecase2_deck.pptx')

# SC-14: encrypted_deck — edge_deck with the GP encrypted bit set on
# every local (+6) and central (+8) header
enc = bytearray(open('edge_deck.pptx', 'rb').read())
for sig, off in ((b'PK\x03\x04', 6), (b'PK\x01\x02', 8)):
    i = 0
    while True:
        j = bytes(enc).find(sig, i)
        if j < 0:
            break
        enc[j + off] |= 1
        i = j + 4
open('encrypted_deck.pptx', 'wb').write(bytes(enc))
_b64('encrypted_deck.pptx')

# SC-8: truncstored.docx — hand-built zip whose document.xml deflate
# stream is a stored block claiming 100 bytes with only 10 present
_name = b'word/document.xml'
_raw = b'\x01' + struct.pack('<HH', 100, 0xffff - 100) + b'0123456789'
_local = struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, 0, 8, 0, 0, 0,
                     len(_raw), 100, len(_name), 0) + _name + _raw
_cdo = len(_local)
_central = struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, 0, 8, 0, 0,
                       0, len(_raw), 100, len(_name), 0, 0, 0, 0, 0, 0) + _name
_eocd = struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, 1, 1, len(_central), _cdo, 0)
open('truncstored.docx', 'wb').write(_local + _central + _eocd)
_b64('truncstored.docx')

print('batch fixtures:', {f: os.path.getsize(f) for f in
                          ('reordered_deck.pptx', 'merged_deck.pptx', 'bigimg_deck.pptx',
                           'relswap_deck.pptx', 'edgecase2_deck.pptx', 'encrypted_deck.pptx',
                           'truncstored.docx')})

# SC-14 (MediaExtract leg): encrypted deck WITH an image — MediaExtract
# only extracts media entries, so the imageless encrypted_deck never
# reaches its throw path
enc2 = bytearray(open('relswap_deck.pptx', 'rb').read())
for sig, off in ((b'PK\x03\x04', 6), (b'PK\x01\x02', 8)):
    i = 0
    while True:
        j = bytes(enc2).find(sig, i)
        if j < 0:
            break
        enc2[j + off] |= 1
        i = j + 4
open('encrypted_img_deck.pptx', 'wb').write(bytes(enc2))
_b64('encrypted_img_deck.pptx')

# ---- r2 batch fixtures (check_batch_r2.py) -------------------------------
# New-behavior fixtures for the SB-1..SB-9 batch (REVIEW_v2_5_r2.md).
# check_batch_r2.py owns their assertions until the batch is promoted.

# SB-6: hashheading_deck — content lines opening with ##/###/#### plus
# the v1.9 H1 case, in both slide body and speaker notes
prs_h = Presentation()
s_h = prs_h.slides.add_slide(prs_h.slide_layouts[5])
s_h.shapes.title.text = "HashTitle"
tf_h = s_h.shapes.add_textbox(Inches(0.5), Inches(2), Inches(8), Inches(3)).text_frame
tf_h.text = "plain line before"
tf_h.add_paragraph().text = "## Fake section pasted"
tf_h.add_paragraph().text = "### Fake notes pasted"
tf_h.add_paragraph().text = "#### deep heading pasted"
tf_h.add_paragraph().text = "# Roadmap pasted markdown"
tf_h.add_paragraph().text = "plain line after"
s_h.notes_slide.notes_text_frame.text = "## Fake heading inside notes"
prs_h.save('hashheading_deck.pptx')
_b64('hashheading_deck.pptx')

# SB-5: storednlen.docx — stored block with LEN correct and in-bounds
# but NLEN wrong (truncstored.docx covers the truncation leg)
_name2 = b'word/document.xml'
_raw2 = b'\x01' + struct.pack('<HH', 10, 0x1234) + b'0123456789'
_local2 = struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, 0, 8, 0, 0, 0,
                      len(_raw2), 10, len(_name2), 0) + _name2 + _raw2
_cdo2 = len(_local2)
_central2 = struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, 0, 8, 0, 0,
                        0, len(_raw2), 10, len(_name2), 0, 0, 0, 0, 0, 0) + _name2
_eocd2 = struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, 1, 1, len(_central2), _cdo2, 0)
open('storednlen.docx', 'wb').write(_local2 + _central2 + _eocd2)
_b64('storednlen.docx')

# SB-8: lyingcd_deck — one referenced small png whose CENTRAL-directory
# uncompressed-size claim is patched 1000 bytes short of the truth
prs_l = Presentation()
s_l = prs_l.slides.add_slide(prs_l.slide_layouts[6])
s_l.shapes.add_picture(io.BytesIO(make_png()), Inches(0.5), Inches(0.5), Inches(1), Inches(1))
prs_l.save('lyingcd_deck.pptx')
_ly = bytearray(open('lyingcd_deck.pptx', 'rb').read())
_p = bytes(_ly).find(struct.pack('<I', 0x06054b50))
_cd = struct.unpack('<I', _ly[_p + 16:_p + 20])[0]
while _cd < _p:
    assert struct.unpack('<I', _ly[_cd:_cd + 4])[0] == 0x02014b50
    _nl, _xl, _cl = struct.unpack('<HHH', _ly[_cd + 28:_cd + 34])
    _nm = bytes(_ly[_cd + 46:_cd + 46 + _nl])
    if _nm.startswith(b'ppt/media/') and _nm.endswith(b'.png'):
        _usz = struct.unpack('<I', _ly[_cd + 24:_cd + 28])[0]
        _ly[_cd + 24:_cd + 28] = struct.pack('<I', _usz - 1000)
    _cd += 46 + _nl + _xl + _cl
open('lyingcd_deck.pptx', 'wb').write(bytes(_ly))
_b64('lyingcd_deck.pptx')

# SB-7: manytables.docx — hand-assembled document.xml with 205 tiny
# tables (past the 200-table rendering guard)
_tbls = ''.join('<w:tbl><w:tr><w:tc><w:p><w:r><w:t>tbl%dcell</w:t></w:r></w:p></w:tc></w:tr></w:tbl>' % i
                for i in range(205))
_doc = ('<?xml version="1.0"?><w:document><w:body>' + _tbls +
        '<w:p><w:r><w:t>after the tables</w:t></w:r></w:p></w:body></w:document>')
with zipfile.ZipFile('manytables.docx', 'w', zipfile.ZIP_DEFLATED) as _z:
    _z.writestr('word/document.xml', _doc)
    _z.writestr('word/_rels/document.xml.rels',
                '<?xml version="1.0"?><Relationships/>')
_b64('manytables.docx')

print('r2 fixtures:', {f: os.path.getsize(f) for f in
                       ('hashheading_deck.pptx', 'storednlen.docx',
                        'lyingcd_deck.pptx', 'manytables.docx')})

# ---- r6 batch fixtures (check_batch_r6.py) -------------------------------
# CF-1: code_deck — an Arcade script pasted across slide paragraphs
# (internal blank line, a '# ...' comment line that SB-6 will escape,
# indented lines), code-shaped level-1 bullets, and prose/table control
# content that must never be absorbed into a fence.

prs_c = Presentation()
s_c = prs_c.slides.add_slide(prs_c.slide_layouts[5])
s_c.shapes.title.text = "CodeTitle Arcade Sample"
tf_c = s_c.shapes.add_textbox(Inches(0.5), Inches(1.5), Inches(8), Inches(4)).text_frame
tf_c.text = "Input expression for the stationing calculation below:"
for txt in ["var station = $feature.MEASURE",
            "var IsNegative = 0 //tracks values",
            " ",  # space-only run -> a blank line inside the script
            "if (station < 0) {",
            "  station = station * -1",
            "}",
            "# stationing format note",
            "return Stationlb",
            "Test with UNAPR data and Pipeline Referencing centerlines today"]:
    tf_c.add_paragraph().text = txt
p_c = tf_c.add_paragraph()
p_c.text = "$feature.Depth + $feature.Width / 10"
p_c.level = 1
p_c = tf_c.add_paragraph()
p_c.text = "positive case expected result route measure"
p_c.level = 1
tbl_c = s_c.shapes.add_table(2, 2, Inches(0.5), Inches(6), Inches(6), Inches(1)).table
tbl_c.cell(0, 0).text = "a = b; c = d;"
tbl_c.cell(0, 1).text = "plain cell"
tbl_c.cell(1, 0).text = "var x = 1;"
tbl_c.cell(1, 1).text = "referent"
prs_c.save('code_deck.pptx')
_b64('code_deck.pptx')

# CF-1 control deck: prose that superficially flirts with code shapes —
# instruction lines ending in ';', a lowercase 'return to ...' sentence
# — must come through byte-identically to a fence-free extraction
prs_p = Presentation()
s_p = prs_p.slides.add_slide(prs_p.slide_layouts[5])
s_p.shapes.title.text = "ProseTitle"
tf_p = s_p.shapes.add_textbox(Inches(0.5), Inches(1.5), Inches(8), Inches(3)).text_frame
tf_p.text = "Select the route; click Save; verify the label renders;"
tf_p.add_paragraph().text = "return to the map view and verify the resulting label"
tf_p.add_paragraph().text = "Numerous scripts can be found at https://github.com/Esri/arcade-expressions today"
prs_p.save('prose_deck.pptx')
_b64('prose_deck.pptx')

print('r6 fixtures:', {f: os.path.getsize(f) for f in
                       ('code_deck.pptx', 'prose_deck.pptx')})

# ---- v2.2 fixtures (DL-1 diagram-label collapse) --------------------------
# diagram_deck: slide 1 draws a route diagram the corpus way — dashed
# connectors plus tiny floating text boxes for tick numbers and
# route/event ids — alongside real content (a prose paragraph, a table,
# a long floating callout that must stay inline). Slide 2 is the
# control: only 3 short floating boxes, below the cluster threshold, so
# they must stay inline and no [figure: ...] line may appear.
# Owned by check_format.py §12; not in the recall set (tick numbers
# deliberately compress to "10–15").
from pptx.enum.shapes import MSO_CONNECTOR

prs_d = Presentation()
s_d = prs_d.slides.add_slide(prs_d.slide_layouts[5])
s_d.shapes.title.text = "DiagramTitle Route Split"
tf_d = s_d.shapes.add_textbox(Inches(0.5), Inches(1.2), Inches(8), Inches(1)).text_frame
tf_d.text = "Verify the split renders across the diagram below today"
for k, lbl in enumerate(['10', '11', '12', '13', '14', '15',
                         'R1', 'E1', 'E1', 'Output']):
    s_d.shapes.add_textbox(Inches(0.4 + 0.55 * k), Inches(2.6),
                           Inches(0.5), Inches(0.3)).text_frame.text = lbl
s_d.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(0.4), Inches(3.2),
                         Inches(6.0), Inches(3.2))
s_d.shapes.add_textbox(Inches(0.5), Inches(3.6), Inches(6), Inches(0.5)) \
    .text_frame.text = "Modify this test case to use measure five instead"
tbl_d = s_d.shapes.add_table(2, 2, Inches(0.5), Inches(4.5), Inches(6), Inches(1)).table
tbl_d.cell(0, 0).text = 'Route ID'
tbl_d.cell(0, 1).text = 'R1'
tbl_d.cell(1, 0).text = 'Measure'
tbl_d.cell(1, 1).text = '10'
s_d2 = prs_d.slides.add_slide(prs_d.slide_layouts[5])
s_d2.shapes.title.text = "ControlTitle"
for k, lbl in enumerate(['A1', 'B2', 'C3']):
    s_d2.shapes.add_textbox(Inches(0.5 + k), Inches(2), Inches(0.6), Inches(0.3)) \
        .text_frame.text = lbl
prs_d.save('diagram_deck.pptx')
_b64('diagram_deck.pptx')

print('v2.2 fixtures:', {f: os.path.getsize(f) for f in ('diagram_deck.pptx',)})


# ---- v1.0 SlideFigures fixtures (check_figures.py) ------------------------
# figure_deck: slide 1 is a VECTOR ruler (route line + evenly spaced tick
# stubs + measure labels + two coloured extents meeting at a split), slide 2
# is a RASTER-style case with no drawing at all but a key/value table stating
# topology, measures and split (the redraw path), and slide 3 is a header-row
# table deck (the other table shape in the corpus). Slide 4 has neither and
# must produce no figure.
from pptx.util import Emu, Pt
from pptx.enum.shapes import MSO_CONNECTOR as _CONN
from pptx.dml.color import RGBColor as _RGB

prs_f = Presentation()
IN = 914400

def _line(sl, x1, y1, x2, y2, rgb=None, w=None):
    """x1,y1 -> x2,y2 as ABSOLUTE points (add_connector's signature is
    begin/end, not offset/extent -- passing a width here draws a diagonal)."""
    c = sl.shapes.add_connector(_CONN.STRAIGHT, Emu(int(x1)), Emu(int(y1)),
                                Emu(int(x2)), Emu(int(y2)))
    if rgb:
        c.line.color.rgb = _RGB.from_string(rgb)
    if w:
        c.line.width = Emu(int(w))
    return c

def _label(sl, x, y, text, size=11):
    tb = sl.shapes.add_textbox(Emu(int(x)), Emu(int(y)), Emu(int(0.4 * IN)), Emu(int(0.22 * IN)))
    tb.text_frame.text = text
    tb.text_frame.paragraphs[0].runs[0].font.size = Pt(size)
    return tb

# --- slide 1: vector ruler, measures 10..16, split at 13
s_f = prs_f.slides.add_slide(prs_f.slide_layouts[6])
_line(s_f, 1.0 * IN, 2.0 * IN, 4.0 * IN, 2.0 * IN)          # the route
for k in range(7):                                                # tick stubs
    _line(s_f, (1.0 + k * 0.5) * IN, 1.94 * IN, (1.0 + k * 0.5) * IN, 2.06 * IN)
    _label(s_f, (0.9 + k * 0.5) * IN, 1.55 * IN, str(10 + k))
_line(s_f, 1.0 * IN, 2.0 * IN, 2.5 * IN, 2.0 * IN, rgb='002060', w=int(0.05 * IN))
_line(s_f, 2.52 * IN, 2.0 * IN, 4.0 * IN, 2.0 * IN, rgb='FFC000', w=int(0.05 * IN))
_label(s_f, 0.3 * IN, 1.95 * IN, 'R9', 12)
_label(s_f, 1.6 * IN, 2.4 * IN, 'E9', 12)

# --- slide 2: no drawing; a key/value table drives the redraw. A second,
# header-row RESULT table (the "after the split" table these decks carry)
# is what the redraw's OUTPUT figure must anchor to (DF-4); the input
# figure anchors to the key/value table its measures were read from.
s_f2 = prs_f.slides.add_slide(prs_f.slide_layouts[5])
s_f2.shapes.title.text = '2. Loop - Split measure : 20'
t_f = s_f2.shapes.add_table(5, 2, Emu(IN), Emu(2 * IN), Emu(3 * IN), Emu(2 * IN)).table
for r, (k, v) in enumerate([('Event ID', 'E7'), ('Route ID', 'R7'),
                            ('Measure', '0'), ('To Measure', '40'),
                            ('From Date', '1/1/2000')]):
    t_f.cell(r, 0).text = k
    t_f.cell(r, 1).text = v
t_f2o = s_f2.shapes.add_table(3, 4, Emu(int(4.5 * IN)), Emu(2 * IN),
                              Emu(int(4 * IN)), Emu(int(1.5 * IN))).table
for r, row in enumerate([('Event ID', 'E7', 'E7', 'E7'),
                         ('Measure', '0', '0', '20'),
                         ('To Measure', '40', '20', '40')]):
    for c, v in enumerate(row):
        t_f2o.cell(r, c).text = v

# --- slide 3: header-row table (the Merge-deck shape)
s_f3 = prs_f.slides.add_slide(prs_f.slide_layouts[5])
s_f3.shapes.title.text = 'Normal route - Split measure : 7'
t_f3 = s_f3.shapes.add_table(2, 4, Emu(IN), Emu(2 * IN), Emu(5 * IN), Emu(IN)).table
for c, h in enumerate(['Route ID', 'Event ID', 'From Measure', 'To Measure']):
    t_f3.cell(0, c).text = h
for c, v in enumerate(['R3', 'E3', '2', '12']):
    t_f3.cell(1, c).text = v

# --- slide 4: prose only -> no figure
s_f4 = prs_f.slides.add_slide(prs_f.slide_layouts[5])
s_f4.shapes.title.text = 'Conflict prevention notes'
s_f4.shapes.add_textbox(Emu(IN), Emu(2 * IN), Emu(5 * IN), Emu(IN)).text_frame.text = (
    'Verify the lock is acquired before editing the route')

# --- slide 5 (v1.1 / DF-2): TWO separate rulers -> TWO figures. The vertical
# clear air between them (~2.8in) is far past the cluster gap, so each ruler
# clusters — and renders — on its own, named slide5_fig1/slide5_fig2.
s_f5 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
for base_y, m0 in ((1.2, 0), (4.5, 5)):
    _line(s_f5, 1.0 * IN, base_y * IN, 3.0 * IN, base_y * IN)
    for k in range(5):
        _line(s_f5, (1.0 + k * 0.5) * IN, (base_y - 0.06) * IN,
              (1.0 + k * 0.5) * IN, (base_y + 0.06) * IN)
        _label(s_f5, (0.9 + k * 0.5) * IN, (base_y - 0.45) * IN, str(m0 + k))
    _line(s_f5, 1.0 * IN, base_y * IN, 2.0 * IN, base_y * IN,
          rgb='002060', w=int(0.05 * IN))
    _line(s_f5, 2.02 * IN, base_y * IN, 3.0 * IN, base_y * IN,
          rgb='FFC000', w=int(0.05 * IN))
    # a table under each ruler (DF-4): the geometric anchor pass must pair
    # each figure with ITS table — the nearest one below its own cluster —
    # never both figures with the first table
    t_f5 = s_f5.shapes.add_table(1, 2, Emu(int(1.0 * IN)), Emu(int((base_y + 0.35) * IN)),
                                 Emu(int(2 * IN)), Emu(int(0.4 * IN))).table
    t_f5.cell(0, 0).text = 'Route ID'
    t_f5.cell(0, 1).text = 'R5A' if m0 == 0 else 'R5B'

# --- slide 6 (v1.1 / DF-2): node graph — two visible shapes joined by a
# connector, no ruler at all. The graph lane must render standardized nodes
# (box + ellipse families, palette-tinted fills from the source colours) and
# a slate edge; the prose-slide silence rule must survive it (slide 4 still
# yields nothing, because its textboxes have no fill or outline).
from pptx.enum.shapes import MSO_SHAPE as _SHP
s_f6 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
n1 = s_f6.shapes.add_shape(_SHP.ROUNDED_RECTANGLE, Emu(int(0.8 * IN)), Emu(int(1.5 * IN)),
                           Emu(int(1.6 * IN)), Emu(int(0.8 * IN)))
n1.text_frame.text = 'Create route'
n1.fill.solid()
n1.fill.fore_color.rgb = _RGB.from_string('1F4E79')   # blue -> cool
n2 = s_f6.shapes.add_shape(_SHP.OVAL, Emu(int(3.4 * IN)), Emu(int(1.5 * IN)),
                           Emu(int(1.5 * IN)), Emu(int(0.8 * IN)))
n2.text_frame.text = 'Calibrate'
n2.fill.solid()
n2.fill.fore_color.rgb = _RGB.from_string('FFC000')   # amber -> warm
_line(s_f6, 2.4 * IN, 1.9 * IN, 3.4 * IN, 1.9 * IN)

# --- slide 7 (v1.2 / DF-3): routing + grid snap + rotation. Three boxes with
# hand-jittered rows and near-equal sizes (must snap to one row baseline and
# one width), straight connectors whose dragged endpoints must re-anchor to
# the node boundaries, an ELBOW connector that must route orthogonally, and
# a quarter-turned box that must normalise to an axis-aligned w/h swap.
s_f7 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
_b_geom = [(0.5, 1.50, 1.5, 0.70, '1F4E79', 'Extract'),
           (2.7, 1.56, 1.6, 0.75, '2E7D32', 'Transform'),
           (4.9, 1.47, 1.55, 0.72, '7030A0', 'Load')]
for bx, by, bw, bh, rgb, label in _b_geom:
    nb = s_f7.shapes.add_shape(_SHP.ROUNDED_RECTANGLE, Emu(int(bx * IN)), Emu(int(by * IN)),
                               Emu(int(bw * IN)), Emu(int(bh * IN)))
    nb.text_frame.text = label
    nb.fill.solid()
    nb.fill.fore_color.rgb = _RGB.from_string(rgb)
_line(s_f7, 2.05 * IN, 1.86 * IN, 2.66 * IN, 1.90 * IN)   # dragged near the edges
_line(s_f7, 4.35 * IN, 1.90 * IN, 4.95 * IN, 1.90 * IN)
nrot = s_f7.shapes.add_shape(_SHP.ROUNDED_RECTANGLE, Emu(int(5.0 * IN)), Emu(int(3.0 * IN)),
                             Emu(int(1.2 * IN)), Emu(int(0.5 * IN)))
nrot.text_frame.text = 'Publish'
nrot.fill.solid()
nrot.fill.fore_color.rgb = _RGB.from_string('C00000')
nrot.rotation = 90.0
elbow = s_f7.shapes.add_connector(_CONN.ELBOW, Emu(int(5.67 * IN)), Emu(int(2.25 * IN)),
                                  Emu(int(5.6 * IN)), Emu(int(2.6 * IN)))

# --- slide 8 (v1.2 / DF-3): raster tracing tier. The slide's only content is
# a pasted PNG of a route diagram — navy route, black tick stubs, an amber
# extent drawn OVER the right half of the route — with no drawing and no
# tables, so vector and redraw both pass and the tracer must decode the PNG,
# vectorise the strokes, and re-render them through the ruler pipeline.
import struct as _struct
import zlib as _zlib

def _png_write(path, w, h, rects):
    """Minimal truecolour PNG: white ground plus filled rects (x0,x1,y0,y1,rgb)."""
    img = [[(255, 255, 255)] * w for _ in range(h)]
    for x0, x1, y0, y1, rgb in rects:
        for y in range(y0, y1):
            row = img[y]
            for x in range(x0, x1):
                row[x] = rgb
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        for r, g, b in img[y]:
            raw += bytes((r, g, b))
    def chunk(t, d):
        return _struct.pack('>I', len(d)) + t + d + \
            _struct.pack('>I', _zlib.crc32(t + d) & 0xffffffff)
    ihdr = _struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    with open(path, 'wb') as fh:
        fh.write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr)
                 + chunk(b'IDAT', _zlib.compress(bytes(raw))) + chunk(b'IEND', b''))

NAVY, AMBER, BLACK = (0, 32, 96), (255, 192, 0), (0, 0, 0)
_trace_rects = [(60, 738, 148, 153, NAVY)]                 # the route
for tx in (60, 152, 244, 336, 428):                        # tick stubs (left half)
    _trace_rects.append((tx, tx + 3, 138, 163, BLACK))
_trace_rects.append((430, 738, 142, 159, AMBER))           # extent over the right half
_png_write('trace_route.png', 800, 300, _trace_rects)

s_f8 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f8.shapes.add_picture('trace_route.png', Emu(int(0.7 * IN)), Emu(int(1.5 * IN)),
                        Emu(int(6.4 * IN)), Emu(int(2.4 * IN)))

# --- slide 9 (v1.4 / DF-5): the degenerate split — a real deck shape where
# the stated split measure EQUALS the route's To Measure, so one side of the
# split is zero-length. The output figure must drop that extent (no orphaned
# event label at the route end, no "E8 20–20" legend entry, no swatches at
# all with a single colour left), and the branch topology pins the route to
# 0.28 of the height — the row label must sit on the line, not mid-height.
s_f9 = prs_f.slides.add_slide(prs_f.slide_layouts[5])
s_f9.shapes.title.text = '4. Branch - Split measure : 20'
t_f9 = s_f9.shapes.add_table(4, 2, Emu(IN), Emu(2 * IN), Emu(3 * IN), Emu(2 * IN)).table
for r, (k, v) in enumerate([('Event ID', 'E8'), ('Route ID', 'R8L1'),
                            ('Measure', '0'), ('To Measure', '20')]):
    t_f9.cell(r, 0).text = k
    t_f9.cell(r, 1).text = v

# --- slide 10 (v1.4 / DF-5): a ruler with the deck's outlined case-text box
# above it. The box is a real shape with a themed outline, so pre-DF-5 it
# rendered as a giant node that duplicated the case heading into the figure;
# it must be dropped while the ruler beneath still renders (with its arrow).
s_f10 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
tb10 = s_f10.shapes.add_shape(_SHP.ROUNDED_RECTANGLE, Emu(int(0.6 * IN)), Emu(int(0.4 * IN)),
                              Emu(int(6.5 * IN)), Emu(int(0.8 * IN)))
tb10.text_frame.text = ('9. Merge Option disabled, coincident events that have '
                        'exact attributes from measures 0-4')
_line(s_f10, 1.0 * IN, 2.0 * IN, 4.0 * IN, 2.0 * IN)
for k in range(5):
    _line(s_f10, (1.0 + k * 0.75) * IN, 1.94 * IN, (1.0 + k * 0.75) * IN, 2.06 * IN)
    _label(s_f10, (0.9 + k * 0.75) * IN, 1.55 * IN, str(k))
_line(s_f10, 1.0 * IN, 2.0 * IN, 4.0 * IN, 2.0 * IN, rgb='002060', w=int(0.05 * IN))

# --- slide 11 (v1.6 / DF-7): a SPANNING event across a line network. The
# event runs From RID R1L6 measure 10 → To RouteID R3L6 measure 25 via
# R2L6, split at 52.5 in R2L6's own measure domain; the route-list table
# gives the chain order and the result table names the split's route. The
# old single-route redraw drew a 10→25 grid that exists on no route and
# clamped the split away as degenerate.
s_f11 = prs_f.slides.add_slide(prs_f.slide_layouts[5])
s_f11.shapes.title.text = '11. Normal route - Split measure : 52.5'
t_f11 = s_f11.shapes.add_table(6, 2, Emu(int(4 * IN)), Emu(int(1.8 * IN)),
                               Emu(int(2.6 * IN)), Emu(int(2 * IN))).table
for r, (k, v) in enumerate([('Event ID', 'E6'), ('From RID', 'R1L6'),
                            ('From Measure', '10'), ('To RouteID', 'R3L6'),
                            ('To Measure', '25'), ('From Date', '1/1/2000')]):
    t_f11.cell(r, 0).text = k
    t_f11.cell(r, 1).text = v
t_f11r = s_f11.shapes.add_table(4, 3, Emu(int(0.5 * IN)), Emu(int(2 * IN)),
                                Emu(int(2.4 * IN)), Emu(int(1.4 * IN))).table
for r, row in enumerate([('Route ID', 'From Date', 'To Date'),
                         ('R1L6', '1/1/2000', 'Null'),
                         ('R2L6', '1/1/2000', 'Null'),
                         ('R3L6', '1/1/2000', 'Null')]):
    for c, v in enumerate(row):
        t_f11r.cell(r, c).text = v
t_f11o = s_f11.shapes.add_table(5, 4, Emu(int(1 * IN)), Emu(int(4.6 * IN)),
                                Emu(int(4.5 * IN)), Emu(int(1.8 * IN))).table
for r, row in enumerate([('Event ID', 'E6', 'E6', 'E6'),
                         ('From RID', 'R1L6', 'R1L6', 'R2L6'),
                         ('From Measure', '10', '10', '52.5'),
                         ('To RouteID', 'R3L6', 'R2L6', 'R3L6'),
                         ('To Measure', '25', '52.5', '25')]):
    for c, v in enumerate(row):
        t_f11o.cell(r, c).text = v

# --- slide 12 (v1.7 / DF-8): a route with measure labels but NO ticks — the
# decks draw these (a line, an extent over part of it, the end measures
# floating above, not a tick stub anywhere). The labels state anchors, so
# v1.7 must synthesize a hash mark at each labelled position; the right
# label is dragged past the route's own end (the decks do that too) and
# must clamp back onto the line, re-centred over its tick.
s_f12 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
_line(s_f12, 1.0 * IN, 2.0 * IN, 4.0 * IN, 2.0 * IN)
_line(s_f12, 1.0 * IN, 2.0 * IN, 2.6 * IN, 2.0 * IN, rgb='002060', w=int(0.05 * IN))
_label(s_f12, 0.9 * IN, 1.72 * IN, '0')
_label(s_f12, 4.02 * IN, 1.72 * IN, '30')
_label(s_f12, 0.3 * IN, 1.95 * IN, 'R12', 12)

# --- slide 13 (v2.0 / DF-11): a UI SCREENSHOT — the corpus pastes pictures
# of the app's own panels (search forms, result lists, attribute tables).
# Two bordered panels: the left holds a heading, two labelled input fields
# and a filled blue button (white glyph text on the fill), the right holds a
# heading, a table (a box with three full-width row separators and one
# column rule) and three body text rows. "Text" is stamped as glyph-sized
# ink blocks — pixels, exactly what a real screenshot gives the tracer. The
# wireframe tier must redraw all of it as standardized panels/fields/
# buttons/separators with placeholder text bars; pre-DF-11 this slide
# stayed a caption (the trace tier refused it), and the ruler trace must
# still never see it — window chrome is not a route.
GRAY13, DARK13, BLUE13 = (127, 127, 127), (60, 60, 60), (46, 116, 181)
_ui_rects = []


def _ui_box(x0, x1, y0, y1, t=2, rgb=GRAY13):
    _ui_rects.extend([(x0, x1, y0, y0 + t, rgb), (x0, x1, y1 - t, y1, rgb),
                      (x0, x0 + t, y0, y1, rgb), (x1 - t, x1, y0, y1, rgb)])


def _ui_text(x, y, n, h=8, rgb=DARK13):
    for k in range(n):
        gx = x + k * 7
        _ui_rects.append((gx, gx + 5, y, y + h, rgb))


_ui_box(24, 276, 20, 400)                      # left panel
_ui_text(40, 36, 9, h=12)                      # its heading
_ui_text(40, 74, 6)                            # field label 1
_ui_box(40, 240, 90, 116)                      # input field 1
_ui_text(40, 132, 7)                           # field label 2
_ui_box(40, 240, 148, 174)                     # input field 2
_ui_rects.append((150, 240, 350, 380, BLUE13))  # the Search button
_ui_text(170, 361, 5, rgb=(255, 255, 255))     # white text on the fill
_ui_box(300, 536, 20, 400)                     # right panel
_ui_text(316, 36, 8, h=12)                     # its heading
_ui_box(316, 520, 60, 240)                     # the results table
for sy in (104, 148, 192):                     # row separators
    _ui_rects.append((318, 518, sy, sy + 2, GRAY13))
_ui_rects.append((400, 402, 62, 238, GRAY13))  # column rule
_ui_text(316, 260, 10)                         # body rows under the table
_ui_text(316, 280, 8)
_ui_text(316, 300, 12)
_png_write('ui_screenshot.png', 560, 420, _ui_rects)
s_f13 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f13.shapes.add_picture('ui_screenshot.png', Emu(int(0.8 * IN)), Emu(int(1.2 * IN)),
                         Emu(int(6.0 * IN)), Emu(int(4.5 * IN)))

# --- slide 14 (v2.0 / DF-11): the photo control — random noise has no flat
# light ground, no assembled rectangles and no glyph rows, so BOTH raster
# tiers must stay silent (no wireframe, no bogus trace).
s_f14 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f14.shapes.add_picture(io.BytesIO(make_png(160, 120)), Emu(int(1.0 * IN)),
                         Emu(int(1.5 * IN)), Emu(int(4.0 * IN)), Emu(int(3.0 * IN)))

# --- slide 15 (v2.1 / DF-12): the ARTIFACT screenshot — real screenshots
# carry anti-aliased edges that scan as several parallel 1px bars whose
# shades differ too much for the colour merge. Two planted artifacts:
# (a) a vertical seam of three 1px columns (greys 90/180/100 — the
# 90-vs-180 step defeats the ≤64 colour merge) running most of the panel's
# height, straight THROUGH an input field and three text rows — pre-DF-12
# this rendered as a full-height line cluster through the middle of the
# figure; (b) a doubled table row separator (dark line + lighter shadow
# line 2px apart, again >64 apart in shade) — pre-DF-12 a double line.
# DF-12 must collapse the parallels and drop the seam entirely (it crosses
# content), keeping exactly ONE row separator and ZERO vertical ones.
_ui2 = []


def _ui2_box(x0, x1, y0, y1, t=2, rgb=GRAY13):
    _ui2.extend([(x0, x1, y0, y0 + t, rgb), (x0, x1, y1 - t, y1, rgb),
                 (x0, x0 + t, y0, y1, rgb), (x1 - t, x1, y0, y1, rgb)])


_ui2_box(24, 536, 20, 400)                     # the panel
_ui_rects, _keep = _ui2, _ui_rects             # reuse _ui_text onto _ui2
_ui_text(40, 36, 9, h=12)                      # heading
_ui_text(40, 74, 6)                            # field label
_ui_rects = _keep
_ui2_box(40, 240, 90, 116)                     # the input field the seam crosses
_ui2_box(300, 520, 60, 240)                    # a table box
_ui2.append((302, 518, 120, 122, (60, 60, 60)))    # row separator...
_ui2.append((302, 518, 124, 126, (145, 145, 145)))  # ...and its AA shadow double
for _ry in (260, 280, 300):                    # wide-pitch rows the seam crosses
    for _k in range(13):                       # (the seam sits in a glyph gap,
        _gx = 40 + _k * 11                     # so each row chains across it)
        _ui2.append((_gx, _gx + 5, _ry, _ry + 8, DARK13))
for _sx, _sg in ((112, 90), (114, 180), (116, 100)):  # the AA seam
    _ui2.append((_sx, _sx + 1, 30, 390, (_sg, _sg, _sg)))
_png_write('ui_artifact.png', 560, 420, _ui2)
s_f15 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f15.shapes.add_picture('ui_artifact.png', Emu(int(0.8 * IN)), Emu(int(1.2 * IN)),
                         Emu(int(6.0 * IN)), Emu(int(4.5 * IN)))

# --- slides 16-18 (v2.2 / DF-13): the slide-13 interface screenshot pasted
# as JPEG, GIF and BMP — the corpus pastes those too, and PNG-only decode
# silently kept them at captions. Each must decode and wireframe with the
# PNG's structure (structure, not pixel parity — JPEG carries block noise).
# Slide 19 is a PROGRESSIVE jpeg (SOF2): refused by design, stays silent.
from PIL import Image as _PILImage  # python-pptx already depends on Pillow
_shot = _PILImage.open('ui_screenshot.png')
_shot.save('ui_screenshot.jpg', 'JPEG', quality=90, subsampling=2)
_shot.convert('P', palette=_PILImage.ADAPTIVE).save('ui_screenshot.gif', 'GIF')
_shot.save('ui_screenshot.bmp', 'BMP')
_shot.save('ui_prog.jpg', 'JPEG', quality=85, progressive=True)
for _fmt in ('jpg', 'gif', 'bmp'):
    _s = prs_f.slides.add_slide(prs_f.slide_layouts[6])
    _s.shapes.add_picture(f'ui_screenshot.{_fmt}', Emu(int(0.8 * IN)),
                          Emu(int(1.2 * IN)), Emu(int(6.0 * IN)), Emu(int(4.5 * IN)))
s_f19 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f19.shapes.add_picture('ui_prog.jpg', Emu(int(0.8 * IN)), Emu(int(1.2 * IN)),
                         Emu(int(6.0 * IN)), Emu(int(4.5 * IN)))

# --- slide 20 (v2.2 / DF-13): the PNG the old decoder REFUSED — a UI
# mockup exported as a 4-bit palette PNG with a TRANSPARENT ground (the
# corpus's reported "unconverted PNG" shape). pngDecode must take the
# sub-8-bit palette, composite the transparency onto the white ground,
# and wireframe it like any other screenshot.
_p4 = _PILImage.open('ui_screenshot.png').convert('P', palette=_PILImage.ADAPTIVE,
                                                  colors=16)
_bg4 = _p4.getpixel((0, 0))
_pal4 = _p4.getpalette()
_pal4[_bg4 * 3:_bg4 * 3 + 3] = [255, 0, 0]   # transparent entry: red, so a
_p4.putpalette(_pal4)                        # decoder that ignores tRNS gets a
                                             # red ground and fails the gate
_p4.save('ui_p4t.png', 'PNG', bits=4, transparency=_bg4)
s_f20 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f20.shapes.add_picture('ui_p4t.png', Emu(int(0.8 * IN)), Emu(int(1.2 * IN)),
                         Emu(int(6.0 * IN)), Emu(int(4.5 * IN)))

# --- slide 21 (v2.3 / DF-14): large type + controls. A dialog title set
# LARGE (18px-wide glyphs — over the old 14px run cap, so pre-DF-14 the
# heading vanished from the wireframe entirely), two dense 16x16 control
# glyphs (calendar-button shape — pre-DF-14 these rendered as stubs of
# greek), and a sparse 16x16 corner-arc blob that must mint NEITHER an
# icon nor a text bar (the density floor).
_ui3 = []
_ui3.extend([(24, 536, 20, 22, GRAY13), (24, 536, 398, 400, GRAY13),
             (24, 26, 20, 400, GRAY13), (534, 536, 20, 400, GRAY13)])  # panel
for _k in range(4):                                # the LARGE heading
    _gx = 40 + _k * 26
    _ui3.append((_gx, _gx + 18, 36, 50, DARK13))
_ui3.extend([(40 + _k * 7, 44 + _k * 7, 74, 82, DARK13) for _k in range(6)])
_ui3.extend([(40, 240, 90, 92, GRAY13), (40, 240, 114, 116, GRAY13),
             (40, 42, 90, 116, GRAY13), (238, 240, 90, 116, GRAY13)])  # field
for _iy in (90, 150):                              # two dense control glyphs
    _ui3.append((300, 316, _iy, _iy + 16, DARK13))
for _t in range(12):                               # a sparse arc-like blob
    _ui3.append((330 + _t, 330 + _t + 1, 205 - _t, 207 - _t, GRAY13))
for _ry in (260, 280):                             # body rows
    _ui3.extend([(40 + _k * 7, 44 + _k * 7, _ry, _ry + 8, DARK13)
                 for _k in range(10)])
_png_write('ui_controls.png', 560, 420, _ui3)
s_f21 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f21.shapes.add_picture('ui_controls.png', Emu(int(0.8 * IN)), Emu(int(1.2 * IN)),
                         Emu(int(6.0 * IN)), Emu(int(4.5 * IN)))

# --- slide 22 (v2.4 / DF-15): a drawn ruler AND a pasted screenshot on ONE
# slide — the corpus's "here is the case, and here is the app doing it"
# layout. The old waterfall emitted only the ruler and the screenshot
# silently kept its caption; now BOTH render, numbered as one sibling
# sequence (ruler fig1, wireframe fig2).
s_f22 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
_line(s_f22, 1.0 * IN, 2.0 * IN, 4.0 * IN, 2.0 * IN)
for k in range(7):
    _line(s_f22, (1.0 + k * 0.5) * IN, 1.94 * IN, (1.0 + k * 0.5) * IN, 2.06 * IN)
    _label(s_f22, (0.9 + k * 0.5) * IN, 1.55 * IN, str(10 + k))
_line(s_f22, 1.0 * IN, 2.0 * IN, 2.5 * IN, 2.0 * IN, rgb='002060', w=int(0.05 * IN))
_label(s_f22, 0.3 * IN, 1.95 * IN, 'R22', 12)
s_f22.shapes.add_picture('ui_screenshot.png', Emu(int(4.6 * IN)), Emu(int(1.0 * IN)),
                         Emu(int(4.2 * IN)), Emu(int(3.2 * IN)))

# --- slide 23 (v2.4 / DF-15): the same combination through the REDRAW lane
# — no drawing, a key/value case table plus a result table (the input/
# output figure pair), and a pasted screenshot beside them. The pair keeps
# its meaning anchors; the wireframe appends as fig3 and anchors only
# against tables the pair did not claim.
s_f23 = prs_f.slides.add_slide(prs_f.slide_layouts[5])
s_f23.shapes.title.text = '23. Loop - Split measure : 20'
t_f23 = s_f23.shapes.add_table(5, 2, Emu(IN), Emu(2 * IN), Emu(3 * IN), Emu(2 * IN)).table
for r, (k, v) in enumerate([('Event ID', 'E23'), ('Route ID', 'R23'),
                            ('Measure', '0'), ('To Measure', '40'),
                            ('From Date', '1/1/2000')]):
    t_f23.cell(r, 0).text = k
    t_f23.cell(r, 1).text = v
t_f23o = s_f23.shapes.add_table(3, 4, Emu(int(4.5 * IN)), Emu(2 * IN),
                                Emu(int(4 * IN)), Emu(int(1.5 * IN))).table
for r, row in enumerate([('Event ID', 'E23', 'E23', 'E23'),
                         ('Measure', '0', '0', '20'),
                         ('To Measure', '40', '20', '40')]):
    for c, v in enumerate(row):
        t_f23o.cell(r, c).text = v
s_f23.shapes.add_picture('ui_screenshot.png', Emu(int(1.0 * IN)), Emu(int(4.2 * IN)),
                         Emu(int(4.2 * IN)), Emu(int(3.2 * IN)))

# --- slide 24 (v2.4 / DF-15): ROUNDED-corner fields, the mockup-tool style
# the corpus screenshots actually use. A 5px radius trims each field's side
# verticals to ~62% of the border-to-border span — under the old 70%
# assembly floor, so every field shattered into stray full-width lines
# (the "form with no fields" symptom). Corners are simulated by trimming
# the border ends, which is exactly what the bar scanner sees of an arc.
_ui5 = []


def _ui5_rbox(x0, x1, y0, y1, r, t=2, rgb=GRAY13):
    _ui5.extend([(x0 + r, x1 - r, y0, y0 + t, rgb), (x0 + r, x1 - r, y1 - t, y1, rgb),
                 (x0, x0 + t, y0 + r, y1 - r, rgb), (x1 - t, x1, y0 + r, y1 - r, rgb)])


_ui5_rbox(24, 536, 20, 400, 8)                 # rounded panel
for _i, _fy in enumerate((90, 150, 210)):      # three rounded fields + labels
    _ui5.extend([(40 + _k * 7, 44 + _k * 7, _fy - 16, _fy - 8, DARK13)
                 for _k in range(6 + _i)])
    _ui5_rbox(40, 240, _fy, _fy + 26, 5)
_ui5.extend([(40 + _k * 7, 44 + _k * 7, 300, 308, DARK13) for _k in range(9)])
_png_write('ui_rounded.png', 560, 420, _ui5)
s_f24 = prs_f.slides.add_slide(prs_f.slide_layouts[6])
s_f24.shapes.add_picture('ui_rounded.png', Emu(int(0.8 * IN)), Emu(int(1.2 * IN)),
                         Emu(int(6.0 * IN)), Emu(int(4.5 * IN)))

prs_f.save('figure_deck.pptx')
_b64('figure_deck.pptx')
print('figure fixtures:', {f: os.path.getsize(f) for f in ('figure_deck.pptx',)})

# SB-5 (MediaExtract leg): storednlen_img.pptx — a single media entry
# whose deflate stream is a stored block with a wrong NLEN. MediaExtract
# only inflates media entries, so the docx variant never reaches its
# inflate; this one does. (Not a real png — the zip reader never checks.)
_name3 = b'ppt/media/image1.png'
_raw3 = b'\x01' + struct.pack('<HH', 10, 0x1234) + b'0123456789'
_local3 = struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, 0, 8, 0, 0, 0,
                      len(_raw3), 10, len(_name3), 0) + _name3 + _raw3
_cdo3 = len(_local3)
_central3 = struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, 0, 8, 0, 0,
                        0, len(_raw3), 10, len(_name3), 0, 0, 0, 0, 0, 0) + _name3
_eocd3 = struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, 1, 1, len(_central3), _cdo3, 0)
open('storednlen_img.pptx', 'wb').write(_local3 + _central3 + _eocd3)
_b64('storednlen_img.pptx')
