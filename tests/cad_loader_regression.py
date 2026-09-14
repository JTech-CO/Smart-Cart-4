#!/usr/bin/env python3
"""Forward-only FreeCAD archive reader regression, with a failing old-order fixture."""
from pathlib import Path
import argparse
import hashlib
import importlib.util
import io
import json
import sys
import zipfile
from xml.etree import ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('fcstd_order',ROOT/'tools/repair_fcstd_order.py')
order=importlib.util.module_from_spec(spec);spec.loader.exec_module(order)
checks=[]
def check(name,ok,detail=None):
    checks.append({'name':name,'status':'PASS' if ok else 'FAIL','detail':detail})

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--original',type=Path)
    args=parser.parse_args()
    manifest=json.loads((ROOT/'cad/assembly-manifest.json').read_text())
    expected={f['name']:f for f in manifest['features']}
    reports={}
    with zipfile.ZipFile(ROOT/'cad/Smart-Cart-D4.FCStd') as combined:
        for name,nobjects in [('Smart-Cart-D4.FCStd',1267),('Smart-Cart-D4-Only.FCStd',1004)]:
            with zipfile.ZipFile(ROOT/'cad'/name) as z:
                trace=order.restore_trace(z);reports[name]=trace
                check(name+': archive CRC',z.testzip() is None)
                check(name+': every app payload reached by monotone loader',not trace['application_skipped'],trace['application_restored'])
                check(name+': all 998 D4 shapes reached',trace['d4_restored']==998,trace['d4_restored'])
                check(name+': every GUI payload reached',trace['gui_restored']==trace['gui_registered'],trace['gui_restored'])
                doc=ET.fromstring(z.read('Document.xml'));gui=ET.fromstring(z.read('GuiDocument.xml'))
                declared=doc.find('Objects').findall('Object');records=doc.find('ObjectData').findall('Object')
                check(name+': object/data counts',len(declared)==len(records)==nobjects,{'declared':len(declared),'records':len(records)})
                declared_names={o.get('name') for o in declared}
                check(name+': every D4 feature declared',set(expected).issubset(declared_names))
                dangling=[e.get('value') for e in doc.iter('Link') if e.get('value') and e.get('value') not in declared_names]
                check(name+': no dangling group links',not dangling,dangling)
                mismatches=[n for n,f in expected.items() if z.read(f['file'])!=combined.read(f['file'])]
                check(name+': same 998 geometry payloads as full repaired file',not mismatches,mismatches)
                lost=[]
                for n,f in expected.items():
                    target_visible=f['ref']!='COVER'
                    for parent,path in [(doc,'./ObjectData/Object'),(gui,'./ViewProviderData/ViewProvider')]:
                        p=parent.find(path+f'[@name="{n}"]/Properties/Property[@name="Visibility"]/Bool')
                        if p is None or (p.get('value')=='true')!=target_visible:lost.append(n)
                check(name+': D4 visibility and hidden cover preserved',not lost,sorted(set(lost)))
                if name.endswith('-Only.FCStd'):
                    check(name+': no prototype objects or payloads',all(n.startswith('D4') for n in declared_names) and all(n.startswith('D4_') for n in order.references(doc)))
                # Reproduce the previous defect, without shipping a broken FCStd.
                d4=[n for n in order.physical_names(z) if n.startswith('D4_') and n.endswith('.brp')]
                oldorder=[n for n in order.physical_names(z) if n not in set(d4)]+d4
                buf=io.BytesIO()
                with zipfile.ZipFile(buf,'w',zipfile.ZIP_DEFLATED) as bad:
                    for n in oldorder:bad.writestr(n,z.read(n))
                buf.seek(0)
                with zipfile.ZipFile(buf) as bad:
                    badtrace=order.restore_trace(bad)
                    check(name+': wrong-order fixture rejected (998 D4 shapes skipped)',badtrace['d4_restored']==0 and len(badtrace['d4_skipped'])==998)
        if args.original:
            with zipfile.ZipFile(args.original) as orig:
                t=order.restore_trace(orig)
                check('Original reported file reproduces 0/998 restored D4 shapes',t['d4_restored']==0 and t['d4_registered']==998)
                unchanged=[n for n in orig.namelist() if n.endswith('.brp') and orig.read(n)==combined.read(n)]
                total=len([n for n in orig.namelist() if n.endswith('.brp')])
                check('All original and D4 BRep bytes preserved',len(unchanged)==total,{'unchanged':len(unchanged),'total':total})
    report={'scope':'FCStd forward-only loader-order replay and payload invariants. Not native FreeCAD execution.',
            'freecad_source':'https://github.com/FreeCAD/FreeCAD/blob/main/src/Base/Reader.cpp',
            'native_GUI_status':'NOT_RUN','checks':checks,'restoration':reports}
    (ROOT/'docs/cad-loader-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'passed':sum(c['status']=='PASS' for c in checks),'failed':sum(c['status']=='FAIL' for c in checks)},indent=2))
    for c in checks:
        if c['status']=='FAIL':print(c)
    return any(c['status']=='FAIL' for c in checks)

if __name__=='__main__':sys.exit(main())
