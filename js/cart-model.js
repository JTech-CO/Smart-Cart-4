/* D4 spatial reconstruction of JTech-CO/Smart-Cart (2b4b8fe).
 * Metres; Y up, +Z front. Product envelopes and connector positions are illustrative,
 * NOT manufacturer CAD or a drilling / fabrication drawing. */
'use strict';
window.buildSmartCart = function(){
 const {Builder,material:mat,V}=CartGL,B=new Builder(),PI=Math.PI;
 const p={paint:mat('#343d40',.18,.37),edge:mat('#1b2528',.12,.39),steel:mat('#94a3ab',.85,.27),chrome:mat('#d3e1e5',.95,.19),rubber:mat('#161d21',.04,.85),tread:mat('#293438',.04,.8),orange:mat('#dd652d',.28,.34),magenta:mat('#be0a52',.58,.24),blue:mat('#164c79',.12,.51),pcb:mat('#267763',.18,.54),gold:mat('#cab779',.85,.29),black:mat('#11191f',.05,.6),glass:mat('#273e44',.45,.18),red:mat('#e0524f',.12,.4),teal:mat('#57dbc2',.1,.3,1,.32),yellow:mat('#e5bc4a',.2,.45),white:mat('#dfe7e5',.12,.55)};
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
  plate([.10,.009,.085],[s*.34,.268,-.379],id);
  // MY1016Z-120: parallel motor/gear output axes; 17 mm output shaft, 44 mm visual protrusion.
  // 198 mm axial envelope is only the low-resolution drawing interpretation in the attachment.
  B.box([.036,.142,.103],[s*.308,.172,-.379],p.steel,mid,.018);
  B.box([.003,.133,.096],[s*.3275,.172,-.379],p.chrome,mid,.017);
  B.cyl(.031,.004,[s*.330,.131,-.379],p.edge,mid,XR,48);
  B.cyl(.025,.005,[s*.332,.131,-.379],p.steel,mid,XR,48);
  B.cyl(.0085,.044,[s*.348,.131,-.379],p.chrome,mid,XR,40);
  B.box([.032,.002,.006],[s*.348,.139,-.379],p.gold,mid,.0004);
  B.cyl(.045,.104,[s*.238,.180,-.379],p.steel,mid,XR,64);
  B.cyl(.043,.014,[s*.179,.180,-.379],p.edge,mid,XR,56);
  B.cyl(.031,.006,[s*.169,.180,-.379],p.paint,mid,XR,40);
  for(let xx of [.188,.285])B.cyl(.046,.003,[s*xx,.180,-.379],p.chrome,mid,XR,56);
  for(let [yy,zz] of [[.229,-.416],[.229,-.342],[.113,-.416],[.113,-.342]]){
    B.cyl(.011,.040,[s*.308,yy,zz],p.steel,mid,XR,24);bolt([s*.330,yy,zz],mid,.004,'x');
  }
  for(let j=0;j<7;j++){let t=j*2*PI/7;bolt([s*.330,.177+Math.cos(t)*.053,-.379+Math.sin(t)*.037],mid,.0028,'x');}
  B.box([.040,.015,.080],[s*.300,.253,-.379],p.steel,mid,.002);
  B.box([.022,.014,.015],[s*.181,.183,-.329],p.black,mid,.002);
  B.decal('MY1016Z','24V / 13.4A / 120rpm no-load',[.075,.023],[s*.234,.226,-.379],[-PI/2,0,0],mid,{bg:'#d9dfdd',ink:'#222e32'});

 }
 // D4 front steering: wheel loads pass into a bearing-supported kingpin, not a servo shaft.
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
  // RDS51150 photograph-derived case; dimension conflicts are preserved in the evidence register.
  // Custom structural saddle: NOT a claim that either supplied U-bracket fits this wheel assembly.
  plate([.060,.006,.094],[sx,.250,.288],sv,p.steel);
  for(let zz of [.248,.328]){B.box([.047,.057,.003],[sx,.220,zz],p.steel,sv,.001);
   for(let dx of [-.018,.018])bolt([sx+dx,.239,zz+ .002],sv,.0025,'z');}
  B.box([.030,.0481,.06539],[sx,.198,.288],p.magenta,sv,.0025);
  B.box([.0306,.012,.0658],[sx,.21605,.288],p.edge,sv,.002);
  B.box([.0306,.010,.0658],[sx,.17895,.288],p.edge,sv,.002);
  for(const dx of [-.011,.011])for(const dz of [-.027,.027]){
   bolt([sx+dx,.223,.288+dz],sv,.0022);B.cyl(.0016,.048,[sx+dx,.198,.288+dz],p.chrome,sv,[0,0,0],10);
  }
  B.cyl(.009,.003,[sx,.22355,.310],p.edge,sv,[0,0,0],40);
  B.cyl(.0055,.01107,[sx,.230585,.310],p.chrome,sv,[0,0,0],40);
  for(let t=0;t<25;t++){let ang=t/25*2*PI;B.cyl(.00048,.0105,[sx+Math.cos(ang)*.00555,.2306,.310+Math.sin(ang)*.00555],p.steel,sv,[0,0,0],5);}
  B.decal('150 kgf.cm','RDS51150 / DC10-12.6V',[.054,.019],[sx+s*.0151,.199,.288],[0,s*PI/2,0],sv,{bg:'#ba0a50',ink:'#ffe3ed'});
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
 plate([.072,.006,.072],[0,.824,.489],'LIDAR_MOUNT',p.edge);
 // C1M1-R2 base: 55.6 square, 41.3 high; 43 square M2.5 mounting pattern.
 for(const x of [-.0215,.0215])for(const z of [-.0215,.0215]){
  B.cyl(.0031,.003,[x,.8285,.489+z],p.rubber,'LIDAR_MOUNT',[0,0,0],20);
  B.cyl(.00125,.004,[x,.830,.489+z],p.chrome,'LIDAR_MOUNT',[0,0,0],16);
 }
 B.box([.0556,.026,.0556],[0,.843,.489],p.edge,'LD1',.006);
 for(const x of [-.022,.022])for(const z of [-.022,.022])bolt([x,.856,.489+z],'LD1',.0018);
 B.cyl(.0246,.0153,[0,.86365,.489],p.glass,'LD1',[0,0,0],96);
 B.cyl(.0251,.003,[0,.8698,.489],p.edge,'LD1',[0,0,0],96);
 B.cyl(.0205,.001,[0,.8708,.489],p.paint,'LD1',[0,0,0],72);
 B.ring(.0246,.0007,[0,.8565,.489],p.steel,'LD1',[0,0,0],80,8);
 B.decal('RPLIDAR C1','SLAMTEC / 5V',[.034,.013],[0,.8716,.489],[-PI/2,0,0],'LD1');
 B.decal('C1M1-R2','LD1',[.036,.013],[0,.844,.5171],[0,0,0],'LD1');
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
 // Source-grounded boards: schematic pad geometry remains functional, not an unverified mating-face map.
 for(const id of ['OP1','U1','MDL','MDR','UWL','UWR','TAG']){
  const c=CartDesign.components.find(c=>c.id===id),q=c.position;
  if(id==='OP1'){
   B.box([.089,.0016,.056],q,p.blue,id,.001);
   for(let x of [-.039,.039])for(let z of [-.024,.024]){B.cyl(.003,.004,[q[0]+x,q[1]-.002,q[2]+z],p.gold,id);bolt([q[0]+x,q[1]+.002,q[2]+z],id,.0017);}
   B.box([.019,.003,.019],[q[0]-.005,q[1]+.0025,q[2]],p.black,id,.0008);
   B.box([.018,.002,.018],[q[0]-.005,q[1]+.005,q[2]],p.chrome,id,.0005);
   for(let x of [-.012,-.007,-.002,.003])B.box([.002,.008,.017],[q[0]+x,q[1]+.010,q[2]],p.steel,id,.0003);
   for(let z of [-.017,.004]){B.box([.016,.014,.017],[q[0]+.037,q[1]+.007,q[2]+z],p.chrome,id,.0008);B.box([.001,.008,.012],[q[0]+.0452,q[1]+.007,q[2]+z],p.black,id,.0003);}
   B.box([.009,.004,.007],[q[0]-.040,q[1]+.003,q[2]+.010],p.chrome,id,.0006);
   B.box([.051,.005,.005],[q[0]-.011,q[1]+.003,q[2]-.023],p.black,id,.0004);
   for(let j=0;j<20;j++)for(let z of [-.0013,.0013])B.cyl(.00035,.006,[q[0]-.035+j*.00254,q[1]+.004,q[2]-.023+z],p.gold,id,[0,0,0],6);
   for(let j=0;j<18;j++){let x=q[0]-.031+(j%6)*.008,z=q[2]+.015+Math.floor(j/6)*.003;B.box([.003,.001,.0015],[x,q[1]+.0014,z],j%3===0?p.gold:p.black,id,.0001);}
   B.decal('ORANGE PI 4 PRO','A733 / 89 x 56 mm',[.037,.010],[q[0]-.016,q[1]+.0011,q[2]+.022],[-PI/2,0,0],id,{bg:'#184d7a'});
  }else if(id==='U1'){
   B.box([.028,.0016,.052],q,p.black,id,.001);B.box([.018,.0032,.0192],[q[0],q[1]+.0024,q[2]-.008],p.chrome,id,.0005);
   B.decal('ESP32','WROOM-32U',[.015,.013],[q[0],q[1]+.0041,q[2]-.008],[-PI/2,0,0],id,{bg:'#b9c6c4',ink:'#263437'});
   B.cyl(.0016,.0012,[q[0]+.006,q[1]+.0038,q[2]-.021],p.gold,id,[0,0,0],20);
   B.box([.004,.001,.004],[q[0],q[1]+.0014,q[2]+.013],p.edge,id,.0003);
   B.box([.008,.003,.006],[q[0],q[1]+.0024,q[2]+.026],p.chrome,id,.0007);
   for(let side of [-1,1]){B.box([.0032,.003,.049],[q[0]+side*.012,q[1]-.002,q[2]],p.black,id,.0003);for(let j=0;j<19;j++)B.cyl(.00035,.006,[q[0]+side*.012,q[1]+.001,q[2]-.02286+j*.00254],p.gold,id,[0,0,0],6);}
   for(let x of [-.008,.008])B.box([.003,.002,.004],[q[0]+x,q[1]+.002,q[2]+.019],p.steel,id,.0003);
   // Coax antenna on a non-metal front mount; radio operation still needs a matched antenna.
   B.tube([[q[0]+.006,q[1]+.004,q[2]-.021],[q[0]+.022,.376,q[2]-.032],[.288,.390,-.101],[.310,.427,-.101]],.0008,p.black,id,8,'hardware');
   B.cyl(.0037,.056,[.310,.455,-.101],p.rubber,id,[0,0,0],24);
  }else if(id.startsWith('MD')){
   B.box([.050,.0016,.050],q,p.blue,id,.001);
   B.box([.044,.004,.038],[q[0],q[1]-.004,q[2]],p.steel,id,.001);
   for(let j=0;j<9;j++)B.box([.002,.009,.038],[q[0]-.019+j*.00475,q[1]-.009,q[2]],p.steel,id,.0003);
   for(let x of [-.011,.010]){B.box([.012,.002,.011],[q[0]+x,q[1]+.002,q[2]-.002],p.black,id,.0005);for(let j=0;j<7;j++)B.box([.001,.001,.004],[q[0]+x-.005+j*.0016,q[1]+.0015,q[2]+.006],p.chrome,id,.0001);}
   B.box([.009,.002,.004],[q[0]+.004,q[1]+.002,q[2]+.014],p.black,id,.0003);
   B.cyl(.0045,.016,[q[0]-.017,q[1]+.009,q[2]-.016],p.edge,id,[0,0,0],24);B.cyl(.0044,.0007,[q[0]-.017,q[1]+.017,q[2]-.016],p.steel,id);
   B.box([.027,.010,.008],[q[0]+.009,q[1]+.006,q[2]-.021],p.pcb,id,.0008);
   for(let j=0;j<4;j++)bolt([q[0]-.001+j*.006,q[1]+.012,q[2]-.021],id,.002);
   for(let x of [-.021,.021])for(let z of [-.021,.021])B.ring(.002,.0007,[q[0]+x,q[1]+.001,q[2]+z],p.gold,id,[0,0,0],16,6);
   for(let j=0;j<4;j++)for(let k=0;k<2;k++)B.cyl(.00035,.006,[q[0]-.010+j*.00254,q[1]+.004,q[2]+.022+k*.00254],p.gold,id,[0,0,0],6);
   B.decal('IBT_2','BTS7960B x 2',[.022,.008],[q[0]-.002,q[1]+.0012,q[2]-.014],[-PI/2,0,0],id,{bg:'#174b75'});
  }else if(id==='TAG'){
   B.box([.03556,.0016,.055],q,p.black,id,.001);B.box([.018,.003,.014],[q[0],q[1]+.002,q[2]-.01],p.chrome,id,.0004);B.box([.007,.003,.008],[q[0],q[1]+.002,q[2]-.024],p.white,id,.0004);B.box([.006,.002,.006],[q[0],q[1]+.002,q[2]+.010],p.edge,id,.0002);B.box([.008,.003,.006],[q[0],q[1]+.002,q[2]+.025],p.chrome,id,.0005);
   B.decal('BU03 KIT','USER TAG / SEPARATE POWER',[.030,.016],[q[0],q[1]+.0039,q[2]+.008],[-PI/2,0,0],id);
   B.box([.052,.010,.075],[q[0],q[1]-.008,q[2]],p.edge,id,.003);
  }else{
   B.box([.046,.052,.0016],q,p.black,id,.001);
   B.box([.026,.021,.003],[q[0],q[1]-.004,q[2]+.002],p.chrome,id,.0005);
   B.decal('BU04','Ai-Thinker',[.022,.015],[q[0],q[1]-.004,q[2]+.0036],[0,0,0],id,{bg:'#a9b5b3',ink:'#263434'});
   for(let side of [-1,1])for(let j=0;j<7;j++)B.box([.004,.0013,.001],[q[0]+side*.017,q[1]-.02+j*.004,q[2]+.001],p.gold,id,.0001);
   B.box([.010,.009,.002],[q[0],q[1]-.019,q[2]+.002],p.edge,id,.0003);
   B.box([.008,.004,.006],[q[0],q[1]-.026,q[2]-.002],p.chrome,id,.0006);
   for(let x of [-.012,.012])B.box([.007,.010,.0005],[q[0]+x,q[1]+.019,q[2]+.001],p.gold,id,.0002);
   B.box([.050,.003,.018],[q[0],.832,q[2]],p.edge,id,.001);
   for(let x of [-.017,.017])B.rod([q[0]+x,.818,q[2]],[q[0]+x,.838,q[2]],.002,p.white,id,12);
  }
 }
 // Vendor envelopes: illustrative PCB/connector shapes. Ports map to exact logical net IDs.
 const custom=new Set(['BT1','ML','MR','LD1','SVL','SVR','TOF1','TOF2','OP1','U1','MDL','MDR','UWL','UWR','TAG']);
 const dimensions={fuse:[.025,.016,.04],contactor:[.052,.060,.049],suppressor:[.019,.012,.019],terminal:[.022,.013,.040],precharge:[.032,.015,.030],driver:[.056,.023,.039],clamp:[.040,.020,.022],resistor:[.011,.009,.027],capacitor:[.009,.013,.006],converter:[.066,.026,.071],safety:[.044,.082,.055],estop:[.042,.03,.038],button:[.034,.023,.030],protector:[.038,.016,.035],board:[.085,.018,.055],hub:[.08,.020,.042],isolator:[.020,.010,.029],adapter:[.03,.013,.031],uwb:[.052,.070,.032],tag:[.048,.07,.018],imu:[.026,.006,.020],mux:[.027,.006,.025],tof:[.03,.025,.030],servo:[.03,.048,.065],connector:[.018,.014,.020],switch:[.029,.038,.035],charge:[.026,.026,.025]};
 for(const c of CartDesign.components){const q=c.position,kind=c.kind,id=c.id;let d=(dimensions[kind]||[.03,.02,.03]).slice();if(id==='U1')d=[.028,.009,.052];if(id==='X3')d=[.03,.008,.04];if(id==='DC1')d=[.052,.023,.072];if(id==='DC3')d=[.072,.029,.075];if(id==='DC4')d=[.041,.019,.038];if(id==='X12')d=[.063,.014,.035];if(id==='U2')d=[.032,.012,.038];if(c.renderDimensionsMm)d=c.renderDimensionsMm.map(v=>v/1000);if(kind==='resistor'&&!id.startsWith('RB'))d=[.003,.003,.008];if(kind==='buffer')d=[.014,.007,.032];if(kind==='openlink')d=[.047,.014,.027];
  if(!custom.has(id)){
   if(['board','imu','mux','isolator','adapter','precharge','protector','buffer'].includes(kind)){
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
   else if(kind==='openlink'){B.box(d,q,p.edge,id,.002);for(const x of [-.016,.016]){B.cyl(.004,.008,[q[0]+x,q[1]+.011,q[2]],p.gold,id);bolt([q[0]+x,q[1]+.016,q[2]],id,.003);}B.box([.008,.002,.020],[q[0],q[1]+.009,q[2]],p.red,id,.001);B.decal('OPEN','NO LINK',[.034,.013],[q[0],q[1]+.020,q[2]],[-PI/2,0,0],id,{bg:'#962f36'});}
   else if(kind==='contactor'){B.box(d,q,p.edge,id,.003);B.box([d[0]*.78,.002,d[2]*.48],[q[0],q[1]+d[1]/2+.002,q[2]],p.white,id,.001);for(let x of [-.017,.017]){B.cyl(.005,.013,[q[0]+x,q[1]+d[1]/2+.007,q[2]-.016],p.gold,id,[0,0,0],12);bolt([q[0]+x,q[1]+d[1]/2+.014,q[2]-.016],id,.004)}}
   else if(kind==='safety'){B.box(d,q,p.yellow,id,.002);B.box([d[0]*.8,.033,.001],[q[0],q[1]+.003,q[2]+d[2]/2+.001],p.edge,id,.001);for(let z of [-.016,.016])B.box([.035,.005,.012],[q[0],q[1]+d[1]/2,q[2]+z],p.pcb,id,.001);}
   else if(kind==='clamp'||kind==='resistor'){B.box(d,q,kind==='clamp'?p.orange:p.gold,id,.001);for(let z of [-.009,-.005,-.001,.003,.007])B.box([d[0]*.9,.003,.001],[q[0],q[1]+d[1]/2,q[2]+z],p.steel,id);}
   else if(kind==='fuse'){B.box(d,q,p.black,id,.002);B.box([d[0]*.72,.003,d[2]*.55],[q[0],q[1]+d[1]/2+.001,q[2]],p.orange,id,.001);B.box([.009,.001,.013],[q[0],q[1]+d[1]/2+.003,q[2]],p.glass,id,.001);}
   else if(kind==='tof'){B.box(d,q,p.edge,id,.003);B.box([.017,.003,.021],[q[0],q[1]-d[1]/2,q[2]],p.pcb,id,.001);B.box([.011,.002,.008],[q[0],q[1]-d[1]/2-.002,q[2]],p.glass,id,.001);}
   else if(kind==='uwb'){B.box(d,q,p.edge,id,.003);B.box([.045,.046,.003],[q[0],q[1]+.002,q[2]+d[2]/2],p.glass,id,.002);B.box([.03,.013,.041],[q[0],q[1]-.042,q[2]],p.orange,id,.002);B.sphere(.0017,[q[0]+.016,q[1]-.02,q[2]+.018],p.teal,id);}
   else{B.box(d,q,kind==='terminal'?p.pcb:p.edge,id,.002);B.box([d[0]*.55,.001,d[2]*.45],[q[0],q[1]+d[1]/2+.001,q[2]],p.white,id,.0006);}
  }
  // Actual printed reference marks stay on surfaces, not floating UI billboards.
  if(!custom.has(id)&&!['resistor','capacitor','uwb','tag','board','imu','mux','isolator','adapter','openlink'].includes(kind)){
   let ly=q[1]+d[1]/2+.003;if(kind==='converter'||kind==='driver')ly=q[1]+d[1]*1.53;
   const title=kind==='converter'?id:kind==='fuse'?id:kind==='contactor'?id:id;
   B.decal(title,kind==='converter'?(id==='DC3'?'12V STEER':id==='DC4'?'5V PWM':id==='DC1'?'24V SAFETY':'5V CTRL'):'',[Math.min(d[0]*.8,.052),Math.min(d[2]*.43,.022)],[q[0],ly,q[2]],[-PI/2,0,0],id,{bg:kind==='fuse'?'#d96932':'#2c373a'});
  }
  if(kind==='uwb'&&!custom.has(id)){B.decal(id,'UWB',[.031,.016],[q[0],q[1]-.010,q[2]+.018],[0,0,0],id);for(let x of [-.021,.021])for(let y of [-.027,.027])bolt([q[0]+x,q[1]+y,q[2]+.018],id,.0017,'z');}
  if(id==='U2')B.decal('ISO7720F','U2 / PWM',[.022,.014],[q[0],q[1]+.007,q[2]],[-PI/2,0,0],id);
  const ports=Object.keys(c.ports);ports.forEach((port,i)=>{const row=i<Math.ceil(ports.length/2)?-1:1,k=i%Math.ceil(ports.length/2),n=Math.ceil(ports.length/2);let pt=[q[0]+(k-(n-1)/2)*Math.min(.007,d[0]/(n+1)),q[1]+d[1]/2+.006,q[2]+row*(d[2]/2+.003)];
   if(id==='BT1')pt=[-.055+i*.036,.248,.045];if(id==='ML'||id==='MR')pt=[(id==='ML'?-1:1)*.181,.181+i*.005,-.329];if(id==='LD1')pt=[0,.842,.4605];if(id==='OP1')pt=port==='HOST'?[q[0]+.045,.359,q[2]-.017]:[q[0]-.0445,.353,q[2]+.01+(i*.003)];if(id==='U1'){if(port==='USB')pt=[q[0],q[1]+.003,q[2]+.029];else pt=[q[0]+(i%2?-.012:.012),q[1]+.005,q[2]-.022+Math.floor(i/2)*.0044];}if(id==='UWL'||id==='UWR')pt=[q[0],q[1]-.027,q[2]-.002];if(id==='MDL'||id==='MDR'){const power=['B+','B-','M+','M-'];if(power.includes(port))pt=[q[0]-.001+power.indexOf(port)*.006,q[1]+.012,q[2]-.021];else{const pp=['VCC','GND','R_EN','L_EN','RPWM','LPWM'].indexOf(port);pt=[q[0]-.010+Math.floor(pp/2)*.00254,q[1]+.007,q[2]+.022+(pp%2)*.00254];}}if(id==='A1')pt=[q[0]+(i?-.009:.009),q[1]+.009,q[2]];if(id==='SVL'||id==='SVR')pt=[q[0]+(i-1)*.0025,q[1]-.008,q[2]-.033];if(kind==='tof')pt=[q[0]+(i-1.5)*.004,q[1],q[2]-.014];
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
 B.decal('SMART CART','D4 / FRONT STEERING',[.145,.046],[0,.680,.4655],[0,0,0],'FRAME',{bg:'#243036',ink:'#d8dfdc'});
 B.box([18,.012,18],[0,-.012,0],mat('#c8ccca',0,.83),'FLOOR');
 B.labels=[];
 B.metadata={units:'m',revision:'D4',scanHeight:.862,uwbHeight:.865,lidarMount:'front-upper-rail',hasMast:false,tofAxes:[[0,0,1],[0,0,1]],frontServoIds:['SVL','SVR'],sourceCommit:CartDesign.sourceCommit,sourceGrounded:true,notFabricationCAD:true,driverType:'IBT-2 / PWM+EN',servoEnvelopeSource:'photo65.39x30x48.10 / conflict preserved'};return B;
};
