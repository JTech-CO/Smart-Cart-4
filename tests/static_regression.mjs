/* Dependency-free structural regression. Run: node tests/static_regression.mjs */
import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),results=[];
const check=(name,ok,detail=null)=>{results.push({name,status:ok?'PASS':'FAIL',detail});};
for(const f of fs.readdirSync(path.join(root,'js')).filter(n=>n.endsWith('.js'))){const r=spawnSync(process.execPath,['--check',path.join(root,'js',f)],{encoding:'utf8'});check('JavaScript syntax: '+f,r.status===0,r.stderr||null);}
const ctx={console,window:{},document:{querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}},URL,Blob,setTimeout,clearTimeout};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['design-data','engine','cart-model','common','schematic','pictorial'])vm.runInContext(fs.readFileSync(path.join(root,'js',f+'.js'),'utf8'),ctx,{filename:f});
const D=ctx.CartDesign,canonical=JSON.parse(fs.readFileSync(path.join(root,'data/design.json'),'utf8')),by=Object.fromEntries(D.components.map(c=>[c.id,c])),ids=new Set(D.components.map(c=>c.id));
check('JSON / JS data mirror',JSON.stringify(D)===JSON.stringify(canonical));
const topology=d=>({components:d.components.map(c=>Object.fromEntries(['id','kind','position','ports'].map(k=>[k,c[k]]))),connections:d.connections.map(w=>Object.fromEntries(['id','from','to','net','kind','sheet','gauge','status'].map(k=>[k,w[k]])))});
check('D4.1 preserves the input D4 electrical graph and part placements',JSON.stringify(topology(D))===JSON.stringify(JSON.parse(fs.readFileSync(path.join(root,'data/input-d4-topology.json'),'utf8'))));
check('D4.1 package / D4 design revision',D.revision==='D4'&&D.packageVersion==='D4.1');
check('Component inventory 108 unique IDs',D.components.length===108&&ids.size===108);
check('Connection inventory 246 unique IDs',D.connections.length===246&&new Set(D.connections.map(w=>w.id)).size===246);
check('11 HOLD gates and 11 manual checklist entries',D.gates.length===11&&D.checks.length===11&&D.release==='ENGINEERING HOLD');
let missing=[],mismatch=[],self=[],unreferenced=[],nonfinite=[];const used=new Set();
for(const c of D.components){if(c.position.length!==3||c.position.some(x=>!Number.isFinite(x)))nonfinite.push(c.id);for(const k of ['name','kind','group','ports','source','status','terminalBasis'])if(c[k]===undefined)missing.push(c.id+'.'+k);}
for(const w of D.connections){if(w.from===w.to)self.push(w.id);for(const ep of [w.from,w.to]){used.add(ep);const ix=ep.indexOf(':'),c=by[ep.slice(0,ix)],p=ep.slice(ix+1);if(!c||!Object.hasOwn(c.ports,p))missing.push(w.id+':'+ep);else if(c.ports[p]!==w.net)mismatch.push(w.id+':'+ep);}}
for(const c of D.components)for(const p of Object.keys(c.ports))if(!used.has(c.id+':'+p)&&!c.sparePorts?.includes(p))unreferenced.push(c.id+':'+p);
check('Required component fields and all connection endpoints exist',!missing.length,missing);
check('Both endpoints match declared NET on all connections',!mismatch.length,mismatch);
check('No self-connection wires',!self.length,self);check('Finite component placements',!nonfinite.length,nonfinite);
check('Every terminal is connected or explicitly marked spare',!unreferenced.length,unreferenced);
check('JDRV remains an open separation with distinct nets',by.JDRV.status==='hold'&&by.JDRV.ports.IN!==by.JDRV.ports.OUT&&!D.connections.some(w=>[w.from,w.to].every(e=>e.startsWith('JDRV:'))));
check('IBT-2 PWM and enable ports replace old UART', ['MDL','MDR'].every(id=>['RPWM','LPWM','R_EN','L_EN','VCC','GND','B+','B-','M+','M-'].every(p=>p in by[id].ports)&&!('RX' in by[id].ports)&&!('TX' in by[id].ports)));
check('No motor output connected to 0V', ['MDL','MDR'].every(id=>by[id].ports['M+']!=='0V'&&by[id].ports['M-']!=='0V'));
check('Unverified ESP32 GND/CMD and flash pins remain unconnected',Object.keys(by.U1.ports).every(p=>!/^GPIO(6|7|8|9|10|11)$|^J[23]\./.test(p))&&'GND_VERIFIED' in by.U1.ports&&!by.U1.terminalBasis.startsWith('Espressif V4 J2'));
check('ESP32 USB single supply / no 5V header lead',!D.connections.some(w=>[w.from,w.to].includes('U1:5V_HEADER')));
check('BU03 tag remains cable-free',Object.keys(by.TAG.ports).length===0&&!D.connections.some(w=>[w.from,w.to].some(e=>e.startsWith('TAG:'))));
check('Two separately named servo rails',by.SVL.ports['V+']==='SVL_12'&&by.SVR.ports['V+']==='SVR_12'&&by.SVL.ports['PWM']!==by.SVR.ports['PWM']);
check('3.3V to 5V motor buffers retain all 14 functional pins',['U3','U4'].every(id=>Object.keys(by[id].ports).length===14&&by[id].ports['14_VCC']==='5V_MOTOR_IO'&&[1,4,10,13].every(n=>by[id].ports[n+'_OE']==='MOTOR_OE_N')));
const B=ctx.buildSmartCart();const counts={components:ids.size,connections:D.connections.length,ports:Object.keys(B.ports).length,drawBatches:B.items.length,triangles:B.items.reduce((n,i)=>n+i.vertices.length/18,0),primitives:B.primitives.length,cadPrimitives:B.primitives.filter(p=>p.method!=='decal'&&p.args[3]!=='FLOOR').length};
check('3D build succeeds / 379 ports',Object.keys(B.ports).length===379,counts);
check('All 108 component IDs render geometry',D.components.every(c=>B.items.some(i=>i.id===c.id)));
check('All 246 wires render geometry and hold route IDs',D.connections.every(w=>B.items.some(i=>i.id===w.id&&i.layer==='wire')&&B.routePoints[w.id]));
check('All vertex arrays finite and whole triangles',B.items.every(i=>i.vertices.length>0&&i.vertices.length%18===0&&i.vertices.every(Number.isFinite)));
check('Wire route endpoints equal registered 3D ports',D.connections.every(w=>JSON.stringify(B.routePoints[w.id][0])===JSON.stringify(B.ports[w.from])&&JSON.stringify(B.routePoints[w.id].at(-1))===JSON.stringify(B.ports[w.to])));
check('Wire routes finite / radius positive',D.connections.every(w=>B.routePoints[w.id].every(p=>p.length===3&&p.every(Number.isFinite))&&B.routeRadii[w.id]>0));
check('LiDAR lowered to front rail / no mast',B.metadata.hasMast===false&&B.metadata.lidarMount==='front-upper-rail'&&B.metadata.scanHeight===D.spatial.lidarScanHeightM&&!B.items.some(i=>i.id==='MAST'));
check('Both ToF optical axes point forward',JSON.stringify(B.metadata.tofAxes)==='[[0,0,1],[0,0,1]]');
check('Two front servo assemblies and independent links exist',['SVL','SVR','LINK_L','LINK_R'].every(id=>B.items.some(i=>i.id===id)));
const sheets=[];const drawDir=path.join(root,'assets/drawings');fs.mkdirSync(drawDir,{recursive:true});
for(const mode of ['CartSchematic','CartPictorial']){const S=ctx[mode],coverage=new Set(),portsMissing=[],pathsMismatch=[],out=[];let svgOK=true;
 for(const key of Object.keys(S.defs)){const s=S.build(key),markup=S.svg(key);if(/\bNaN\b|\bundefined\b/.test(markup))svgOK=false;
 for(const w of s.wires){coverage.add(w.id);const a=s.pins[w.from],b=s.pins[w.to],p=s.paths[w.id];if(!a||!b||!p)portsMissing.push(key+':'+w.id);else if(Math.hypot(p[0][0]-a.x,p[0][1]-a.y)>1e-8||Math.hypot(p.at(-1)[0]-b.x,p.at(-1)[1]-b.y)>1e-8)pathsMismatch.push(key+':'+w.id);}
 for(const n of s.nodes)if(n.x<0||n.y<0||n.x+n.w>s.width||n.y+n.h>s.height)out.push(key+':'+n.id);
 sheets.push({mode,key,nodes:s.nodes.length,wires:s.wires.length});fs.writeFileSync(path.join(drawDir,'D4-'+(mode==='CartSchematic'?'schematic':'physical')+'-'+key+'.svg'),markup);
 }
 check(mode+': all 14 sheets generate',Object.keys(S.defs).length===14);
 check(mode+': complete 246-wire coverage',coverage.size===246&&D.connections.every(w=>coverage.has(w.id)));
 check(mode+': paths match drawing ports',!portsMissing.length&&!pathsMismatch.length,{portsMissing,pathsMismatch});
 check(mode+': no nodes outside sheet bounds',!out.length,out);
 check(mode+': SVG has no NaN/undefined',svgOK);
 check(mode+': every deep-linked component and wire resolves a valid sheet',D.components.concat(D.connections).every(x=>S.defs[S.findSheet(x.id)]));
}
const assets=D.components.filter(c=>c.photo).map(c=>c.photo).concat(D.sources.filter(s=>s.url.startsWith('./')).map(s=>s.url));
check('All local source/photo assets exist',assets.every(p=>fs.existsSync(path.join(root,p))),assets.filter(p=>!fs.existsSync(path.join(root,p))));
for(const page of ['index.html','wiring.html']){const h=fs.readFileSync(path.join(root,page),'utf8'),refs=[...h.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(p=>p.startsWith('./'));check(page+': relative local dependency files exist',refs.every(p=>fs.existsSync(path.join(root,p.split('?')[0]))),refs.filter(p=>!fs.existsSync(path.join(root,p.split('?')[0]))));check(page+': no CDN scripts/styles',!/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(h));}
const report={scope:'Structural source/NET/geometry/SVG and asset regression, not hardware ERC or safety certification.',counts,sheets,checks:results};fs.writeFileSync(path.join(root,'docs/static-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(results.map(x=>x.status+' '+x.name).join('\n'));console.log('SUMMARY',results.reduce((r,x)=>(r[x.status]=(r[x.status]||0)+1,r),{}));process.exitCode=results.some(x=>x.status==='FAIL')?1:0;
