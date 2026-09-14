#!/usr/bin/env python3
"""DOM/browser regression for the two shipped pages.
Default: local HTTP + native storage/downloads. --fixture: same scripts in about:blank
with embedded assets and explicit storage/export adapters (not a hosting test).
"""
from __future__ import annotations
import argparse,base64,csv as csvlib,functools,http.server,io,json,os,re,threading,time,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
RESULTS=[];CONSOLES=[];ERRORS=[];FIXTURE=False

def check(name,ok=True,detail=None):
    RESULTS.append({'name':name,'status':'PASS' if ok else 'FAIL','detail':detail})
    print(('PASS ' if ok else 'FAIL ')+name,flush=True)

def inline_document(name,storage=None,storage_error=False):
    h=(ROOT/name).read_text()
    h=re.sub(r'<link[^>]+rel="icon"[^>]*>','',h)
    h=re.sub(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>',lambda m:'<style>'+ (ROOT/m.group(1)).read_text()+'</style>',h)
    h=re.sub(r'<script src="([^"]+)"[^>]*></script>',lambda m:'<script>'+ (ROOT/m.group(1)).read_text()+'</script>',h)
    assets={ './'+str(p.relative_to(ROOT)): 'data:image/webp;base64,'+base64.b64encode(p.read_bytes()).decode() for p in (ROOT/'assets/reference').glob('*.webp') }
    # Boundaries are test adapters only. All production script bodies above remain unchanged.
    fixture='''<script>
    window.__qaStorage=SEED;window.__qaExports=[];window.__qaBlobs=new Map();window.__qaAssets=ASSETS;
    Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__qaStorage[k]??null,setItem:(k,v)=>{FAILSTORE;window.__qaStorage[k]=String(v)},removeItem:k=>delete window.__qaStorage[k],clear:()=>{window.__qaStorage={}}}});
    const oldURL=URL.createObjectURL.bind(URL);URL.createObjectURL=b=>{const u=oldURL(b);window.__qaBlobs.set(u,b);return u};
    const click=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(this.download){window.__qaExports.push({name:this.download,url:this.href,blob:window.__qaBlobs.get(this.href)});return;}return click.call(this)};
    const resolve=()=>document.querySelectorAll('img[src]').forEach(img=>{let s=img.getAttribute('src');if(window.__qaAssets[s]){img.dataset.fixtureSource=s;img.src=window.__qaAssets[s]}});
    new MutationObserver(resolve).observe(document.documentElement,{subtree:true,childList:true});
    </script>'''.replace('SEED',json.dumps(storage or {},ensure_ascii=False)).replace('ASSETS',json.dumps(assets)).replace('FAILSTORE','throw new Error("Fixture: storage disabled");' if storage_error else '')
    return h.replace('<head>','<head>'+fixture,1)


def main():
    global FIXTURE
    ap=argparse.ArgumentParser();ap.add_argument('--fixture',action='store_true');args=ap.parse_args();FIXTURE=args.fixture
    started=time.time();server=None;ctx=None
    if not FIXTURE:
        handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=ROOT)
        server=http.server.ThreadingHTTPServer(('127.0.0.1',0),handler);threading.Thread(target=server.serve_forever,daemon=True).start()
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-angle=swiftshader'])
        ctx=browser.new_context(viewport={'width':1440,'height':960},accept_downloads=True)
        def load(name,query='',size=(1440,960),storage=None,storage_error=False):
            page=ctx.new_page();page.set_viewport_size({'width':size[0],'height':size[1]});page.set_default_timeout(12000)
            page.on('pageerror',lambda e:ERRORS.append(str(e)))
            page.on('console',lambda m:CONSOLES.append({'type':m.type,'text':m.text[:1000]}))
            if FIXTURE:
                page.goto('about:blank'+('?' +query if query else ''));page.set_content(inline_document(name,storage,storage_error),wait_until='load')
            else:
                page.goto('http://127.0.0.1:'+str(server.server_port)+'/'+name+('?' +query if query else ''))
            page.wait_for_function('!!window.'+('cartApp' if name=='index.html' else 'wiringApp'),timeout=45000)
            return page
        try:
            w=load('wiring.html');check('Wiring boots in default illustrated power view',w.evaluate("wiringApp.mode==='physical'&&wiringApp.sheet==='power'"))
            check('Counters use current data: 108 / 246 / 0.862 / 11',w.evaluate("[...document.querySelectorAll('[data-stat]')].every(e=>e.textContent==={components:'108',connections:'246',lidar:'0.862',gates:'11'}[e.dataset.stat])"))
            check('Connection table has 246 rows',w.locator('#wire-table tr').count()==246)
            for mode in ['physical','schematic']:
                w.locator('[data-mode='+mode+']').click()
                for sheet in w.locator('[data-sheet]').evaluate_all('(es)=>es.map(e=>e.dataset.sheet)'):
                    w.locator('[data-sheet='+sheet+']').click()
                    facts=w.evaluate('''()=>({sheet:wiringApp.sheet,mode:wiringApp.mode,nodes:document.querySelectorAll('#drawing-wrap .node').length,wires:document.querySelectorAll('#drawing-wrap .wire').length,expected:wiringApp.drawing.wires.length,svg:!!document.querySelector('#drawing-wrap svg')})''')
                    check(f'{mode}/{sheet}: display and wire count',facts['svg'] and facts['sheet']==sheet and facts['mode']==mode and facts['wires']==facts['expected'],facts)
            w.evaluate("wiringApp.setMode('physical');wiringApp.setSheet('power')")
            # Use actual SVG nodes and keyboard activation, not only app APIs.
            n=w.locator('#drawing-wrap [data-node="BT1"]');n.focus();n.press('Enter');check('SVG component keyboard selection',w.locator('#inspector .inspector-ref').inner_text()=='BT1')
            n=w.locator('#drawing-wrap [data-wire="W001"]');n.focus();n.press('Enter');check('SVG wire keyboard selection',w.locator('#inspector .inspector-ref').inner_text()=='W001')
            w.locator('#wire-labels').check();check('Wire ID toggle shows labels',w.locator('#drawing-wrap .wire-id').first.evaluate('(e)=>getComputedStyle(e).display')!='none')
            w.locator('#returns-show').uncheck();check('Return toggle hides 0V wires',w.evaluate("[...document.querySelectorAll('#drawing-wrap .wire[data-kind=return]')].every(e=>getComputedStyle(e).display==='none')"));w.locator('#returns-show').check()
            before=w.evaluate('wiringApp.viewBox.slice()');w.locator('#zoom-in').click();after=w.evaluate('wiringApp.viewBox.slice()');check('Wiring zoom-in reduces viewBox',after[2]<before[2]);w.locator('#zoom-out').click();check('Wiring zoom-out increases viewBox',w.evaluate('wiringApp.viewBox[2]')>after[2]);w.locator('#zoom-fit').click();check('Wiring fit restores sheet extents',w.evaluate('wiringApp.viewBox[2]===wiringApp.drawing.width'))
            w.locator('#drawing-wrap').focus();w.locator('#drawing-wrap').press('ArrowRight');check('Wiring keyboard pan changes origin',w.evaluate('wiringApp.viewBox[0]')>0);w.locator('#drawing-wrap').press('Home');check('Wiring keyboard Home resets',w.evaluate('wiringApp.viewBox[0]===0'));w.locator('#drawing-wrap').press('Escape');check('Wiring Escape clears selection',w.evaluate("wiringApp.selection===''") )
            bounds=w.locator('#drawing-wrap').bounding_box();x=bounds['x']+bounds['width']*.65;y=bounds['y']+bounds['height']*.55
            w.mouse.move(x,y);w.mouse.down();w.mouse.move(x+70,y+25,steps=6);w.mouse.up();check('Wiring actual pointer drag pans',w.evaluate('wiringApp.viewBox[0]')!=0);w.locator('#zoom-fit').click()
            w.locator('#wire-search').fill('W246');check('Wiring ID search',w.locator('#wire-table [data-select-wire]').count()==1)
            w.locator('#wire-search').fill('NO_SUCH_CONNECTION');check('Wiring no-results state',w.locator('#wire-table').inner_text().strip()=='검색 결과가 없습니다.')
            w.locator('#wire-search').fill('');w.locator('#wire-filter').select_option('steerpower');check('Wiring type filter',w.locator('#wire-table [data-select-wire]').count()==w.evaluate("CartDesign.connections.filter(w=>w.kind==='steerpower').length"));w.locator('#wire-filter').select_option('all')
            w.locator('#wire-search').fill('W246');w.locator('[data-select-wire="W246"]').click();check('Table selection locates sheet and conductor',w.evaluate("wiringApp.selection==='W246'") and 'W246' in w.locator('#inspector').inner_text());check('Cross-page conductor URL',w.locator('#inspector a.button').get_attribute('href')=='./index.html?wire=W246');w.locator('#wire-search').fill('')
            # No uncaught inspector failure across the entire register.
            issues=w.evaluate('''()=>{const bad=[];for(const c of CartDesign.components){try{CartUI.inspect(c.id,'wiring',()=>{});if(!document.querySelector('#inspector').textContent.includes(c.id))bad.push(c.id)}catch(e){bad.push(c.id+':'+e.message)}}for(const x of CartDesign.connections){try{CartUI.inspect(x.id,'wiring',()=>{});if(!document.querySelector('#inspector').textContent.includes(x.from))bad.push(x.id)}catch(e){bad.push(x.id+':'+e.message)}}return bad}''')
            check('All 108 component + 246 wire wiring inspectors',not issues,issues)
            w.locator('.sources-open').click();check('Sources dialog renders full registry',w.locator('.modal .source').count()==w.evaluate('CartDesign.sources.length'));w.keyboard.press('Escape');check('Modal Escape close',w.locator('.modal').count()==0)
            w.locator('button.gates-open').click();check('Gate dialog lists all 11 holds',w.locator('.modal .gate').count()==11);w.keyboard.press('Tab');check('Modal focus stays inside',w.evaluate("!!document.activeElement.closest('.modal')"));w.locator('#modal-close').click()
            w.evaluate("wiringApp.setMode('physical');wiringApp.setSheet('power');wiringApp.select('BT1')")
            if FIXTURE:
                w.locator('#svg-save').click();svg=w.evaluate("async()=>{const x=__qaExports.at(-1);return {name:x.name,text:await x.blob.text()}}")
            else:
                with w.expect_download() as dl:w.locator('#svg-save').click()
                xdl=dl.value;svg={'name':xdl.suggested_filename,'text':Path(xdl.path()).read_text()}
            valid=w.evaluate("s=>{const d=new DOMParser().parseFromString(s,'image/svg+xml');return !d.querySelector('parsererror')&&!d.querySelector('.node.selected')&&!!d.querySelector('svg')}",svg['text']);check('SVG export XML and neutral selection',valid,svg['name'])
            if FIXTURE:
                w.locator('a[download]').click();csv=w.evaluate("async()=>await __qaExports.at(-1).blob.text()")
            else:
                with w.expect_download() as dl:w.locator('a[download]').click()
                csv=Path(dl.value.path()).read_text(encoding='utf-8-sig')
            check('CSV export covers all 246 records',len(csv.strip().splitlines())==247 and 'W246' in csv)
            check('CSV export agrees with packaged CSV data',list(csvlib.reader(io.StringIO(csv.lstrip('\ufeff'))))==list(csvlib.reader((ROOT/'data/point-to-point.csv').open(encoding='utf-8-sig'))))
            w.locator('[data-check="T01"]').check();w.locator('[data-memo="T01"]').fill('<img src=x onerror="window.__xss=true"> test note')
            check('Checklist progress updates',w.locator('#check-progress').inner_text()=='1 / 11 기록')
            for el in w.locator('[data-check]').all():el.check()
            check('All manual checks do not release engineering HOLD',w.locator('#check-progress').inner_text()=='11 / 11 기록' and w.evaluate("CartDesign.release==='ENGINEERING HOLD'") and 'HOLD' in w.locator('.check-foot').inner_text())
            if FIXTURE:
                seed=w.evaluate('({...__qaStorage})');w.locator('#export-checks').click();record=w.evaluate("async()=>JSON.parse(await __qaExports.at(-1).blob.text())")
            else:
                seed=None
                with w.expect_download() as dl:w.locator('#export-checks').click()
                record=json.loads(Path(dl.value.path()).read_text())
            check('Inspection JSON preserves HOLD and typed notes',record['engineeringRelease']=='HOLD' and len(record['records'])==11 and '<img' in record['records']['T01']['memo'])
            w.close();w=load('wiring.html',storage=seed)
            check('Checklist serialization restores prior checks (adapter in fixture)',w.locator('#check-progress').inner_text()=='11 / 11 기록');check('Stored markup remains escaped',w.evaluate('window.__xss!==true') and w.locator('[data-memo="T01"]').input_value().startswith('<img'))
            w.locator('#reset-checks').click();w.locator('#confirm-reset').click();check('Checklist reset confirmation clears records',w.locator('#check-progress').inner_text()=='0 / 11 기록')
            # Screenshots are of actual DOM/source execution, not fabricated drawings.
            w.evaluate("wiringApp.setMode('physical');wiringApp.setSheet('power');wiringApp.select('')");w.evaluate("document.documentElement.style.scrollBehavior='auto';scrollTo(0,0)");w.wait_for_function('scrollY<2');w.screenshot(path=str(ROOT/'assets/previews/wiring-desktop.png'),full_page=False)
            for sheet,name in [('signal','wiring-motor-pwm'),('steering','wiring-servo')]:
                w.evaluate('(s)=>wiringApp.setSheet(s)',sheet);w.screenshot(path=str(ROOT/'assets/previews'/f'{name}.png'),full_page=False)
            w.close()
            # Parse-corrupt and blocked storage must not prevent the entire wiring page from loading.
            if FIXTURE:
                for bad in ['null','[]','123','{oops','{"UNKNOWN":{"done":true},"T01":{"done":"yes","memo":4}}']:
                    z=load('wiring.html',storage={'smart-cart-d4-commission-v1':bad});check('Storage recovery: '+bad[:26],z.locator('#check-progress').inner_text()=='0 / 11 기록');z.close()
                z=load('wiring.html',storage_error=True);z.locator('[data-check="T01"]').check();check('Blocked storage degrades to export warning', '저장을 사용할 수 없습니다' in z.locator('#toast').inner_text());z.close()
            z=load('wiring.html','mode=schematic&wire=W246');check('Wiring deep link applies mode and wire',z.evaluate("wiringApp.mode==='schematic'&&wiringApp.selection==='W246'"));z.close()
            z=load('wiring.html','sheet=invalid&mode=invalid&part=unknown');check('Invalid wiring query does not crash',z.evaluate("wiringApp.sheet==='power'&&wiringApp.mode==='physical'"));z.close()
            # 3D page, all IDs, real pointer/keyboard interaction and sensor-specific deep links.
            m=load('index.html');mode=m.evaluate('cartApp.mode');check('3D initializes with WebGL or software fallback',mode in ['webgl2','software'],mode)
            check('Minimal 3D UI: no old control deck',m.locator('input,select').count()==0 and m.locator('.sheet-tabs').count()==0)
            check('3D scene contains both servos / forward ToF / rail LiDAR',m.evaluate("cartBuilder.metadata.frontServoIds.length===2&&!cartBuilder.metadata.hasMast&&cartBuilder.metadata.tofAxes.every(v=>v[2]===1)"))
            home=m.evaluate('JSON.parse(JSON.stringify(cartRenderer.state))');bb=m.locator('#cart-canvas').bounding_box();x=bb['x']+bb['width']*.5;y=bb['y']+bb['height']*.5
            m.mouse.move(x,y);m.mouse.down();m.mouse.move(x+60,y+25,steps=4);m.mouse.up();check('3D pointer orbit changes camera',m.evaluate('cartRenderer.state.yaw')!=home['yaw'])
            prev=m.evaluate('cartRenderer.state.distance');m.mouse.wheel(0,-180);m.wait_for_timeout(150);check('3D wheel zoom',m.evaluate('cartRenderer.state.distance')<prev)
            prev=m.evaluate('cartRenderer.state.target.slice()');m.mouse.down(button='right');m.mouse.move(x+110,y+60,steps=3);m.mouse.up(button='right');check('3D right drag pan',m.evaluate('cartRenderer.state.target.slice()')!=prev)
            m.locator('#cart-canvas').focus();m.locator('#cart-canvas').press('Home');check('3D Home restores camera',m.evaluate('cartRenderer.state.distance')==home['distance']);m.locator('#cart-canvas').press('ArrowLeft');check('3D keyboard orbit',m.evaluate('cartRenderer.state.yaw')!=home['yaw'])
            problems=m.evaluate('''()=>{const bad=[];for(const c of CartDesign.components){try{cartApp.select(c.id);if(!document.querySelector('#part-content').textContent.includes(c.id))bad.push(c.id)}catch(e){bad.push(c.id+':'+e.message)}}for(const w of CartDesign.connections){try{cartApp.select(w.id);const t=document.querySelector('#part-content').textContent;if(!t.includes(w.from)||!t.includes(w.to))bad.push(w.id)}catch(e){bad.push(w.id+':'+e.message)}}return bad}''')
            check('All 108 component + 246 wire 3D inspectors',not problems,problems)
            m.evaluate("cartApp.select('SVL')");check('Servo evidence photo resolves in fixture',m.locator('.part-photo img').evaluate('(e)=>e.complete&&e.naturalWidth>0'));check('Servo inspector retains dimension conflict', '52×30×65' in m.locator('#part-content').inner_text())
            m.locator('#close-panel').click();check('3D close inspector clears selection',m.locator('#part-panel').is_hidden() and m.evaluate("cartApp.selected===''") )
            m.evaluate("cartApp.select('W001')");m.locator('#part-content [data-part="BT1"]').click();check('Wire endpoint opens component inspector',m.evaluate("cartApp.selected==='BT1'"));m.keyboard.press('Escape');check('3D Escape closes inspector',m.locator('#part-panel').is_hidden())
            m.evaluate('cartApp.home();cartRenderer.draw()')
            # Test actual hit-testing plus pointerup selection. Pick a visible non-floor triangle centroid.
            if mode=='software':
                hit=m.evaluate('''()=>{const r=cartRenderer,c=r.canvas.getBoundingClientRect();for(let i=r.lastFaces.length-1;i>=0;i--){const f=r.lastFaces[i];if(!['FRAME','SVL','SVR','LD1','ML','MR'].includes(f.it.id))continue;const area=Math.abs((f.b[0]-f.a[0])*(f.c[1]-f.a[1])-(f.b[1]-f.a[1])*(f.c[0]-f.a[0]));if(area<15)continue;let x=(f.a[0]+f.b[0]+f.c[0])/3/r.dpr+c.left,y=(f.a[1]+f.b[1]+f.c[1])/3/r.dpr+c.top;if(y<100||y>c.bottom-100||x>c.right-400)continue;let id=r.pick(x,y);if(id)return {x,y,id}}return null}''')
                check('CPU 3D hit-test finds a real rendered part',bool(hit),hit)
                if hit:
                    m.mouse.click(hit['x'],hit['y']);check('Actual 3D part click opens matching inspector',m.evaluate('cartApp.selected')==hit['id'])
            m.evaluate("cartApp.select('');cartApp.home();cartRenderer.draw()")
            if mode=='software':
                hit=m.evaluate('''()=>{const r=cartRenderer,c=r.canvas.getBoundingClientRect();for(let i=r.lastFaces.length-1;i>=0;i--){const f=r.lastFaces[i];if(!/^W[0-9]{3}$/.test(f.it.id))continue;const area=Math.abs((f.b[0]-f.a[0])*(f.c[1]-f.a[1])-(f.b[1]-f.a[1])*(f.c[0]-f.a[0]));if(area<2)continue;const x=(f.a[0]+f.b[0]+f.c[0])/3/r.dpr+c.left,y=(f.a[1]+f.b[1]+f.c[1])/3/r.dpr+c.top;if(y<100||y>c.bottom-90||x>c.right-390)continue;let id=r.pick(x,y);if(/^W[0-9]{3}$/.test(id))return {x,y,id}}return null}''')
                check('CPU 3D wire hit-test finds a conductor',bool(hit),hit)
                if hit:
                    m.mouse.click(hit['x'],hit['y']);check('Actual 3D conductor click opens matching description',m.evaluate('cartApp.selected')==hit['id'])
            m.evaluate("cartApp.select('');cartApp.home();cartRenderer.draw()");m.screenshot(path=str(ROOT/'assets/previews/3d-desktop.png'))
            m.evaluate("Object.assign(cartRenderer.state,{yaw:.04,pitch:.14,distance:1.64,target:[0,.40,.16]});cartRenderer.draw()");m.screenshot(path=str(ROOT/'assets/previews/3d-front-detail.png'))
            m.evaluate("cartApp.select('SVL',true);cartRenderer.draw()");m.screenshot(path=str(ROOT/'assets/previews/3d-servo-selected.png'));m.close()
            for query,expect in [('part=SVL','SVL'),('wire=W246','W246'),('part=does-not-exist','')]:
                z=load('index.html',query);check('3D deep link: '+query,z.evaluate('cartApp.selected')==expect);z.close()
            for size,name in [((768,1024),'tablet'),((390,844),'mobile'),((320,740),'small-mobile')]:
                for page_name in ['wiring.html','index.html']:
                    z=load(page_name,size=size);check(f'{name}/{page_name}: no page horizontal overflow',z.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
                    if page_name=='index.html':
                        z.evaluate("cartApp.select('SVL')");bnd=z.locator('#part-panel').bounding_box();check(f'{name}/3D: selection panel inside viewport',bnd['x']>=0 and bnd['x']+bnd['width']<=size[0]+1 and bnd['y']>=0 and bnd['y']+bnd['height']<=size[1]+1,bnd)
                        z.evaluate("cartApp.select('');cartRenderer.draw()")
                        if name=='mobile':
                            dist=z.evaluate('cartRenderer.state.distance');session=ctx.new_cdp_session(z)
                            session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':150,'y':350,'id':1},{'x':220,'y':350,'id':2}]})
                            session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':125,'y':350,'id':1},{'x':245,'y':350,'id':2}]})
                            session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});z.wait_for_timeout(150)
                            check('Mobile 3D two-finger pinch zoom',z.evaluate('cartRenderer.state.distance')<dist)
                            z.evaluate('cartApp.home();cartRenderer.draw()')
                        z.screenshot(path=str(ROOT/'assets/previews'/('3d-'+name+'.png')))
                    else:
                        z.locator('[data-mode=schematic]').click();z.locator('[data-sheet=pwm]').click();check(f'{name}/wiring: touch-sized mode and sheet controls work',z.evaluate("wiringApp.mode==='schematic'&&wiringApp.sheet==='pwm'"));z.evaluate("wiringApp.setMode('physical');wiringApp.setSheet('power')");z.screenshot(path=str(ROOT/'assets/previews'/('wiring-'+name+'.png')))
                    z.close()
            check('No uncaught JavaScript errors across regression',not ERRORS,ERRORS)
            if mode=='software':
                RESULTS.append({'name':'Native WebGL 2 rendering path','status':'NOT_RUN','detail':'Chromium returned null for WebGL2 in this execution environment; real Canvas 2D fallback tested.'})
            if FIXTURE:
                for name in ['Native HTTP/file navigation in browser','Native localStorage persistence','Native browser file download']:
                    RESULTS.append({'name':name,'status':'NOT_RUN','detail':'Managed browser blocks navigation. Fixtures use unchanged shipped scripts, embedded local assets, storage/export boundary adapters. See independent HTTP/package checks.'})
        except Exception as exc:
            check('Unexpected regression runner exception',False,str(exc));traceback.print_exc()
        finally:
            ctx.close();browser.close()
    if server:server.shutdown()
    report={'fixture':FIXTURE,'browser':'Chromium via Playwright','seconds':round(time.time()-started,2),'scope':'Actual browser DOM/canvas interaction of shipped scripts. Fixture boundary adapters are not native hosting/storage/download certification. No physical hardware tests.','checks':RESULTS,'uncaughtErrors':ERRORS,'console':CONSOLES}
    (ROOT/'docs/browser-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');summary={s:sum(x['status']==s for x in RESULTS) for s in set(x['status'] for x in RESULTS)};print('SUMMARY',summary);return any(x['status']=='FAIL' for x in RESULTS)
if __name__=='__main__':raise SystemExit(main())
