/* Canvas 2D software projection fallback: the same 3D triangles, camera and pick IDs.
 * Used only when WebGL 2 context creation fails. Not a static placeholder image. */
'use strict';
window.CartCPU=(()=>{
 const {V,M}=CartGL,proto=CartGL.Renderer.prototype;
 class Renderer{
  constructor(canvas,builder){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});if(!this.ctx)throw Error('Canvas 2D 컨텍스트도 사용할 수 없습니다.');this.items=builder.items;this.labels=builder.labels;this.state={yaw:.68,pitch:.34,distance:2.95,target:[0,.58,0],explode:0,cover:false,labels:true,grid:true,wires:true,scan:false,rotate:false,selection:'',route:'',wireFilter:'all'};this.drag=false;this.invalid=true;this.software=true;this.faces=[];this.lastFaces=[];
   for(const it of builder.items){if(it.id==='FLOOR')continue;const a=it.vertices;for(let i=0;i<a.length;i+=18){let n=V.norm([a[i+3]+a[i+9]+a[i+15],a[i+4]+a[i+10]+a[i+16],a[i+5]+a[i+11]+a[i+17]]);this.faces.push({it,n,p:[a[i],a[i+1],a[i+2],a[i+6],a[i+7],a[i+8],a[i+12],a[i+13],a[i+14]],c:[(a[i]+a[i+6]+a[i+12])/3,(a[i+1]+a[i+7]+a[i+13])/3,(a[i+2]+a[i+8]+a[i+14])/3]})}}
   this.interaction();this.resizeObserver=new ResizeObserver(()=>this.invalid=true);this.resizeObserver.observe(canvas);this.animate=this.animate.bind(this);requestAnimationFrame(this.animate);
  }
  offset(id){return proto.offset.call(this,id)}visible(item){return proto.visible.call(this,item)}project(p,id=''){return proto.project.call(this,p,id)}interaction(){return proto.interaction.call(this)}
  draw(){const t0=performance.now(),ctx=this.ctx,c=this.canvas,s=this.state,dpr=Math.min(window.devicePixelRatio||1,1.35);let w=Math.max(1,Math.round(c.clientWidth*dpr)),h=Math.max(1,Math.round(c.clientHeight*dpr));if(c.width!==w||c.height!==h){c.width=w;c.height=h}const cp=Math.cos(s.pitch);this.eye=V.add(s.target,[Math.sin(s.yaw)*cp*s.distance,Math.sin(s.pitch)*s.distance,Math.cos(s.yaw)*cp*s.distance]);this.vp=M.mul(M.perspective(.58,w/h,.03,20),M.look(this.eye,s.target));let m=this.vp;
   const screen=(x,y,z)=>{let ww=m[3]*x+m[7]*y+m[11]*z+m[15];return [(m[0]*x+m[4]*y+m[8]*z+m[12])/ww*w/2+w/2,-(m[1]*x+m[5]*y+m[9]*z+m[13])/ww*h/2+h/2,ww]};
   const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#31414d');g.addColorStop(.6,'#3e4c55');g.addColorStop(1,'#46515a');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
   // World-ground grid and soft contact shadow; no fake collision / sensor simulation.
   if(s.pitch>0){const q=screen(0,.001,-.06),edge=screen(.49,.001,-.06),shadowW=Math.abs(edge[0]-q[0])*1.5,shadowH=Math.max(5,shadowW*Math.sin(s.pitch)*1.20);ctx.save();ctx.translate(q[0],q[1]);ctx.scale(Math.max(5,shadowW),shadowH);let sh=ctx.createRadialGradient(0,0,.12,0,0,1);sh.addColorStop(0,'#0e191c90');sh.addColorStop(1,'#16252800');ctx.fillStyle=sh;ctx.fillRect(-1,-1,2,2);ctx.restore();}
   if(s.grid){ctx.lineWidth=.65*dpr;ctx.strokeStyle='#a6bbc019';for(let i=-20;i<=20;i++){const n=i*.1;for(const pts of [[[n,-.015,-2],[n,-.015,2]],[[-2,-.015,n],[2,-.015,n]]]){let a=screen(...pts[0]),b=screen(...pts[1]);if(a[2]<.03||b[2]<.03)continue;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()}}}
   const list=[],L=V.norm([-2.5,5,3.5]),R=V.norm([3,2,-3]),offsets={};for(const f of this.faces){const it=f.it;if(!this.visible(it))continue;const off=offsets[it.id]||(offsets[it.id]=this.offset(it.id)),p=f.p,N=f.n,cx=f.c[0]+off[0],cy=f.c[1]+off[1],cz=f.c[2]+off[2],view=V.norm([this.eye[0]-cx,this.eye[1]-cy,this.eye[2]-cz]);if(V.dot(N,view)<-.02&&it.mat.alpha===1)continue;const a=screen(p[0]+off[0],p[1]+off[1],p[2]+off[2]),b=screen(p[3]+off[0],p[4]+off[1],p[5]+off[2]),c=screen(p[6]+off[0],p[7]+off[1],p[8]+off[2]);if(a[2]<.03||b[2]<.03||c[2]<.03)continue;if(Math.max(a[0],b[0],c[0])<0||Math.min(a[0],b[0],c[0])>w||Math.max(a[1],b[1],c[1])<0||Math.min(a[1],b[1],c[1])>h)continue;
    const area=Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]));if(area<.055)continue;
    let nl=Math.max(0,V.dot(N,L)),fill=.30+.62*nl+.14*Math.max(0,V.dot(N,R))+.08*Math.max(N[1],0);const H=V.norm(V.add(view,L)),spec=Math.pow(Math.max(0,V.dot(N,H)),Math.max(9,100*(1-it.mat.rough)))*(.07+it.mat.metal*.70);let col=it.mat.color.map(v=>Math.min(255,Math.max(0,(v*fill+spec+v*it.mat.emissive*.2)*255)));let selected=s.selection===it.id||s.route===it.id;if(selected){col[1]=Math.min(255,col[1]+47);col[2]=Math.min(255,col[2]+25)}else if(s.route&&it.layer==='wire'){col=col.map((v,i)=>v*.40+[76,95,104][i]*.60)}list.push({a,b,c,z:(a[2]+b[2]+c[2])/3,col:'rgb('+col.map(Math.round).join(',')+')',it});
   }
   list.sort((a,b)=>b.z-a.z);for(const f of list){ctx.globalAlpha=f.it.mat.alpha;ctx.fillStyle=f.col;ctx.beginPath();ctx.moveTo(f.a[0],f.a[1]);ctx.lineTo(f.b[0],f.b[1]);ctx.lineTo(f.c[0],f.c[1]);ctx.closePath();ctx.fill();if(f.it.mat.alpha===1){ctx.strokeStyle=f.col;ctx.lineWidth=.32;ctx.stroke()}}
   ctx.globalAlpha=1;this.lastFaces=list;this.dpr=dpr;this.renderMs=performance.now()-t0;this.onframe?.();
  }
  pick(clientX,clientY){const r=this.canvas.getBoundingClientRect(),x=(clientX-r.left)*this.dpr,y=(clientY-r.top)*this.dpr;const sign=(a,b)=> (x-b[0])*(a[1]-b[1])-(a[0]-b[0])*(y-b[1]);for(let i=this.lastFaces.length-1;i>=0;i--){const f=this.lastFaces[i];if(['FLOOR','COVER'].includes(f.it.id)||f.it.layer==='scan')continue;if(x<Math.min(f.a[0],f.b[0],f.c[0])||x>Math.max(f.a[0],f.b[0],f.c[0])||y<Math.min(f.a[1],f.b[1],f.c[1])||y>Math.max(f.a[1],f.b[1],f.c[1]))continue;const a=sign(f.a,f.b),b=sign(f.b,f.c),c=sign(f.c,f.a);if(!((a<0||b<0||c<0)&&(a>0||b>0||c>0)))return f.it.id}return'';}
  animate(){if(!document.hidden){if(this.state.rotate&&!this.drag){this.state.yaw+=.010;this.invalid=true}if(this.invalid){this.invalid=false;this.draw()}}requestAnimationFrame(this.animate)}
 }
 return{Renderer};
})();
