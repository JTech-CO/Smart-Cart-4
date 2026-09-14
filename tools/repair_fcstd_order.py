#!/usr/bin/env python3
"""Repair the forward-only FCStd payload order; never modify input geometry.

FreeCAD Base::XMLReader::readFiles scans registered payloads with a monotonically
increasing cursor. App-owned payloads must precede GuiDocument.xml; GUI-owned
payloads must follow it in registration order. ZIP CRC/XML reference presence
alone do not check this requirement.

Reference: FreeCAD/FreeCAD src/Base/Reader.cpp, readFiles and addFile.
"""
from __future__ import annotations
import argparse
import copy
import hashlib
import json
from pathlib import Path
import uuid
import zipfile
from xml.etree import ElementTree as ET


def xml_bytes(root: ET.Element) -> bytes:
    ET.indent(root, space='    ')
    return ET.tostring(root, encoding='utf-8', xml_declaration=True)


def references(root: ET.Element) -> list[str]:
    return [e.get('file') for e in root.iter() if e.get('file')]


def physical_names(archive: zipfile.ZipFile) -> list[str]:
    return [i.filename for i in sorted(archive.infolist(), key=lambda i: i.header_offset)]


def restore_trace(archive: zipfile.ZipFile) -> dict:
    """Replay XMLReader::readFiles' cursor, including its nested GUI reader.

    This is a source-aligned file-order test, NOT execution of FreeCAD itself.
    The optional thumbnail is registered before view-provider payloads.
    """
    names = physical_names(archive)
    doc = ET.fromstring(archive.read('Document.xml'))
    app = references(doc)
    has_gui = 'GuiDocument.xml' in names
    gui = references(ET.fromstring(archive.read('GuiDocument.xml'))) if has_gui else []
    g_registered = (['thumbnails/Thumbnail.png'] if 'thumbnails/Thumbnail.png' in names else []) + gui
    a_registered = app + (['GuiDocument.xml'] if has_gui else [])
    consumed = {'application': [], 'gui': []}
    cursor = 0
    layer = 'application'
    for name in names[names.index('Document.xml') + 1:]:
        reg = a_registered if layer == 'application' else g_registered
        try:
            index = reg.index(name, cursor)
        except ValueError:
            continue
        cursor = index + 1
        if layer == 'application' and name == 'GuiDocument.xml':
            layer, cursor = 'gui', 0
        else:
            consumed[layer].append(name)
    loaded = set(consumed['application'])
    d4 = [n for n in app if n.startswith('D4_') and n.endswith('.brp')]
    return {
        'application_registered': len(app),
        'application_restored': len(consumed['application']),
        'application_skipped': [n for n in app if n not in loaded],
        'd4_registered': len(d4),
        'd4_restored': sum(n in loaded for n in d4),
        'd4_skipped': [n for n in d4 if n not in loaded],
        'gui_registered': len(gui),
        'gui_restored': sum(n in set(consumed['gui']) for n in gui),
        'method': 'Source-aligned monotone cursor replay, not native FreeCAD execution',
    }


def set_text_property(root: ET.Element, name: str, value: str) -> None:
    el = root.find(f'./Properties/Property[@name="{name}"]/String')
    if el is not None:
        el.set('value', value)


def set_camera(gui: ET.Element) -> None:
    # Camera derived analytically from D4 bounds. Z up; +X front.
    # A right-handed view rotation, no stale prototype camera coordinates.
    import math
    def normalize(v):
        d = math.sqrt(sum(a*a for a in v))
        return [a/d for a in v]
    def cross(a,b):
        return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
    eye = [1640.0, -1890.0, 1520.0]
    target = [-45.2, 94.0, 519.5]
    back = normalize([a-b for a,b in zip(eye,target)])
    right = normalize(cross([0,0,1],back))
    up = cross(back,right)
    matrix = [[right[i],up[i],back[i]] for i in range(3)]
    angle = math.acos(max(-1,min(1,(sum(matrix[i][i] for i in range(3))-1)/2)))
    axis = normalize([matrix[2][1]-matrix[1][2], matrix[0][2]-matrix[2][0], matrix[1][0]-matrix[0][1]])
    distance = math.sqrt(sum((a-b)**2 for a,b in zip(eye,target)))
    cam = gui.find('Camera')
    if cam is None:
        cam = ET.SubElement(gui,'Camera')
    cam.set('settings', '\n'.join([
        'OrthographicCamera {', ' viewportMapping ADJUST_CAMERA',
        ' position ' + ' '.join(f'{v:.9f}' for v in eye),
        ' orientation ' + ' '.join(f'{v:.12f}' for v in axis) + f' {angle:.12f}',
        ' nearDistance 10', ' farDistance 10000', ' aspectRatio 1',
        f' focalDistance {distance:.9f}', ' height 1710', '}',
    ]))


def only_d4(doc: ET.Element, gui: ET.Element) -> tuple[ET.Element,ET.Element]:
    doc, gui = copy.deepcopy(doc), copy.deepcopy(gui)
    objtable, data = doc.find('Objects'), doc.find('ObjectData')
    included = {o.get('name') for o in objtable.findall('Object') if o.get('name','').startswith('D4')}
    for node in list(objtable):
        name = node.get('name') if node.tag == 'Object' else node.get('Name')
        if name not in included:
            objtable.remove(node)
    for node in list(data):
        if node.get('name') not in included:
            data.remove(node)
    objtable.set('Count',str(len(included))); data.set('Count',str(len(included)))
    # Produce the dependency table for all group links in this standalone variant.
    for node in list(objtable):
        if node.tag == 'ObjectDeps': objtable.remove(node)
    deps = []
    for obj in data:
        links = obj.findall('./Properties/Property[@name="Group"]/LinkList/Link')
        if links:
            dep = ET.Element('ObjectDeps',Name=obj.get('name'),Count=str(len(links)))
            for link in links:
                if link.get('value') not in included:
                    raise ValueError('Standalone group references excluded object')
                ET.SubElement(dep,'Dep',Name=link.get('value'))
            deps.append(dep)
    for i,node in enumerate(deps): objtable.insert(i,node)
    vps = gui.find('ViewProviderData')
    for node in list(vps):
        if node.get('name') not in included: vps.remove(node)
    vps.set('Count',str(len(vps)))
    set_text_property(doc,'Uid',str(uuid.uuid4()))
    set_text_property(doc,'Label','Smart Cart D4.2 - D4 only')
    set_text_property(doc,'Comment','D4 only; prototype excluded. FCStd payload order repaired. ENGINEERING HOLD.')
    set_text_property(doc,'TipName','D4Assembly')
    # No prototype-owned string-hasher data is needed by plain D4 BReps.
    for obj in data:
        for link in obj.iter('Link'):
            value=link.get('value')
            if value and value not in included:
                raise ValueError('Dangling link: '+value)
    return doc,gui


def repair(source: Path, target: Path, standalone: bool=False, thumbnail: Path|None=None) -> dict:
    if source.resolve()==target.resolve():
        raise ValueError('Source and output must differ')
    with zipfile.ZipFile(source) as archive:
        if archive.testzip() is not None: raise ValueError('Input CRC failure')
        before = restore_trace(archive)
        payloads={n:archive.read(n) for n in archive.namelist()}
        if len(payloads)!=len(archive.namelist()):raise ValueError('Duplicate archive member')
        doc=ET.fromstring(payloads['Document.xml']);gui=ET.fromstring(payloads['GuiDocument.xml'])
        if standalone: doc,gui=only_d4(doc,gui)
        else:
            set_text_property(doc,'Label','Smart Cart D4.2 - CAD order repaired')
            set_text_property(doc,'Comment','D4 payload ordering repaired; original prototype hidden. ENGINEERING HOLD.')
        set_camera(gui)
        payloads['Document.xml']=xml_bytes(doc);payloads['GuiDocument.xml']=xml_bytes(gui)
        thumb='thumbnails/Thumbnail.png'
        if thumbnail is not None: payloads[thumb]=thumbnail.read_bytes()
        apprefs,guirefs=references(doc),references(gui)
        order=['Document.xml']+apprefs+['GuiDocument.xml']+([thumb] if thumb in payloads else [])+guirefs
        if not standalone:
            order += [n for n in archive.namelist() if n not in set(order)]
        if len(order)!=len(set(order)): raise ValueError('Duplicate registration or ZIP member')
        if not all(n in payloads for n in order): raise ValueError('Missing referenced payload')
        for n in order:
            pp=Path(n)
            if pp.is_absolute() or '..' in pp.parts:raise ValueError('Unsafe archive path')
        target.parent.mkdir(parents=True,exist_ok=True)
        with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as out:
            for name in order:
                info=zipfile.ZipInfo(name,(2026,9,14,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
                info.external_attr=0o100644<<16
                out.writestr(info,payloads[name],compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
        with zipfile.ZipFile(target) as out:
            after=restore_trace(out)
            if after['application_skipped'] or after['gui_restored']!=after['gui_registered']:
                raise ValueError('Ordered reader regression failed after repair')
            shapes=[n for n in apprefs if n.endswith('.brp')]
            unchanged=all(out.read(n)==archive.read(n) for n in shapes)
            if not unchanged: raise ValueError('Geometry payload changed')
            return {'source':source.name,'output':target.name,'d4_only':standalone,
                    'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
                    'output_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
                    'before':before,'after':after,'unchanged_BRep_payloads':len(shapes),
                    'geometry_bytes_unchanged':unchanged,'crc_pass':out.testzip() is None,
                    'native_FreeCAD_GUI_test':'NOT_RUN'}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path);parser.add_argument('output',type=Path)
    parser.add_argument('--d4-only',action='store_true');parser.add_argument('--report',type=Path)
    parser.add_argument('--thumbnail',type=Path)
    a=parser.parse_args();result=repair(a.source,a.output,a.d4_only,a.thumbnail)
    text=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    if a.report:a.report.write_text(text,encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k not in ('before','after')},ensure_ascii=False,indent=2))
    print('D4 restore:',result['before']['d4_restored'],'->',result['after']['d4_restored'])

if __name__=='__main__':main()
