/* D3 spatial reconstruction of JTech-CO/Smart-Cart (2b4b8fe).
 * Metres; Y up, +Z front. Product envelopes and connector positions are illustrative,
 * NOT manufacturer CAD or a drilling / fabrication drawing. */
'use strict';
window.buildSmartCart = function(){
 const {Builder,material:mat,V}=CartGL,B=new Builder(),PI=Math.PI;
 const p={paint:mat('#343d40',.18,.37),edge:mat('#1b2528',.12,.39),steel:mat('#94a3ab',.85,.27),chrome:mat('#d3e1e5',.95,.19),rubber:mat('#161d21',.04,.85),tread:mat('#293438',.04,.8),orange:mat('#dd652d',.28,.34),pcb:mat('#267763',.18,.54),gold:mat('#cab779',.85,.29),black:mat('#11191f',.05,.6),glass:mat('#273e44',.45,.18),red:mat('#e0524f',.12,.4),teal:mat('#57dbc2',.1,.3,1,.32),yellow:mat('#e5bc4a',.2,.45),white:mat('#dfe7e5',.12,.55)};
 const XR=[0,0,PI/2],ZR=[PI/2,0,0];
 function bolt(q,id='FRAME',r=.003,axis='y') {let rot=axis==='x'?XR:axis==='z'?ZR:[0,0,0];B.cyl(r,.003,q,p.chrome,id,rot,6);q=q.slice();q['xyz'.indexOf(axis)]+=.0018;B.cyl(r*.42,.0004,q,p.black,id,rot,6)}
 function plate(size,pos,id='FRAME',m=p.paint){B.box(size,pos,m,id,.002);for(let a of [-1,1])for(let b of [-1,1])bolt([pos[0]+a*(size[0]/2-.008),pos[1]+size[1]/2+.001,pos[2]+b*(size[2]/2-.008)],id,.0025)}
 // Original visual frame proportions retained: 0.67 x 0.98 m, 0.805 m top guard.
 for(let s of [-1,1]) {plate([.038,.052,.982],[s*.321,.281,0]);B.box([.003,.007,.83],[s*.342,.281,0],p.orange,'FRAME',.0006);for(let z=-.4;z<.42;z+=.1)bolt([s*.343,.293,z],'FRAME',.003,'x')}
 for(let z of [-.475,.475])plate([.67,.052,.04],[0,.281,z]);
 for(let z of [-.33,-.04,.3])B.box([.612,.025,.032],[0,.246,z],p.steel,'FRAME',.002);
 for(let s of [-1,1])for(let z of [-.444,.444]){plate([.062,.022,.07],[s*.313,.319,z]);B.box([.025,.493,.025],[s*.313,.557,z],p.paint,'FRAME',.002);B.box([.031,.012,.031],[s*.313,.810,z],p.orange,'FRAME',.003);bolt([s*.313,.818,z]);}
 for(let s of [-1,1]){for(let y of [.545,.805])B.box([.026,.026,.914],[s*.313,y,0],p.paint,'FRAME',.002);B.box([.02,.476,.02],[s*.313,.555,-.008],p.paint,'FRAME',.002);B.rod([s*.313,.337,-.425],[s*.313,.785,-.16],.010,p.paint,'FRAME',8);}
 for(let y of [.545,.805])B.box([.642,.024,.024],[0,y,.445],p.paint,'FRAME',.002);
 for(let x of [-.16,.16])B.box([.018,.46,.018],[x,.561,.445],p.paint,'FRAME',.002);
 B.box([.17,.064,.006],[0,.68,.461],p.edge,'FRAME',.003);for(let x of [-.055,-.035,-.015,.025,.045])B.box([.012,.027,.001],[x,.68,.465],p.orange,'FRAME',.0006);
 B.box([.602,.014,.901],[0,.307,0],p.steel,'DECK',.003);B.box([.562,.004,.849],[0,.317,0],p.rubber,'DECK',.004);
 for(let z=-.4;z<=.41;z+=.022)B.box([.55,.0014,.0016],[0,.320,z],p.tread,'DECK');
 B.box([.734,.045,.044],[0,.282,.506],p.rubber,'FRAME',.006);for(let s of [-1,1])B.box([.06,.01,.003],[s*.287,.288,.530],p.orange,'FRAME',.001);
 // Folding handle and visibly separate E-stop / reset stations.
 for(let s of [-1,1]){plate([.058,.028,.06],[s*.247,.34,-.418],'HANDLE');B.cyl(.018,.054,[s*.247,.359,-.442],p.steel,'HANDLE',XR,20);B.cyl(.007,.06,[s*.247,.359,-.442],p.orange,'HANDLE',XR,6);B.tube([[s*.24,.36,-.439],[s*.24,.888,-.606],[s*.235,.958,-.627],[s*.21,.983,-.634]],.012,p.chrome,'HANDLE',16,'hardware');}
 B.rod([-.21,.983,-.634],[.21,.983,-.634],.015,p.chrome,'HANDLE',24);B.rod([-.126,.983,-.634],[.126,.983,-.634],.022,p.rubber,'HANDLE',24);for(let x=-.12;x<.121;x+=.014)B.cyl(.0226,.002,[x,.983,-.634],p.tread,'HANDLE',XR,20);
 // Rear drive wheels, hubs, tread, independent reduction gearboxes.
 for(let [s,id,mid] of [[-1,'WHEEL_L','ML'],[1,'WHEEL_R','MR']]){const x=s*.381,y=.131,z=-.379;
  B.lathe([[.075,-.041],[.095,-.041],[.114,-.037],[.123,-.028],[.129,-.014],[.129,.014],[.123,.028],[.114,.037],[.095,.041],[.075,.041]],[x,y,z],p.rubber,id,XR,88);
  for(let a of [-1,1]){B.cyl(.078,.008,[x+a*.04,y,z],p.steel,id,XR,48);B.ring(.070,.004,[x+a*.045,y,z],p.chrome,id,XR,48,8);B.cyl(.029,.024,[x+a*.05,y,z],p.edge,id,XR,24);B.cyl(.011,.028,[x+a*.053,y,z],p.orange,id,XR,6);for(let j=0;j<6;j++){let t=j*PI/3;B.cyl(.012,.001,[x+a*.045,y+.052*Math.cos(t),z+.052*Math.sin(t)],p.black,id,XR,14);bolt([x+a*.046,y+.038*Math.cos(t),z+.038*Math.sin(t)],id,.0033,'x')}}
  for(let j=0;j<48;j++)for(let a of [-1,1]){let t=j/48*PI*2;B.box([.030,.004,.011],[x+a*.018,y+.127*Math.cos(t),z+.127*Math.sin(t)],p.tread,id,.0006,[t,a*.27,0]);}
  plate([.10,.009,.085],[s*.34,.268,-.379],id);B.box([.066,.087,.087],[s*.272,.166,-.376],p.paint,mid,.005);B.cyl(.012,.10,[s*.32,.131,-.379],p.chrome,mid,XR,24);
  B.cyl(.038,.162,[s*.251,.171,-.255],p.steel,mid,ZR,40);for(let j=0;j<8;j++)B.cyl(.040,.0025,[s*.251,.171,-.304+j*.013],p.edge,mid,ZR,32);B.cyl(.040,.022,[s*.251,.171,-.174],p.black,mid,ZR,32);plate([.079,.011,.183],[s*.251,.222,-.26],mid);B.box([.039,.001,.034],[s*.251,.211,-.251],p.orange,mid,.001);
 }
 // D3 front steering: wheel loads pass into a bearing-supported kingpin, not a servo shaft.
 for(let s of [-1,1]){
  const side=s<0?'L':'R',id='CASTER_'+side,sv='SV'+side,link='LINK_'+side,x=s*.258,z=.364,sx=s*.319;
  plate([.100,.008,.110],[x,.257,z],id,p.steel);
  B.cyl(.034,.018,[x,.244,z],p.steel,id,[0,0,0],48);B.ring(.029,.0025,[x,.251,z],p.chrome,id);
  B.cyl(.023,.027,[x,.220,z],p.edge,id,[0,0,0],40);B.cyl(.015,.05,[x,.210,z],p.chrome,id);
  B.ring(.023,.002,[x,.209,z],p.chrome,id);B.cyl(.031,.008,[x,.196,z],p.steel,id);
  for(let a of [-1,1]){B.box([.009,.110,.036],[x+a*.033,.129,z+.02],p.steel,id,.003,[.19,0,0]);bolt([x+a*.042,.067,z+.025],id,.007,'x');}
  B.box([.075,.010,.040],[x,.190,z+.002],p.steel,id,.003);
  B.lathe([[.026,-.027],[.048,-.027],[.060,-.020],[.066,-.010],[.066,.010],[.060,.020],[.048,.027],[.026,.027]],[x,.067,z+.025],p.rubber,id,XR,64);
  B.cyl(.028,.054,[x,.067,z+.025],p.steel,id,XR,48);B.cyl(.007,.098,[x,.067,z+.025],p.chrome,id,XR,20);
  for(const a of [-1,1]){B.ring(.045,.0015,[x+a*.027,.067,z+.025],p.tread,id,XR,48);for(let j=0;j<5;j++){let t=j*PI*.4;B.cyl(.005,.003,[x+a*.029,.067+Math.cos(t)*.018,z+.025+Math.sin(t)*.018],p.edge,id,XR,12)}}
  // Large-format servo, 30 x 48 x 65 mm envelope, bolted under the side rail.
  plate([.059,.006,.093],[sx,.250,.288],sv,p.steel);
  B.box([.038,.050,.008],[sx,.221,.250],p.steel,sv,.0015);
  B.box([.030,.039,.065],[sx,.197,.288],p.edge,sv,.003);
  B.box([.031,.010,.065],[sx,.220,.288],p.orange,sv,.002);
  B.box([.031,.006,.065],[sx,.176,.288],p.edge,sv,.002);
  for(const dx of [-.011,.011])for(const dz of [-.027,.027]){bolt([sx+dx,.227,.288+dz],sv,.0025);B.cyl(.002,.044,[sx+dx,.198,.288+dz],p.chrome,sv,[0,0,0],10);}
  for(let k=0;k<8;k++)B.box([.0008,.002,.051],[sx+s*.0158,.185+k*.0038,.288],p.steel,sv,.0002);
  B.decal('STEER '+side,'12V CLASS / VERIFY MODEL',[.050,.022],[sx+s*.0167,.201,.286],[0,s*PI/2,0],sv,{bg:'#262a2a'});
  // Servo output horn, pushrod with spherical rod ends, kingpin steering arm and stops.
  B.cyl(.009,.010,[sx,.235,.310],p.gold,sv,[0,0,0],24);
  B.rod([sx,.239,.310],[sx-s*.010,.239,.347],.0058,p.chrome,link,16);
  B.ring(.010,.002,[sx,.239,.310],p.chrome,link);bolt([sx,.243,.310],link,.003);
  B.rod([x,.233,z],[x,.233,z-.039],.008,p.steel,link,16);bolt([x,.240,z],link,.004);
  const a=[sx-s*.010,.239,.347],b=[x,.233,.325];B.rod(a,b,.0032,p.chrome,link,16);
  for(const t of [a,b]){B.sphere(.006,t,p.steel,link,20,12);B.cyl(.0027,.017,t,p.gold,link,[0,0,0],12);bolt([t[0],t[1]+.010,t[2]],link,.003);}
  B.rod(a.map((v,i)=>v*.66+b[i]*.34),a.map((v,i)=>v*.34+b[i]*.66),.0047,p.edge,link,6);
  for(let a of [-1,1]){B.box([.011,.015,.014],[x+a*.030,.233,z-.009],p.orange,id,.001);bolt([x+a*.030,.243,z-.009],id,.0025);}
 }
 // Battery envelope is deliberately not claimed to fit an unverified 108 Ah pack.
 B.box([.292,.124,.294],[0,.178,-.093],p.edge,'BT1',.006);plate([.303,.01,.304],[0,.246,-.093],'BT1');B.box([.2,.052,.002],[0,.182,.055],p.orange,'BT1',.002);for(let x of [-.108,.108]){B.box([.019,.13,.3],[x,.18,-.093],p.rubber,'BT1',.003);B.box([.023,.01,.313],[x,.109,-.093],p.steel,'BT1',.001)}
 B.decal('BATTERY / BT1','24V CLASS - PACK ENVELOPE TBD',[.180,.042],[0,.185,.0565],[0,0,0],'BT1',{bg:'#d96932',ink:'#182126'});
 for(const side of [-1,1])B.decal('24V / 250W','BRUSHED GEARMOTOR',[.082,.025],[side*.251,.211,-.245],[-PI/2,0,0],side<0?'ML':'MR');
 // Removable rear service tray. Raised on insulating standoffs; power left, logic right.
 plate([.572,.006,.764],[0,.333,-.046],'TRAY',p.steel);
 for(let x of [-.285,.285])B.box([.006,.043,.764],[x,.356,-.046],p.paint,'TRAY',.002);
 for(let z of [-.426,.333])B.box([.572,.041,.006],[0,.358,z],p.paint,'TRAY',.002);
 B.box([.006,.051,.43],[-.025,.36,-.214],p.orange,'TRAY',.001);
 for(let z of [-.35,-.185,.047])B.box([.50,.006,.013],[0,.339,z],p.chrome,'TRAY',.001);
 B.box([.587,.009,.779],[0,.449,-.046],mat('#739196',.18,.22,.36),'COVER',.005);
 for(let x of [-.28,.28])for(let z of [-.42,.13])bolt([x,.446,z],'COVER',.003);
 // Low-profile LiDAR mount, directly on the FRONT upper guard rail (no mast).
 for(let x of [-.038,.038]){
  B.box([.023,.034,.037],[x,.799,.445],p.steel,'LIDAR_MOUNT',.002);
  bolt([x,.798,.466],'LIDAR_MOUNT',.003,'z');
  B.box([.021,.006,.073],[x,.820,.471],p.steel,'LIDAR_MOUNT',.001);
 }
 plate([.113,.006,.087],[0,.824,.489],'LIDAR_MOUNT',p.edge);
 for(const x of [-.037,.037])B.cyl(.005,.009,[x,.832,.479],p.rubber,'LIDAR_MOUNT');
 B.cyl(.038,.016,[0,.839,.489],p.steel,'LD1',[0,0,0],72);
 B.cyl(.046,.024,[0,.855,.489],p.edge,'LD1',[0,0,0],88);
 B.cyl(.0445,.015,[0,.865,.489],p.glass,'LD1',[0,0,0],88);
 B.ring(.0445,.0012,[0,.871,.489],p.chrome,'LD1',[0,0,0],88,8);
 B.cyl(.046,.007,[0,.877,.489],p.edge,'LD1',[0,0,0],88);
 B.cyl(.033,.002,[0,.882,.489],p.paint,'LD1',[0,0,0],64);
 B.decal('RPLIDAR C1','LD1',[.052,.019],[0,.8835,.489],[-PI/2,0,0],'LD1');
 B.sphere(.0018,[.030,.854,.522],p.teal,'LD1');
 // Lens windows face +Z. No downward ranging cones remain.
 for(let s of [-1,1]){const id=s<0?'TOF1':'TOF2',x=s*.205,q=CartDesign.components.find(c=>c.id===id).position;
  B.box([.045,.005,.054],[x,.294,.528],p.steel,id,.002);
  B.box([.044,.032,.005],[x,.309,.528],p.steel,id,.002);
  B.box([.034,.026,.021],q,p.edge,id,.003);
  B.box([.024,.017,.0015],[x,.311,.5625],p.pcb,id,.001);
  B.box([.014,.009,.002],[x,.312,.564],p.black,id,.0005);
  for(const dx of [-.0038,.0038]){B.cyl(.0028,.001,[x+dx,.312,.5654],p.glass,id,ZR,24);B.ring(.0028,.0005,[x+dx,.312,.5657],p.chrome,id,ZR,24,6)}
  for(const dx of [-.015,.015])bolt([x+dx,.311,.564],id,.0018,'z');
  B.decal(s<0?'TOF L':'TOF R','FORWARD',[.026,.009],[x,.325,.550],[-PI/2,0,0],id);
 }
 // Vendor envelopes: illustrative PCB/connector shapes. Ports map to exact logical net IDs.
 const custom=new Set(['BT1','ML','MR','LD1','SVL','SVR','TOF1','TOF2']);
 const dimensions={fuse:[.025,.016,.04],contactor:[.052,.060,.049],suppressor:[.019,.012,.019],terminal:[.022,.013,.040],precharge:[.032,.015,.030],driver:[.056,.023,.039],clamp:[.040,.020,.022],resistor:[.011,.009,.027],capacitor:[.009,.013,.006],converter:[.066,.026,.071],safety:[.044,.082,.055],estop:[.042,.03,.038],button:[.034,.023,.030],protector:[.038,.016,.035],board:[.085,.018,.055],hub:[.08,.020,.042],isolator:[.020,.010,.029],adapter:[.03,.013,.031],uwb:[.052,.070,.032],tag:[.048,.07,.018],imu:[.026,.006,.020],mux:[.027,.006,.025],tof:[.03,.025,.030],servo:[.03,.048,.065],connector:[.018,.014,.020],switch:[.029,.038,.035],charge:[.026,.026,.025]};
 for(const c of CartDesign.components){const q=c.position,kind=c.kind,id=c.id;let d=(dimensions[kind]||[.03,.02,.03]).slice();if(id==='U1')d=[.028,.009,.052];if(id==='X3')d=[.03,.008,.04];if(id==='DC1')d=[.052,.023,.072];if(id==='DC3')d=[.072,.029,.075];if(id==='DC4')d=[.041,.019,.038];if(id==='X12')d=[.063,.014,.035];if(id==='U2')d=[.032,.012,.038];
  if(!custom.has(id)){
   if(['board','imu','mux','isolator','adapter','precharge','protector'].includes(kind)){
    B.box([d[0],.002,d[2]],q,p.pcb,id,.0007);B.box([d[0]*.40,.005,d[2]*.34],[q[0],q[1]+.004,q[2]],p.black,id,.0005);
    for(let a of [-1,1])for(let b of [-1,1]){B.cyl(.0017,.005,[q[0]+a*(d[0]/2-.003),q[1]-.002,q[2]+b*(d[2]/2-.003)],p.gold,id,[0,0,0],10)}
    if(id==='OP1'){for(let x of [-.022,-.014,-.006,.002,.010])B.box([.003,.009,.026],[q[0]+x,q[1]+.009,q[2]-.005],p.steel,id,.0004);for(let z of [-.014,.008])B.box([.017,.012,.014],[q[0]+.036,q[1]+.006,q[2]+z],p.chrome,id,.001)}
    if(id==='U1'){B.box([.019,.003,.022],[q[0],q[1]+.003,q[2]-.007],p.chrome,id,.001);B.decal('ESP32','U1',[.017,.014],[q[0],q[1]+.0052,q[2]-.007],[-PI/2,0,0],id,{bg:'#9aabab',ink:'#25302d'});}
    for(let j=0;j<8;j++){let x=q[0]-d[0]*.34+(j%4)*d[0]*.08,z=q[2]+d[2]*(j<4?.30:-.28);B.box([.002,.001,.0035],[x,q[1]+.0019,z],j%3===0?p.gold:p.black,id,.0001);}
    for(let side of [-1,1])for(let j=0;j<6;j++){let z=q[2]-d[2]*.36+j*d[2]*.12;B.box([.003,.001,.001],[q[0]+side*d[0]*.46,q[1]+.0016,z],p.gold,id,.0001);}
    if(id==='OP1'){B.decal('ORANGE PI','OP1',[.033,.012],[q[0]+.009,q[1]+.0022,q[2]+.020],[-PI/2,0,0],id,{bg:'#236856'});for(let j=0;j<5;j++)B.box([.015,.0005,.0008],[q[0],q[1]+.0016,q[2]-.020+j*.002],p.gold,id);}

   }else if(kind==='driver'||kind==='converter'){B.box([d[0],.003,d[2]],q,p.pcb,id,.001);B.box([d[0]*.72,d[1],d[2]*.65],[q[0],q[1]+d[1]/2,q[2]],p.edge,id,.002);for(let i=-3;i<=3;i++)B.box([.003,d[1]*.95,d[2]*.6],[q[0]+i*d[0]/10,q[1]+d[1],q[2]],p.steel,id,.0004);}
   else if(kind==='estop'){B.box(d,q,p.yellow,id,.004);B.cyl(.012,.021,[q[0],q[1]+.027,q[2]],p.black,id);B.cyl(.025,.014,[q[0],q[1]+.044,q[2]],p.red,id,[0,0,0],32);}
   else if(kind==='button'){B.box(d,q,p.edge,id,.003);B.cyl(.012,.008,[q[0],q[1]+.017,q[2]],p.teal,id);}
   else if(kind==='contactor'){B.box(d,q,p.edge,id,.003);B.box([d[0]*.78,.002,d[2]*.48],[q[0],q[1]+d[1]/2+.002,q[2]],p.white,id,.001);for(let x of [-.017,.017]){B.cyl(.005,.013,[q[0]+x,q[1]+d[1]/2+.007,q[2]-.016],p.gold,id,[0,0,0],12);bolt([q[0]+x,q[1]+d[1]/2+.014,q[2]-.016],id,.004)}}
   else if(kind==='safety'){B.box(d,q,p.yellow,id,.002);B.box([d[0]*.8,.033,.001],[q[0],q[1]+.003,q[2]+d[2]/2+.001],p.edge,id,.001);for(let z of [-.016,.016])B.box([.035,.005,.012],[q[0],q[1]+d[1]/2,q[2]+z],p.pcb,id,.001);}
   else if(kind==='clamp'||kind==='resistor'){B.box(d,q,kind==='clamp'?p.orange:p.gold,id,.001);for(let z of [-.009,-.005,-.001,.003,.007])B.box([d[0]*.9,.003,.001],[q[0],q[1]+d[1]/2,q[2]+z],p.steel,id);}
   else if(kind==='fuse'){B.box(d,q,p.black,id,.002);B.box([d[0]*.72,.003,d[2]*.55],[q[0],q[1]+d[1]/2+.001,q[2]],p.orange,id,.001);B.box([.009,.001,.013],[q[0],q[1]+d[1]/2+.003,q[2]],p.glass,id,.001);}
   else if(kind==='tof'){B.box(d,q,p.edge,id,.003);B.box([.017,.003,.021],[q[0],q[1]-d[1]/2,q[2]],p.pcb,id,.001);B.box([.011,.002,.008],[q[0],q[1]-d[1]/2-.002,q[2]],p.glass,id,.001);}
   else if(kind==='uwb'){B.box(d,q,p.edge,id,.003);B.box([.045,.046,.003],[q[0],q[1]+.002,q[2]+d[2]/2],p.glass,id,.002);B.box([.03,.013,.041],[q[0],q[1]-.042,q[2]],p.orange,id,.002);B.sphere(.0017,[q[0]+.016,q[1]-.02,q[2]+.018],p.teal,id);}
   else{B.box(d,q,kind==='terminal'?p.pcb:p.edge,id,.002);B.box([d[0]*.55,.001,d[2]*.45],[q[0],q[1]+d[1]/2+.001,q[2]],p.white,id,.0006);}
  }
  // Actual printed reference marks stay on surfaces, not floating UI billboards.
  if(!custom.has(id)&&!['resistor','capacitor','uwb','tag','board','imu','mux','isolator','adapter'].includes(kind)){
   let ly=q[1]+d[1]/2+.003;if(kind==='converter'||kind==='driver')ly=q[1]+d[1]*1.53;
   const title=kind==='converter'?id:kind==='fuse'?id:kind==='contactor'?id:id;
   B.decal(title,kind==='converter'?(id==='DC3'?'12V STEER':id==='DC4'?'5V PWM':id==='DC1'?'24V SAFETY':'5V CTRL'):'',[Math.min(d[0]*.8,.052),Math.min(d[2]*.43,.022)],[q[0],ly,q[2]],[-PI/2,0,0],id,{bg:kind==='fuse'?'#d96932':'#2c373a'});
  }
  if(kind==='uwb'){B.decal(id,'UWB',[.031,.016],[q[0],q[1]-.010,q[2]+.018],[0,0,0],id);for(let x of [-.021,.021])for(let y of [-.027,.027])bolt([q[0]+x,q[1]+y,q[2]+.018],id,.0017,'z');}
  if(id==='U2')B.decal('ISO7720F','U2 / PWM',[.022,.014],[q[0],q[1]+.007,q[2]],[-PI/2,0,0],id);
  const ports=Object.keys(c.ports);ports.forEach((port,i)=>{const row=i<Math.ceil(ports.length/2)?-1:1,k=i%Math.ceil(ports.length/2),n=Math.ceil(ports.length/2);let pt=[q[0]+(k-(n-1)/2)*Math.min(.007,d[0]/(n+1)),q[1]+d[1]/2+.006,q[2]+row*(d[2]/2+.003)];
   if(id==='BT1')pt=[-.055+i*.036,.248,.045];if(id==='ML'||id==='MR')pt=[q[0]+(i?-.01:.01),.182,-.159];if(id==='LD1')pt=[0,.840,.455];if(id==='A1')pt=[q[0]+(i?-.009:.009),q[1]+.009,q[2]];if(id==='SVL'||id==='SVR')pt=[q[0]+(i-1)*.003,q[1]-.008,q[2]-.033];if(kind==='tof')pt=[q[0]+(i-1.5)*.004,q[1],q[2]-.014];
   B.ports[id+':'+port]=pt;let nnet=c.ports[port];const positive=/5|24|BAT|VIN|3V3|CHG\+/.test(nnet)&&!/0V|GND/.test(nnet);B.box([.005,.004,.006],pt,positive?p.orange:/0V|GND/.test(nnet)?p.black:p.gold,id,.0006);
  });
 }
 // Shared point-to-point harness. Every path has two named physical reference endpoints.
 const hues={power:'#cb4937',return:'#252d32',motor:'#cfaa42',logic:'#328b6c',signal:'#4382bd',safety:'#d9b643',usb:'#6c6a81',charge:'#9c557e',steerpower:'#cf6037'};
 B.routePoints={};B.routeRadii={};
 for(const [i,w] of CartDesign.connections.entries()){
  const a=B.ports[w.from],b=B.ports[w.to];if(!a||!b)throw Error('Missing model terminal '+w.id);
  const f=w.from.split(':')[0],t=w.to.split(':')[0];let pts;
  const local=Math.hypot(...V.sub(a,b));
  if(local<.083){const yy=Math.max(a[1],b[1])+.010+(i%3)*.001;pts=[a,[a[0],yy,a[2]],[b[0],yy,b[2]],b];}
  else if(f==='A1'&&t==='LD1')pts=[a,[.266,.389,.116],[.288,.376,.424],[.288,.791,.424],[.210,.806,.417],[.05,.813,.417],[0,.826,.437],b];
  else if([f,t].some(id=>id==='S1'||id==='S2')){let tall=a[1]>.8?a:b,low=a[1]>.8?b:a,s=tall[0]<0?-1:1;pts=[low,[s*.267,.402,-.409],[s*.245,.45,-.469],[s*.247,.870,-.592],[s*.20,.969,-.617],tall];if(a[1]>.8)pts.reverse();}
  else if([f,t].some(id=>id==='UWL'||id==='UWR')){let tall=a[1]>.65?a:b,low=a[1]>.65?b:a,side=tall[0]<0?-.293:.294;pts=[low,[.260,.388,.108],[side,.379,.421],[side,.799,.421],tall];if(a[1]>.65)pts.reverse();}
  else if([f,t].some(id=>id.startsWith('TOF'))){let low=f.startsWith('TOF')?a:b,hi=f.startsWith('TOF')?b:a,side=low[0]<0?-.293:.293,eps=(i%4)*.002;pts=[hi,[hi[0],.388,.117],[side,.388,.117],[side,.359,.437],[low[0]+eps,.342,.498],[low[0]+eps,.321,.525],low];if(f.startsWith('TOF'))pts.reverse();}
  else if([f,t].some(id=>['JSL','JSR','SVL','SVR','R25','R26'].includes(id))){let lo=a[1]<b[1]?a:b,hi=a[1]<b[1]?b:a,side=lo[0]<0?-.289:.289,eps=(i%3)*.002;pts=[lo,[side+eps,.225,.238],[side+eps,.284,.191],[side+eps,.375,.191],[hi[0],.383,hi[2]],hi];if(a[1]>b[1])pts.reverse();}
  else if(w.kind==='motor'&&local>.1){let lo=a[1]<b[1]?a:b,hi=a[1]<b[1]?b:a,side=lo[0]<0?-.298:.298;pts=[hi,[hi[0],.385,-.121],[side,.379,-.120],[side,.229,-.137],lo];if(a[1]<b[1])pts.reverse();}
  else if(w.kind==='charge'){pts=[a,[a[0],.218,.079],[b[0],.218,.079],b];}
  else if(Math.min(a[1],b[1])<.3){const lo=a[1]<b[1]?a:b,hi=a[1]<b[1]?b:a;let side=lo[0]<0?-.291:.291;pts=[lo,[side,lo[1],lo[2]],[side,.293,lo[2]],[side,.384,hi[2]],hi];if(a[1]>b[1])pts.reverse();}
  else{let y=.388+(i%6)*.0017,corridor=w.sheet==='pwm'||w.sheet==='steering'?.319:(['signal','logic','usb'].includes(w.kind)?.136:-.410);pts=[a,[a[0],y,a[2]],[a[0],y,corridor],[b[0],y,corridor],[b[0],y,b[2]],b];}
  pts=pts.filter((p,j)=>j===0||Math.hypot(...V.sub(p,pts[j-1]))>.00001);B.routePoints[w.id]=pts;
  const heavy=['power','motor','steerpower'].includes(w.kind)||(w.kind==='return'&&['power','steering'].includes(w.sheet));
  const r=heavy?.00225:w.kind==='usb'?.002:.00092;B.routeRadii[w.id]=r;B.tube(pts,r,mat(hues[w.kind],.025,.59),w.id,10,'wire');
  // Insulated ferrules at ends, matching the actual conductor reference ID.
  for(const [p0,p1] of [[pts[0],pts[1]],[pts.at(-1),pts.at(-2)]]){const end=V.add(p0,V.mul(V.norm(V.sub(p1,p0)),Math.min(.006,local*.15)));B.rod(p0,end,r*1.32,mat(heavy?'#282d2f':'#e0d8be',.05,.60),w.id,10,'wire');}
 }
 // Cable restraint hardware, not electrical junctions. No mast-height clamp remains.
 for(let y of [.403,.58,.765])for(let s of [-1,1]){B.box([.027,.005,.031],[s*.301,y,.437],p.rubber,'CLAMPS',.001);B.box([.009,.009,.035],[s*.315,y,.437],p.edge,'CLAMPS',.001);}
 for(let z of [-.345,-.13,.177])for(let x of [-.281,.282]){B.box([.015,.006,.024],[x,.392,z],p.rubber,'CLAMPS',.001);bolt([x,.396,z],'CLAMPS',.002);}
 // Front guard plate identification; no floating part labels are drawn by the viewer.
 B.decal('SMART CART','D3 / FRONT STEERING',[.145,.046],[0,.680,.4655],[0,0,0],'FRAME',{bg:'#243036',ink:'#d8dfdc'});
 B.box([18,.012,18],[0,-.012,0],mat('#c8ccca',0,.83),'FLOOR');
 B.labels=[];
 B.metadata={units:'m',revision:'D3',scanHeight:.865,uwbHeight:.865,lidarMount:'front-upper-rail',hasMast:false,tofAxes:[[0,0,1],[0,0,1]],frontServoIds:['SVL','SVR'],sourceCommit:CartDesign.sourceCommit,notFabricationCAD:true};return B;
};
