#!/usr/bin/env python3
"""File/CSV/XML/image integrity and local HTTP subpath checks. No browser required."""
from pathlib import Path
import ast,csv,functools,hashlib,http.server,json,re,threading,urllib.parse,urllib.request,zipfile,sys,xml.etree.ElementTree as E
ROOT=Path(__file__).resolve().parents[1];checks=[]
def check(name,ok,detail=None):checks.append({'name':name,'status':'PASS' if ok else 'FAIL','detail':detail})
def local_target(base,href):
    u=urllib.parse.urlsplit(href)
    if u.scheme or u.netloc or not u.path:return None
    return (base.parent/urllib.parse.unquote(u.path)).resolve()
def main():
    d=json.loads((ROOT/'data/design.json').read_text())
    files=[p for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts]
    check('Static app entry points and deployment marker',all((ROOT/p).is_file() for p in ['index.html','wiring.html','.nojekyll','assets/favicon.svg']))
    links=[]
    for p in files:
        if p.suffix=='.html':refs=re.findall(r'(?:href|src)="([^"]+)"',p.read_text())
        elif p.suffix=='.md':refs=re.findall(r'\]\(([^)\s]+)\)',p.read_text())
        else:continue
        for href in refs:
            target=local_target(p,href)
            if target:links.append((p.relative_to(ROOT).as_posix(),href,target))
    missing=[{'file':p,'href':h} for p,h,t in links if not t.exists()]
    check('All relative HTML/Markdown links resolve',not missing,missing)
    check('No runtime absolute-root paths',all(not h.startswith('/') for p,h,t in links))
    badjson=[]
    for p in files:
        if p.suffix=='.json':
            try:json.loads(p.read_text())
            except Exception as e:badjson.append([str(p.relative_to(ROOT)),str(e)])
    check('All JSON files parse',not badjson,badjson)
    badsvg=[]
    for p in (ROOT/'assets').rglob('*.svg'):
        try:E.parse(p)
        except Exception as e:badsvg.append([str(p.relative_to(ROOT)),str(e)])
    check('Favicon and all 28 SVG sheets parse as XML',not badsvg and len(list((ROOT/'assets/drawings').glob('*.svg')))==28,badsvg)
    rows=list(csv.DictReader((ROOT/'data/point-to-point.csv').open(encoding='utf-8-sig',newline='')))
    keys={'ID':'id','From':'from','To':'to','Net':'net','Kind':'kind','Sheet':'sheet','Gauge':'gauge','Status':'status','Notes':'note'}
    check('Packaged CSV equals 246 canonical connection records',len(rows)==246 and all(all(row[k]==str(w.get(v,'')) for k,v in keys.items()) for row,w in zip(rows,d['connections'])))
    term=list(csv.DictReader((ROOT/'data/terminal-register.csv').open(encoding='utf-8-sig')));expected={(c['id'],p,n) for c in d['components'] for p,n in c['ports'].items()}
    check('Terminal CSV equals all 379 registered ports',len(term)==379 and {(t['Component'],t['Terminal'],t['Net']) for t in term}==expected)
    comp=list(csv.DictReader((ROOT/'data/component-register.csv').open(encoding='utf-8-sig')));check('Component CSV matches 108 IDs',len(comp)==108 and {c['ID'] for c in comp}=={c['id'] for c in d['components']})
    check('CSV BOM for Korean spreadsheet interoperability',all(p.read_bytes().startswith(b'\xef\xbb\xbf') for p in (ROOT/'data').glob('*.csv')))
    try:
        from PIL import Image
        bad=[];images=list((ROOT/'assets').rglob('*.png'))+list((ROOT/'assets').rglob('*.webp'))
        for p in images:
            try:
                with Image.open(p) as im:im.verify()
            except Exception as e:bad.append(str(p.relative_to(ROOT))+':'+str(e))
        check('All product-reference and preview images decode',not bad,{'count':len(images),'errors':bad})
        check('All 18 restored reference images present',len(list((ROOT/'assets/reference').glob('*.webp')))==18)
    except ImportError:checks.append({'name':'Image decoding','status':'NOT_RUN','detail':'Pillow is not installed.'})
    no_fonts=[str(p.relative_to(ROOT)) for p in files if p.suffix.lower() in ['.ttf','.otf','.woff','.woff2']];check('No bundled system font files',not no_fonts,no_fonts)
    pyerrors=[]
    for p in list((ROOT/'tests').glob('*.py'))+list((ROOT/'tools').glob('*.py'))+list((ROOT/'cad').glob('*.FCMacro')):
        try:ast.parse(p.read_text(),filename=p.name)
        except SyntaxError as e:pyerrors.append(str(e))
    check('Python tools and FreeCAD macro syntax',not pyerrors,pyerrors)
    source=zipfile.ZipFile(ROOT/'cad/source-prototype.FCStd');target=zipfile.ZipFile(ROOT/'cad/Smart-Cart-D4.FCStd')
    check('Original prototype ZIP CRC',source.testzip() is None)
    shapes=[n for n in source.namelist() if n.endswith('.brp')];mismatched=[n for n in shapes if n not in target.namelist() or source.read(n)!=target.read(n)]
    check('Original prototype BReps preserved byte-for-byte in D4',not mismatched,{'compared':len(shapes),'mismatched':mismatched})
    # Verify local static serving under a repository-style subpath without bypassing browser policy.
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self,*a):pass
    handler=functools.partial(Quiet,directory=ROOT.parent);server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler);threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}/'+urllib.parse.quote(ROOT.name)+'/'
    paths={'index.html','wiring.html','assets/favicon.svg','data/point-to-point.csv'}|{str(t.relative_to(ROOT)) for _,_,t in links if t.is_file() and t.is_relative_to(ROOT)}|{c['photo'][2:] for c in d['components'] if c.get('photo')}
    errors=[]
    for rel in sorted(paths):
        try:
            with urllib.request.urlopen(base+urllib.parse.quote(rel),timeout=8) as resp:
                data=resp.read()
                if resp.status!=200 or data!=(ROOT/rel).read_bytes():errors.append(rel)
        except Exception as e:errors.append(rel+':'+str(e))
    server.shutdown();server.server_close();check('Local HTTP repository-subpath resources return exact bytes',not errors,{'resources':len(paths),'errors':errors})
    report={'scope':'Package file/path/content checks and standard-library local HTTP requests, not managed Chromium navigation or public deployment.','checks':checks}
    (ROOT/'docs/package-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));return any(c['status']=='FAIL' for c in checks)
if __name__=='__main__':sys.exit(main())
