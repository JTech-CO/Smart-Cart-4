#!/usr/bin/env python3
"""Validate Korean HOLD copy without changing engineering data.
Run: python tests/hold_text_regression.py [--baseline PATH] [--browser]
Browser mode embeds unchanged shipped CSS/JS in about:blank; it is NOT an HTTP,
WebGL, native persistent-storage or hardware verification. Requires Playwright
and Chromium. CHROMIUM_PATH may override /usr/bin/chromium.
"""
from pathlib import Path
import argparse, collections, hashlib, json, os, re, subprocess
ROOT=Path(__file__).resolve().parents[1]
RESULTS=[]
def check(name, ok, detail=None):
    RESULTS.append(dict(name=name,status='PASS' if ok else 'FAIL',detail=detail))
    print(RESULTS[-1]['status'],name,flush=True)
def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def fixture():
    h=(ROOT/'wiring.html').read_text(encoding='utf-8')
    h=re.sub(r'<link[^>]+rel="icon"[^>]*>', '', h)
    h=re.sub(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>',lambda m:'<style>'+(ROOT/m[1]).read_text(encoding='utf-8')+'</style>',h)
    h=re.sub(r'<script src="([^"]+)"[^>]*></script>',lambda m:'<script>'+(ROOT/m[1]).read_text(encoding='utf-8')+'</script>',h)
    return h

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--baseline',type=Path);ap.add_argument('--browser',action='store_true');args=ap.parse_args()
    d=json.loads((ROOT/'data/design.json').read_text(encoding='utf-8'))
    changes=json.loads((ROOT/'docs/hold-text-changes.json').read_text(encoding='utf-8'))
    js=(ROOT/'js/design-data.js').read_text(encoding='utf-8')
    jd=json.loads(js.split('window.CartDesign = ',1)[1].strip().removesuffix(';'))
    check('Canonical JSON and shipped JavaScript mirror match',jd==d)
    check('Engineering counts and HOLD state retained',len(d['gates'])==11 and len(d['checks'])==11 and len(d['components'])==108 and len(d['connections'])==246 and d['release']=='ENGINEERING HOLD')
    for i,(g,t,c) in enumerate(zip(d['gates'],d['checks'],changes),1):
        check(f'G{i:02}/T{i:02}: edited copy and checklist synchronized',g==c['after'] and t['id']==f'T{i:02}' and t['title']==g['title'] and t['detail']==g['required'])
        numbers=lambda obj: re.findall(r'\d+(?:\.\d+)?',' '.join(obj[k] for k in ['title','reason','required']))
        check(f'G{i:02}: numeric values unchanged',numbers(c['before'])==numbers(g))
    check('JDRV engineering status remains HOLD',next(c for c in d['components'] if c['id']=='JDRV')['status']=='hold')
    if args.baseline:
        before=json.loads((args.baseline/'data/design.json').read_text(encoding='utf-8'))
        check('Every non-copy data field is unchanged',{k:v for k,v in before.items() if k not in ('gates','checks')}=={k:v for k,v in d.items() if k not in ('gates','checks')})
        for pattern in ['js/*.js','css/*.css','*.html','data/*.csv','assets/drawings/*','cad/*']:
            files=[p for p in args.baseline.glob(pattern) if p.is_file() and p.name!='design-data.js']
            check(f'Untouched bytes: {pattern}',bool(files) and all((ROOT/p.relative_to(args.baseline)).is_file() and sha(p)==sha(ROOT/p.relative_to(args.baseline)) for p in files),len(files))
    check('JavaScript syntax',subprocess.run(['node','--check',str(ROOT/'js/design-data.js')],capture_output=True).returncode==0)
    if args.browser:
        from playwright.sync_api import sync_playwright
        errors=[]
        with sync_playwright() as pw:
            b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
            for label,size in [('desktop',(1360,1000)),('tablet',(820,1180)),('mobile',(390,844))]:
                p=b.new_page(viewport={'width':size[0],'height':size[1]});p.on('pageerror',lambda e:errors.append(str(e)))
                p.set_content(fixture(),wait_until='load');p.wait_for_function('!!window.wiringApp',timeout=20000)
                p.locator('.header-actions .gates-open').click()
                check(f'{label}: actual HOLD button opens 11 cards',p.locator('.gate').count()==11 and p.locator('.modal h2').inner_text()=='통전 보류 조건 · 11개')
                actual=p.locator('.gate').evaluate_all("es=>es.map(e=>({id:e.querySelector('.gate-id').textContent,title:e.querySelector('h3').textContent,reason:e.querySelector('p').textContent,required:e.querySelector('.required').textContent}))")
                check(f'{label}: all 11 cards display corrected strings',all(a=={'id':g['id']+' / HOLD','title':g['title'],'reason':g['reason'],'required':'해소 조건 · '+g['required']} for a,g in zip(actual,d['gates'])))
                bounds=p.locator('.modal').evaluate("e=>({scroll:e.scrollWidth,width:e.clientWidth,rect:e.getBoundingClientRect().toJSON(),inner:innerWidth})")
                check(f'{label}: no horizontal modal overflow',bounds['scroll']<=bounds['width']+1 and bounds['rect']['left']>=0 and bounds['rect']['right']<=bounds['inner']+1,bounds)
                check(f'{label}: no clipped card text',p.locator('.gate').evaluate_all('es=>es.every(e=>e.scrollWidth<=e.clientWidth+1 && e.scrollHeight<=e.clientHeight+1)'))
                p.locator('.modal').evaluate("e=>{const card=e.querySelectorAll('.gate')[4];e.scrollTop=card.offsetTop-e.offsetTop-90}")
                p.screenshot(path=str(ROOT/f'assets/previews/hold-text-fixed-{label}.png'))
                p.locator('.modal').evaluate('e=>e.scrollTop=e.scrollHeight')
                check(f'{label}: final card reachable',p.locator('.gate').last.is_visible())
                p.keyboard.press('Escape');check(f'{label}: Escape closes modal',p.locator('.modal').count()==0)
                cards=p.locator('.check-card').evaluate_all("es=>es.map(e=>({title:e.querySelector('label>span').textContent,detail:e.querySelector('p').textContent}))")
                check(f'{label}: checklist copy updated',all(a['title']==t['id']+t['title'] and a['detail']==t['detail'] for a,t in zip(cards,d['checks'])))
                p.locator('#inspector-gates').click();p.locator('#modal-close').click();check(f'{label}: inspector entry and close button work',p.locator('.modal').count()==0)
                check(f'{label}: wiring table still has 246 entries',p.locator('#wire-table tr').count()==246)
                p.close()
            check('Browser JavaScript has no uncaught errors',not errors,errors);b.close()
    report={'scope':'Korean HOLD text-only patch; no engineering or CAD redesign','base_repository':'JTech-CO/Smart-Cart-4','base_tree_sha':'2428d8e7eed588ae8e594a3738c01288f400cc42','browser_mode':'about:blank with unchanged shipped CSS/JS embedded' if args.browser else 'not run','not_performed':['Remote deployment','Live HTTP navigation (blocked by browser policy)','Electrical or mechanical validation','FreeCAD GUI execution'],'checks':RESULTS,'summary':dict(collections.Counter(r['status'] for r in RESULTS))}
    (ROOT/'docs/hold-text-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('SUMMARY',report['summary']);return int(any(r['status']=='FAIL' for r in RESULTS))
if __name__=='__main__':raise SystemExit(main())
