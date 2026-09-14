/* Minimal interaction only: orbit/zoom/pan and part/conductor inspection. */
'use strict';

function componentEvidence(c,esc){return (c.photo?`<figure class="part-photo"><img src="${esc(c.photo)}" alt="첨부 자료의 ${esc(c.name)}" loading="lazy"><figcaption>첨부 자료 / 실제 납품품과 대조</figcaption></figure>`:'')+(c.specs?`<table class="evidence-table"><tbody>${c.specs.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>`:'')+(c.ncPorts?`<p class="part-note"><strong>미접속 / 확인 필요</strong><br>${esc(Array.isArray(c.ncPorts)?c.ncPorts.join(' · '):JSON.stringify(c.ncPorts))}</p>`:'');}

(()=>{
 const D=CartDesign,$=q=>document.querySelector(q),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const parts=Object.fromEntries(D.components.map(c=>[c.id,c])),wires=Object.fromEntries(D.connections.map(w=>[w.id,w]));
 const kinds={power:'구동 전력',motor:'H브리지 모터 출력',return:'0V 귀환',logic:'저전압 전원',signal:'제어 신호',usb:'완성 USB / 센서 하네스',safety:'하드웨어 안전정지',charge:'충전 포트',steerpower:'서보 12V 전원'};
 const colors={power:'#cb4937',motor:'#b48a29',return:'#252d32',logic:'#328b6c',signal:'#4382bd',usb:'#6c6a81',safety:'#bda136',charge:'#9c557e',steerpower:'#cf6037'};
 const mechanical={
  FRAME:['차체 프레임 · 가드 레일','각형 프레임과 전면 범퍼. LiDAR는 전면 상단 레일에 직접 장착하며 높은 마스트는 없습니다. 원본 모델 비율을 참고한 배치 재구성으로, 실제 단면·용접·하중 정격을 확정하지 않습니다.'],
  DECK:['적재판 · 미끄럼 방지면','전장 배치를 확인할 수 있는 정비 상태로 표현했습니다. 실제 적재공간과 전장 방수 하우징, 열 배출, 허용 하중은 별도로 설계해야 합니다.'],
  HANDLE:['접이식 손잡이','힌지 브래킷과 고무 그립. 손잡이의 비상정지/리셋 배선은 접힘 구간을 따라 장력 완화와 서비스 루프를 확보해야 합니다.'],
  TRAY:['전장 서비스 트레이','동력·안전전원·제어전원·서보 인터페이스가 보이도록 커버를 제거한 상태입니다. 실차에서는 절연 커버, 냉각, 방수/방진, 케이블 고정이 필요합니다. 전선 경로는 절단 길이·규격의 확정값이 아닙니다.'],
  COVER:['전장 커버','정비 설명용 외형입니다. 투명 커버 재질·충격·방수 등급은 검증하지 않았습니다.'],
  LIDAR_MOUNT:['전면 상단 LiDAR 브래킷','전면 상단 레일을 잡는 짧은 클램프와 장착판. C1 스캔 중심 약 '+D.spatial.lidarScanHeightM.toFixed(3)+'m 배치 제안. 43×43mm M2.5 4홀은 첨부 사양 반영, 본체 나사 진입 최대 4mm. 판두께·클램프·적재물 가림은 별도 검증 대상입니다.'],
  CLAMPS:['하네스 고정 · 장력 완화','케이블 클램프·보호 지지대. 조향 링크·타이어·날카로운 프레임 모서리와 간섭하지 않도록 지지합니다. 그려진 선 간격만으로 EMC나 최소 굽힘 반경을 승인하지 않습니다.']
 };
 for(const side of ['L','R']){mechanical['WHEEL_'+side]=[side+' 후륜 구동 휠','금속 허브, 축, 고무 타이어와 트레드. 후륜 속도는 전륜 조향각과 같은 회전중심을 형성하도록 협조해야 합니다. 자유 캐스터를 전제한 제자리 차동 회전은 사용하지 않습니다.'];mechanical['CASTER_'+side]=[side+' 전륜 킹핀 · 베어링 · 휠','기존 자유 캐스터를 조향 제어 휠로 바꾼 배치입니다. 타이어 → 축 → 포크 → 별도 킹핀 베어링 → 차체로 하중이 전달되도록 구성했습니다. 서보 축은 차중을 직접 지지하지 않습니다. 베어링 정격·트레일·조향 끝점·강도는 실측 설계 대상입니다.'];mechanical['LINK_'+side]=[side+' 서보 혼 · 조향 링크','서보 혼과 킹핀 조향암 사이의 조정식 링크·볼조인트. 두 서보를 같은 PWM 값으로 고정하는 방식이 아닌, 좌우 링크의 중심·방향·전륜 조향각을 각각 교정해야 합니다. 표시된 직진 각도는 정적 조립 위치이며 동작 시뮬레이션이 아닙니다.'];}
 let renderer,builder,selected='';
 function home(){Object.assign(renderer.state,{yaw:.68,pitch:.30,distance:innerWidth<600?3.55:2.78,target:[0,.525,-.005],grid:false,labels:false,rotate:false,scan:false,cover:false,explode:0,wires:true});renderer.invalid=true;}
 function inspect(id,focus=false){
  if(!parts[id]&&!wires[id]&&!mechanical[id])id='';selected=id;const panel=$('#part-panel');panel.hidden=!id;document.body.classList.toggle('has-selection',!!id);
  if(renderer){renderer.state.selection=wires[id]?'':id;renderer.state.route=wires[id]?id:'';renderer.invalid=true;}
  if(!id){$('#part-content').innerHTML='';return;}
  let html='';const c=parts[id],w=wires[id];
  if(w){html=`<div class="part-kind">CONDUCTOR / HARNESS</div><div class="part-ref">${esc(w.id)}</div><h1>${esc(w.net)}</h1><div class="wire-kind"><i style="--wire-color:${colors[w.kind]}"></i>${esc(kinds[w.kind])}</div><div class="endpoint"><small>FROM / 출발 단자</small><button data-part="${esc(w.from.split(':')[0])}">${esc(w.from)}</button></div><div class="endpoint"><small>TO / 도착 단자</small><button data-part="${esc(w.to.split(':')[0])}">${esc(w.to)}</button></div><p class="part-description">${esc(w.note||'부품 실크와 결선표의 포트 이름을 대조해 연결합니다.')}</p><div class="part-note">선 규격: ${esc(w.gauge)}<br>선색·렌더링 굵기는 식별용입니다. USB/센서 케이블은 내부 여러 도체를 하나의 경로로 표시할 수 있습니다.</div>`;
  }else if(c){html=`<div class="part-kind">COMPONENT / ${esc(c.group.toUpperCase())}</div><div class="part-ref">${esc(c.id)}</div><h1>${esc(c.name)}</h1><p class="part-sub">${esc(c.subtitle)}</p><p class="part-description">${esc(c.notes)}</p><div class="part-note">${esc(c.terminalBasis)}${c.status==='hold'?'<br>실모델·정격·시험 미확정 / 통전 보류':''}</div><details><summary>단자 및 연결 ${Object.keys(c.ports).length}개</summary><table class="pin-table"><tbody>${Object.entries(c.ports).map(([p,n])=>`<tr><td>${esc(p)}</td><td>${esc(n)}</td></tr>`).join('')}</tbody></table></details>`;
   html+=componentEvidence(c,esc);
   const related=D.connections.filter(w=>w.from.startsWith(id+':')||w.to.startsWith(id+':'));html+=`<details><summary>관련 전선 ${related.length}개</summary><div class="related">${related.map(w=>`<button data-part="${w.id}">${w.id} · ${esc(w.from)} → ${esc(w.to)}</button>`).join('')}</div></details>`;
  }else {const m=mechanical[id];html=`<div class="part-kind">MECHANICAL ASSEMBLY</div><div class="part-ref">${esc(id)}</div><h1>${esc(m[0])}</h1><p class="part-description">${esc(m[1])}</p><div class="part-note">실측 CAD · 제작 승인도 아님</div>`;}
  $('#part-content').innerHTML=html;panel.scrollTop=0;panel.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>inspect(b.dataset.part));
  if(focus&&renderer){let q=c?.position;if(w){const ps=builder.routePoints[id];q=ps[Math.floor(ps.length/2)]}if(q){renderer.state.target=q.slice();renderer.state.distance=innerWidth<600?1.4:.93;renderer.state.yaw=.56;renderer.state.pitch=c?.kind==='servo'?.10:.42;renderer.invalid=true;}}
 }
 $('#close-panel').onclick=()=>inspect('');
 try{
  builder=buildSmartCart();window.cartBuilder=builder;
  try{renderer=new CartGL.Renderer($('#cart-canvas'),builder)}catch(error){const old=$('#cart-canvas'),canvas=old.cloneNode();old.replaceWith(canvas);renderer=new CartCPU.Renderer(canvas,builder);$('#render-note').hidden=false;$('#render-note').textContent='그래픽 가속 미지원: 간소화 3D 렌더링';console.warn('Interactive software fallback: '+error.message)}
  window.cartRenderer=renderer;home();renderer.onpick=id=>inspect(id);renderer.onlost=()=>{$('#model-error').hidden=false;$('#model-error').textContent='그래픽 컨텍스트가 중단되었습니다. 새로고침하고 브라우저 그래픽 가속을 확인해 주세요.'};
  renderer.draw();$('#model-loading').hidden=true;
  const canvas=$('#cart-canvas');canvas.addEventListener('keydown',e=>{const s=renderer.state;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home','Escape'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')s.yaw+=.12;if(e.key==='ArrowRight')s.yaw-=.12;if(e.key==='ArrowUp')s.pitch=Math.min(1.45,s.pitch+.09);if(e.key==='ArrowDown')s.pitch=Math.max(-1.25,s.pitch-.09);if(e.key==='+'||e.key==='=')s.distance=Math.max(.3,s.distance*.9);if(e.key==='-')s.distance=Math.min(6,s.distance*1.1);if(e.key==='Home')home();if(e.key==='Escape')inspect('');renderer.invalid=true;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')inspect('')});
  const params=new URLSearchParams(location.search);if(params.has('part')||params.has('wire'))inspect(params.get('part')||params.get('wire'),true);
  window.cartApp={select:inspect,home,get selected(){return selected},mode:renderer.software?'software':'webgl2'};
 }catch(error){console.error(error);$('#model-loading').hidden=true;$('#model-error').hidden=false;$('#model-error').innerHTML=`<strong>3D 초기화 오류</strong><p>${esc(error.message)}</p><a href="./wiring.html">배선도 열기</a>`;}
})();
