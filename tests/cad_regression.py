#!/usr/bin/env python3
"""Independent archive/XML and OpenCascade geometry regression; not native FreeCAD GUI."""
from pathlib import Path
import json,zipfile,tempfile,xml.etree.ElementTree as E,time,hashlib,sys
ROOT=Path(__file__).resolve().parents[1]; results=[]
def check(name,ok,detail=None):
    results.append({'name':name,'status':'PASS' if ok else 'FAIL','detail':detail})
def main():
    start=time.time();cad=ROOT/'cad';info=json.loads((cad/'assembly-manifest.json').read_text());z=zipfile.ZipFile(cad/'Smart-Cart-D4.FCStd')
    check('FCStd ZIP CRC',z.testzip() is None,len(z.namelist()))
    doc=E.fromstring(z.read('Document.xml'));gui=E.fromstring(z.read('GuiDocument.xml'))
    check('Document and GuiDocument XML parse',True)
    objects=doc.find('Objects').findall('Object');data=doc.find('ObjectData').findall('Object')
    check('Document object declarations/data count',len(objects)==len(data)==1267,{'objects':len(objects),'data':len(data)})
    check('D4 feature inventory',len(info['features'])==info['d4Features']==998)
    missing=[f['file'] for f in info['features'] if f['file'] not in z.namelist()]
    check('All D4 BRep entries present',not missing,missing)
    feature_names={f['name'] for f in info['features']}
    check('All D4 object records present',feature_names.issubset({o.get('name') for o in data}))
    # Verify all external document payload references, excluding optional shape mapping files.
    refs=[el.get('file') for el in doc.iter() if el.get('file')]
    check('FCStd Document payload references',all(p in z.namelist() for p in refs),[p for p in refs if p not in z.namelist()])
    try:
        import cadquery as cq
        from OCP.BRep import BRep_Builder
        from OCP.BRepTools import BRepTools
        from OCP.TopoDS import TopoDS_Shape
        from OCP.STEPControl import STEPControl_Reader
        from OCP.IFSelect import IFSelect_ReturnStatus
        invalid=[];bounds_bad=[];solid_total=0;volume=0;seen_refs=set();step_expected_solids=0;step_expected_volume=0
        with tempfile.TemporaryDirectory() as td:
            for f in info['features']:
                path=Path(td)/f['file'];path.write_bytes(z.read(f['file']))
                shape=TopoDS_Shape();BRepTools.Read_s(shape,str(path),BRep_Builder());obj=cq.Shape.cast(shape)
                if obj.isNull() or not obj.isValid():invalid.append(f['name'])
                b=obj.BoundingBox();bb=[b.xmin,b.ymin,b.zmin,b.xmax,b.ymax,b.zmax];delta=max(abs(a-b) for a,b in zip(bb,f['bounds_mm']))
                if delta>0.01:bounds_bad.append({'name':f['name'],'max_delta_mm':delta})
                solid_total+=len(obj.Solids());volume+=obj.Volume();seen_refs.add(f['ref'])
                if f['ref'] not in info.get('stepExportExcludedRefs',[]):
                    step_expected_solids+=len(obj.Solids());step_expected_volume+=obj.Volume()
        check('OpenCascade: all 998 BReps valid',not invalid,invalid)
        check('BRep bounds match assembly manifest within 0.01mm',not bounds_bad,bounds_bad[:12])
        check('BRep solid inventory matches manifest',solid_total==sum(f['solids'] for f in info['features']),solid_total)
        d=json.loads((ROOT/'data/design.json').read_text());expected={c['id'] for c in d['components']}|{w['id'] for w in d['connections']}
        check('CAD covers all 108 components and 246 harness IDs',expected.issubset(seen_refs),sorted(expected-seen_refs))
        reader=STEPControl_Reader();status=reader.ReadFile(str(cad/'Smart-Cart-D4.step'))
        check('STEP read status',status==IFSelect_ReturnStatus.IFSelect_RetDone,str(status));n=reader.TransferRoots();step=cq.Shape.cast(reader.OneShape())
        check('STEP transferred roots',n>0,n);check('STEP valid compound',not step.isNull() and step.isValid())
        step_solids=len(step.Solids());check('STEP / visible BRep solid count agreement (COVER excluded)',step_solids==step_expected_solids,{'STEP':step_solids,'visibleBRep':step_expected_solids,'allBRep':solid_total})
        rel=abs(step.Volume()-step_expected_volume)/max(abs(step_expected_volume),1);check('STEP / visible BRep volume agreement (1e-6 relative, COVER excluded)',rel<1e-6,rel)
    except ImportError as e:
        results.append({'name':'OpenCascade geometry tests','status':'SKIP','detail':str(e)})
    results.append({'name':'Native FreeCAD GUI open/save','status':'NOT_RUN','detail':'FreeCAD executable not installed in this runtime; OpenCascade validation does not replace this test.'})
    report={'scope':'FCStd archive/XML and OpenCascade shape / STEP import checks; no manufacturing, collision, stress or native GUI approval.','seconds':round(time.time()-start,2),'checks':results}
    (ROOT/'docs/cad-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));return any(x['status']=='FAIL' for x in results)
if __name__=='__main__':sys.exit(main())
