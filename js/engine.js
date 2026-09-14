/* D3 native WebGL 2 product renderer: GGX/Schlick BRDF, procedural studio reflections,
 * material microtexture, shadow map, printed component labels. No network/device APIs. */
'use strict';
window.CartGL = (() => {
 const V={add:(a,b)=>a.map((v,i)=>v+b[i]),sub:(a,b)=>a.map((v,i)=>v-b[i]),mul:(a,s)=>a.map(v=>v*s),dot:(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm:a=>{let l=Math.hypot(...a)||1;return a.map(v=>v/l)}};
 const M={identity:()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],mul:(a,b)=>{let o=new Array(16).fill(0);for(let j=0;j<4;j++)for(let i=0;i<4;i++)for(let k=0;k<4;k++)o[j*4+i]+=a[k*4+i]*b[j*4+k];return o;},translate:(x,y,z)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1],rx:a=>[1,0,0,0,0,Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1],ry:a=>[Math.cos(a),0,-Math.sin(a),0,0,1,0,0,Math.sin(a),0,Math.cos(a),0,0,0,0,1],rz:a=>[Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1,0,0,0,0,1],point:(m,p,w=1)=>[0,1,2,3].map(i=>m[i]*p[0]+m[4+i]*p[1]+m[8+i]*p[2]+m[12+i]*w),perspective:(f,asp,n,fz)=>{const t=1/Math.tan(f/2);return [t/asp,0,0,0,0,t,0,0,0,0,(fz+n)/(n-fz),-1,0,0,2*fz*n/(n-fz),0]},ortho:(l,r,b,t,n,f)=>[2/(r-l),0,0,0,0,2/(t-b),0,0,0,0,-2/(f-n),0,-(r+l)/(r-l),-(t+b)/(t-b),-(f+n)/(f-n),1],look:(e,t,up=[0,1,0])=>{const z=V.norm(V.sub(e,t)),x=V.norm(V.cross(up,z)),y=V.cross(z,x);return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-V.dot(x,e),-V.dot(y,e),-V.dot(z,e),1]}};
 const color=h=>{if(Array.isArray(h))return h;return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255)};
 const material=(hex,metal=.15,rough=.45,alpha=1,emissive=0)=>({color:color(hex),metal,rough,alpha,emissive});
 class Builder{
  constructor(){this.items=[];this.ports={};this.labels=[];this._batches=new Map();this.decals=[]}
  add(data,mat,id,transform=M.identity(),layer='hardware'){
   if(!data.length)return;
   // Align winding to authored outward normals (caps / toroidal primitives included).
   for(let i=0;i<data.length;i+=18){const a=data.slice(i,i+3),b=data.slice(i+6,i+9),c=data.slice(i+12,i+15);const normal=[data[i+3]+data[i+9]+data[i+15],data[i+4]+data[i+10]+data[i+16],data[i+5]+data[i+11]+data[i+17]];if(V.dot(V.cross(V.sub(b,a),V.sub(c,a)),normal)<0){for(let k=0;k<6;k++){const t=data[i+6+k];data[i+6+k]=data[i+12+k];data[i+12+k]=t;}}}
   const arr=[];
   for(let i=0;i<data.length;i+=6){const p=M.point(transform,data.slice(i,i+3));const n=V.norm(M.point(transform,data.slice(i+3,i+6),0).slice(0,3));arr.push(...p.slice(0,3),...n)}
   const key=id+'|'+layer+'|'+JSON.stringify(mat);
   if(this._batches.has(key))this._batches.get(key).vertices.push(...arr);
   else {let item={id,mat,layer,vertices:arr};this.items.push(item);this._batches.set(key,item)}
  }
  transform(pos,rot){return M.mul(M.translate(...pos),M.mul(M.rz(rot?.[2]||0),M.mul(M.ry(rot?.[1]||0),M.rx(rot?.[0]||0))))}
  box(size,pos,mat,id,r=0,rot=[0,0,0],layer='hardware'){
   const a=[];r=Math.max(0,Math.min(r,...size.map(v=>v/2-.000001)));
   for(let axis=0;axis<3;axis++)for(let sign of [-1,1]){
    let u=(axis+1)%3,v=(axis+2)%3;
    const points=k=>r?[-size[k]/2,-size[k]/2+r,size[k]/2-r,size[k]/2]:[-size[k]/2,size[k]/2];let us=points(u),vs=points(v);
    const vertex=(i,j)=>{let p=[0,0,0];p[axis]=sign*size[axis]/2;p[u]=us[i];p[v]=vs[j];let n=[0,0,0];n[axis]=sign;
     if(r){const q=p.map((x,k)=>Math.max(-size[k]/2+r,Math.min(size[k]/2-r,x)));n=V.norm(V.sub(p,q));p=V.add(q,V.mul(n,r));}return [...p,...n]};
    for(let i=0;i<us.length-1;i++)for(let j=0;j<vs.length-1;j++){let q=[vertex(i,j),vertex(i+1,j),vertex(i+1,j+1),vertex(i,j+1)];let ids=sign>0?[0,1,2,0,2,3]:[0,2,1,0,3,2];for(let k of ids)a.push(...q[k])}
   }this.add(a,mat,id,this.transform(pos,rot),layer)
  }
  cyl(r,h,pos,mat,id,rot=[0,0,0],n=28,layer='hardware'){
   let a=[];for(let i=0;i<n;i++){let t=i*2*Math.PI/n,u=(i+1)*2*Math.PI/n,c=Math.cos(t),s=Math.sin(t),d=Math.cos(u),f=Math.sin(u);let v=[[r*c,-h/2,r*s,c,0,s],[r*d,-h/2,r*f,d,0,f],[r*d,h/2,r*f,d,0,f],[r*c,h/2,r*s,c,0,s]];for(let k of [0,2,1,0,3,2])a.push(...v[k]);a.push(0,h/2,0,0,1,0,r*c,h/2,r*s,0,1,0,r*d,h/2,r*f,0,1,0);a.push(0,-h/2,0,0,-1,0,r*d,-h/2,r*f,0,-1,0,r*c,-h/2,r*s,0,-1,0)}this.add(a,mat,id,this.transform(pos,rot),layer)
  }
  rod(a,b,r,mat,id,n=12,layer='hardware'){
   const y=V.norm(V.sub(b,a)),x=V.norm(V.cross(Math.abs(y[1])<.9?[0,1,0]:[1,0,0],y)),z=V.cross(x,y),p=V.mul(V.add(a,b),.5);
   let old=this.items.length;const basis=[...x,0,...y,0,...z,0,...p,1];let data=[];const h=Math.hypot(...V.sub(b,a));
   for(let i=0;i<n;i++){let t=i*2*Math.PI/n,u=(i+1)*2*Math.PI/n;let v=[[r*Math.cos(t),-h/2,r*Math.sin(t),Math.cos(t),0,Math.sin(t)],[r*Math.cos(u),-h/2,r*Math.sin(u),Math.cos(u),0,Math.sin(u)],[r*Math.cos(u),h/2,r*Math.sin(u),Math.cos(u),0,Math.sin(u)],[r*Math.cos(t),h/2,r*Math.sin(t),Math.cos(t),0,Math.sin(t)]];for(let k of [0,2,1,0,3,2])data.push(...v[k])}this.add(data,mat,id,basis,layer)
  }
  tube(points,r,mat,id,n=8,layer='wire'){
   // Corner rounding with a quadratic interpolation prevents sharp conductor corners.
   const ps=[points[0]];for(let i=1;i<points.length-1;i++){const p=points[i],b=points[i-1],c=points[i+1];let l1=Math.hypot(...V.sub(b,p)),l2=Math.hypot(...V.sub(c,p));let d=Math.min(.026,l1*.32,l2*.32);const a=V.add(p,V.mul(V.norm(V.sub(b,p)),d)),z=V.add(p,V.mul(V.norm(V.sub(c,p)),d));ps.push(a);for(let j=1;j<=4;j++){let t=j/4;ps.push(a.map((v,k)=>(1-t)*(1-t)*v+2*t*(1-t)*p[k]+t*t*z[k]))}}ps.push(points[points.length-1]);
   let arr=[],frames=[];for(let i=0;i<ps.length;i++){const y=V.norm(V.sub(ps[Math.min(ps.length-1,i+1)],ps[Math.max(0,i-1)]));const x=V.norm(V.cross(y,Math.abs(y[1])<.8?[0,1,0]:[1,0,0])),z=V.cross(y,x);frames.push([x,z]);}
   for(let i=0;i<ps.length-1;i++)for(let j=0;j<n;j++){let quad=[];for(let [k,t] of [[i,j],[i,(j+1)%n],[i+1,(j+1)%n],[i+1,j]]){let ang=t/n*2*Math.PI;let normal=V.add(V.mul(frames[k][0],Math.cos(ang)),V.mul(frames[k][1],Math.sin(ang)));quad.push([...V.add(ps[k],V.mul(normal,r)),...normal])}for(let k of [0,1,2,0,2,3])arr.push(...quad[k])}this.add(arr,mat,id,M.identity(),layer)
  }
  ring(R,r,pos,mat,id,rot=[0,0,0],N=56,n=8,layer='hardware'){
   let arr=[];for(let i=0;i<N;i++)for(let j=0;j<n;j++){let q=[];for(let [a,b] of [[i,j],[i+1,j],[i+1,j+1],[i,j+1]]){const u=a/N*2*Math.PI,v=b/n*2*Math.PI;let nx=Math.cos(u)*Math.cos(v),ny=Math.sin(v),nz=Math.sin(u)*Math.cos(v);q.push([R*Math.cos(u)+r*nx,r*ny,R*Math.sin(u)+r*nz,nx,ny,nz])}for(let k of [0,1,2,0,2,3])arr.push(...q[k])}this.add(arr,mat,id,this.transform(pos,rot),layer)
  }
  decal(text,sub,size,pos,rot,id,options={}){
   const transform=this.transform(pos,rot),w=size[0]/2,h=size[1]/2;
   const meta={text,sub,size,origin:pos,right:M.point(transform,[1,0,0],0).slice(0,3),up:M.point(transform,[0,1,0],0).slice(0,3),bg:options.bg||'#263134',ink:options.ink||'#edf1ee'};
   const m={...material('#ffffff',.04,.62),label:meta,surface:0};
   const q=[[-w,-h,0,0,0,1],[w,-h,0,0,0,1],[w,h,0,0,0,1],[-w,h,0,0,0,1]],v=[];for(const k of [0,1,2,0,2,3])v.push(...q[k]);
   this.add(v,m,id,transform,'decal');this.decals.push({id,...meta});
  }
  lathe(profile,pos,mat,id,rot=[0,0,0],N=72){
   const a=[];for(let i=0;i<N;i++)for(let j=0;j<profile.length-1;j++){
    const q=[];for(let [u,v] of [[i,j],[i+1,j],[i+1,j+1],[i,j+1]]){const t=u/N*2*Math.PI,r=profile[v][0],h=profile[v][1],p0=profile[Math.max(0,v-1)],p1=profile[Math.min(profile.length-1,v+1)];let n=V.norm([p1[1]-p0[1],p0[0]-p1[0]]);q.push([r*Math.cos(t),h,r*Math.sin(t),n[0]*Math.cos(t),n[1],n[0]*Math.sin(t)])}for(const k of [0,1,2,0,2,3])a.push(...q[k]);
   }this.add(a,mat,id,this.transform(pos,rot));
  }
  sphere(r,pos,mat,id,N=16,n=10,layer='hardware'){
   let a=[];for(let i=0;i<N;i++)for(let j=0;j<n;j++){let q=[];for(let [u,v] of [[i,j],[i+1,j],[i+1,j+1],[i,j+1]]){u=u/N*2*Math.PI;v=v/n*Math.PI;let norm=[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)];q.push(...[]);q.push([...V.mul(norm,r),...norm])}for(let k of [0,1,2,0,2,3])a.push(...q[k])}this.add(a,mat,id,M.translate(...pos),layer)
  }
 }
 const VS=`#version 300 es
 precision highp float;layout(location=0) in vec3 p;layout(location=1) in vec3 n;
 uniform mat4 uVP,uLight;uniform vec3 uOffset;out vec3 vP,vN;out vec4 vS;
 void main(){vP=p+uOffset;vN=n;vS=uLight*vec4(vP,1.);gl_Position=uVP*vec4(vP,1.);}`;
 const FS=`#version 300 es
 precision highp float;in vec3 vP,vN;in vec4 vS;out vec4 outColor;
 uniform vec3 uColor,uEye,uPickColor,uLabelOrigin,uLabelRight,uLabelUp;
 uniform vec2 uLabelSize;uniform float uMetal,uRough,uAlpha,uEmission,uSelected,uFade;
 uniform int uMode,uFloor,uGrid,uSurface,uHasLabel;uniform sampler2D uShadow,uLabel;
 const float PI=3.14159265;
 float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
 float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float shadow(vec3 N,vec3 L){vec3 c=vS.xyz/vS.w*.5+.5;if(c.x<0.||c.x>1.||c.y<0.||c.y>1.||c.z>1.)return 1.;float s=0.;float bias=max(.00015,.00065*(1.-max(dot(N,L),0.)));float radius=uFloor==1?2.2:1.15;for(int x=-2;x<=2;x++)for(int y=-2;y<=2;y++){float d=texture(uShadow,c.xy+vec2(x,y)*radius/2048.).r;s+=c.z-bias<d?1.:0.;}return s/25.;}
 vec3 fresnel(float h,vec3 f){return f+(1.-f)*pow(clamp(1.-h,0.,1.),5.);}
 vec3 brdf(vec3 N,vec3 V,vec3 L,vec3 base,float metal,float rough,vec3 energy){
  vec3 H=normalize(V+L);float nl=max(dot(N,L),0.),nv=max(dot(N,V),.001),nh=max(dot(N,H),0.),vh=max(dot(V,H),0.);
  float a=max(.002,rough*rough),a2=a*a,den=nh*nh*(a2-1.)+1.;float D=a2/(PI*den*den);
  float k=pow(rough+1.,2.)/8.;float G=(nv/(nv*(1.-k)+k))*(nl/(nl*(1.-k)+k));
  vec3 F=fresnel(vh,mix(vec3(.04),base,metal));vec3 spec=D*G*F/max(4.*nv*nl,.001);
  return ((1.-F)*(1.-metal)*base/PI+spec)*energy*nl;
 }
 vec3 environment(vec3 r,float rough){
  float blur=.015+rough*rough*.55;
  vec3 env=mix(vec3(.13,.15,.16),vec3(.80,.87,.93),smoothstep(-.3,.9,r.y));
  float a=max(dot(r,normalize(vec3(-2.,4.,3.))),0.);float b=max(dot(r,normalize(vec3(4.,2.,-1.))),0.);float c=max(dot(r,normalize(vec3(-1.,3.,-4.))),0.);
  env+=vec3(1.,.93,.84)*pow(a,1./blur)*3.0;
  env+=vec3(.81,.91,1.)*pow(b,1./(blur*.8))*1.5;
  env+=vec3(1.)*pow(c,1./blur)*2.;return env;
 }
 vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
 void main(){
  if(uMode==1){outColor=vec4(uPickColor,1.);return;}if(uMode==2){outColor=vec4(1.);return;}
  vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 V=normalize(uEye-vP);
  vec3 color=uColor;float rough=max(.08,uRough);
  if(uHasLabel==1){vec3 local=vP-uLabelOrigin;vec2 uv=vec2(dot(local,uLabelRight),dot(local,uLabelUp))/uLabelSize+.5;color=texture(uLabel,uv).rgb;}
  if(uSurface>0 && uHasLabel==0 && uFloor==0){
   float scale=uSurface==3?1300.:900.;float footprint=length(fwidth(vP*scale));float detail=1.-smoothstep(.3,3.,footprint);
   float n=noise(vP*scale);float variation=uSurface==2?.10:.035;color*=1.+(n-.5)*variation*detail;rough=clamp(rough+(n-.5)*.09*detail,.06,.98);
   vec3 tangent=vec3(noise(vP*scale+7.),noise(vP*scale+19.),noise(vP*scale+37.))-.5;
   N=normalize(N+tangent*(uSurface==2?.075:.017)*detail);
   if(uSurface==3){float scratches=sin(vP.x*13000.+noise(vec3(vP.y*400.,vP.z*600.,0.))*4.);rough=clamp(rough+scratches*.035*detail,.10,.85);}
  }
  vec3 base=pow(color,vec3(2.2));float nv=max(dot(N,V),.001);
  vec3 L=normalize(vec3(-2.5,4.5,3.5));float sh=shadow(N,L);
  vec3 lit=brdf(N,V,L,base,uMetal,rough,vec3(5.5,5.2,4.7))*sh;
  lit+=brdf(N,V,normalize(vec3(4.,2.8,1.)),base,uMetal,rough,vec3(1.1,1.3,1.6));
  lit+=brdf(N,V,normalize(vec3(-1.,3.5,-4.)),base,uMetal,rough,vec3(2.4,2.4,2.5));
  vec3 f0=mix(vec3(.04),base,uMetal),F=fresnel(nv,f0);vec3 R=reflect(-V,N);
  vec3 indirect=base*(1.-uMetal)*mix(vec3(.10,.12,.14),vec3(.34,.36,.37),N.y*.5+.5);
  lit+=indirect+environment(R,rough)*(F*(1.-rough*.43))*.50;
  lit+=base*uEmission;
  if(uFloor==1){vec2 q=vP.xz;float ao=1.-.23*exp(-dot(q/vec2(.38,.60),q/vec2(.38,.60)));for(int i=0;i<4;i++){vec2 c=vec2(i<2?-.38:.38,(i%2)==0?-.38:.39);ao*=1.-.34*exp(-dot((q-c)/.09,(q-c)/.09));}lit*=ao;}
  lit=pow(aces(lit*.98),vec3(1./2.2));
  if(uFloor==1)lit=mix(lit,vec3(.933,.937,.934),smoothstep(1.8,5.0,length(vP.xz)));
  lit=mix(lit,vec3(.96,.50,.16),uSelected*.27);lit=mix(lit,vec3(.72,.76,.75),uFade*.58);
  outColor=vec4(lit,uAlpha);
 }`;
 class Renderer{
  constructor(canvas,builder){
   this.canvas=canvas;this.gl=canvas.getContext('webgl2',{antialias:true,alpha:false,preserveDrawingBuffer:true});if(!this.gl)throw Error('WebGL 2를 사용할 수 없습니다. 그래픽 가속을 확인해 주세요.');
   let gl=this.gl;this.items=builder.items;this.labels=builder.labels;this.state={yaw:.68,pitch:.38,distance:2.68,target:[0,.58,0],explode:0,cover:false,labels:false,grid:false,wires:true,scan:false,rotate:false,selection:'',route:'',wireFilter:'all',light:true};this.drag=false;this.invalid=true;this.idMap=new Map();this.revMap=new Map();let counter=1;
   const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};this.program=gl.createProgram();gl.attachShader(this.program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(this.program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(this.program));
   this.u={};for(let n of ['VP','Light','Offset','Color','Eye','PickColor','Metal','Rough','Alpha','Emission','Selected','Fade','Mode','Floor','Grid','Shadow','Surface','HasLabel','Label','LabelOrigin','LabelRight','LabelUp','LabelSize'])this.u[n]=gl.getUniformLocation(this.program,'u'+n);
   for(const item of this.items){if(!this.idMap.has(item.id)){this.idMap.set(item.id,counter);this.revMap.set(counter,item.id);counter++}item.count=item.vertices.length/6;item.vao=gl.createVertexArray();gl.bindVertexArray(item.vao);let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(item.vertices),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12)}
   this.labelTextures=new Map();for(const item of this.items){if(!item.mat.label)continue;const d=item.mat.label,c=document.createElement('canvas');c.width=768;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=d.bg;ctx.fillRect(0,0,768,256);ctx.strokeStyle=d.ink;ctx.globalAlpha=.27;ctx.strokeRect(10,10,748,236);ctx.globalAlpha=1;ctx.fillStyle=d.ink;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 '+(d.text.length>18?45:64)+'px Arial, sans-serif';ctx.fillText(d.text,384,d.sub?94:128,690);if(d.sub){ctx.font='28px Arial, sans-serif';ctx.fillText(d.sub,384,177,685)}const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);this.labelTextures.set(item,tex);}gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
   gl.activeTexture(gl.TEXTURE1);const empty=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,empty);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.activeTexture(gl.TEXTURE0);
   this.lightVP=M.mul(M.ortho(-1.65,1.65,-1.65,1.65,.1,9),M.look([-2.5,4.5,3.5],[0,.3,0]));
   this.shadow=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.shadow);gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT24,2048,2048,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,null);for(const p of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,p,gl.NEAREST);for(const p of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,p,gl.CLAMP_TO_EDGE);this.shadowF=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,this.shadowF);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,this.shadow,0);gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
   this.pickF=gl.createFramebuffer();this.pickTexture=gl.createTexture();this.pickDepth=gl.createRenderbuffer();this.interaction();this.resizeObserver=new ResizeObserver(()=>{this.invalid=true});this.resizeObserver.observe(canvas);this.animate=this.animate.bind(this);requestAnimationFrame(this.animate);
  }
  offset(id){let e=this.state.explode;if(id==='DECK')return [0,e*.43,0];if(id==='COVER')return [0,e*.58,0];if(id==='BT1')return [0,-e*.07,0];if(['ML','MR','WHEEL_L','WHEEL_R'].includes(id))return [id.endsWith('L')?-e*.18:e*.18,0,0];return [0,0,0]}
  visible(item){if(item.id==='FLOOR')return true;if(item.id==='COVER'&&!this.state.cover)return false;if(item.layer==='wire'&&!this.state.wires)return false;if(item.layer==='scan'&&!this.state.scan)return false;if(item.id==='TAG'&&!this.state.scan)return false;return true;}
  setupSize(){const gl=this.gl,dpr=Math.min(window.devicePixelRatio||1,1.7);let w=Math.max(1,Math.round(this.canvas.clientWidth*dpr)),h=Math.max(1,Math.round(this.canvas.clientHeight*dpr));if(w===this.canvas.width&&h===this.canvas.height)return;this.canvas.width=w;this.canvas.height=h;gl.bindTexture(gl.TEXTURE_2D,this.pickTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.bindRenderbuffer(gl.RENDERBUFFER,this.pickDepth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);gl.bindFramebuffer(gl.FRAMEBUFFER,this.pickF);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.pickTexture,0);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,this.pickDepth);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
  draw(mode=0){let gl=this.gl,s=this.state;this.setupSize();const cp=Math.cos(s.pitch);this.eye=V.add(s.target,[Math.sin(s.yaw)*cp*s.distance,Math.sin(s.pitch)*s.distance,Math.cos(s.yaw)*cp*s.distance]);this.vp=M.mul(M.perspective(.58,this.canvas.width/this.canvas.height,.03,20),M.look(this.eye,s.target));
   gl.useProgram(this.program);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.uniform3fv(this.u.Eye,this.eye);gl.uniformMatrix4fv(this.u.Light,false,this.lightVP);gl.uniform1i(this.u.Shadow,0);gl.uniform1i(this.u.Label,1);gl.uniform1i(this.u.Grid,s.grid?1:0);
   const drawItems=(m)=>{gl.uniform1i(this.u.Mode,m);gl.uniformMatrix4fv(this.u.VP,false,m===2?this.lightVP:this.vp);let list=this.items.filter(i=>this.visible(i)&&(m!==2||(i.mat.alpha===1&&i.id!=='FLOOR'&&i.layer!=='decal')));if(m===0)list.sort((a,b)=>b.mat.alpha-a.mat.alpha);for(const it of list){let opacity=it.mat.alpha;if(m===1&&(it.id==='FLOOR'||it.layer==='scan'||it.id==='COVER'))continue;if(m===0&&opacity<1){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false)}else{gl.disable(gl.BLEND);gl.depthMask(true)}
     const id=this.idMap.get(it.id),selected=s.selection===it.id||s.route===it.id;let fade=s.route&&!selected&&it.layer==='wire'?.65:0;if(s.wireFilter!=='all'&&it.layer==='wire'){const w=window.CartDesign?.connections.find(w=>w.id===it.id);if(w&&w.kind!==s.wireFilter)fade=.84;}
     gl.uniform3fv(this.u.Offset,this.offset(it.id));gl.uniform3fv(this.u.Color,it.mat.color);gl.uniform3fv(this.u.PickColor,[(id&255)/255,((id>>8)&255)/255,((id>>16)&255)/255]);gl.uniform1f(this.u.Metal,it.mat.metal);gl.uniform1f(this.u.Rough,it.mat.rough);gl.uniform1f(this.u.Alpha,opacity);gl.uniform1f(this.u.Emission,it.mat.emissive+(s.route===it.id?.3:0));gl.uniform1f(this.u.Selected,selected?1:0);gl.uniform1f(this.u.Fade,fade);gl.uniform1i(this.u.Floor,it.id==='FLOOR'?1:0);gl.uniform1i(this.u.Surface,it.mat.surface??(it.layer==='wire'?2:it.mat.metal>.60?3:it.mat.rough>.65?2:1));gl.uniform1i(this.u.HasLabel,it.mat.label?1:0);if(it.mat.label){const t=it.mat.label;gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.labelTextures.get(it));gl.uniform3fv(this.u.LabelOrigin,t.origin);gl.uniform3fv(this.u.LabelRight,t.right);gl.uniform3fv(this.u.LabelUp,t.up);gl.uniform2fv(this.u.LabelSize,t.size);gl.activeTexture(gl.TEXTURE0);}gl.bindVertexArray(it.vao);gl.drawArrays(gl.TRIANGLES,0,it.count);
    }gl.depthMask(true);gl.disable(gl.BLEND);};
   if(mode===1){gl.bindFramebuffer(gl.FRAMEBUFFER,this.pickF);gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);drawItems(1);return;}
   if(this.shadowState!==[s.cover,s.explode,s.wires].join(',')){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,null);gl.bindFramebuffer(gl.FRAMEBUFFER,this.shadowF);gl.viewport(0,0,2048,2048);gl.clear(gl.DEPTH_BUFFER_BIT);drawItems(2);this.shadowState=[s.cover,s.explode,s.wires].join(',');}
   gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(.933,.937,.934,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.shadow);drawItems(0);this.onframe?.();
  }
  project(p,id=''){if(!this.vp)return null;let q=M.point(this.vp,V.add(p,this.offset(id)));if(q[3]<=0)return null;let x=q[0]/q[3],y=q[1]/q[3];if(Math.abs(x)>1.1||Math.abs(y)>1.1)return null;return [(x*.5+.5)*this.canvas.clientWidth,(-y*.5+.5)*this.canvas.clientHeight]}
  pick(x,y){let gl=this.gl;this.draw(1);let px=new Uint8Array(4),r=this.canvas.getBoundingClientRect();gl.readPixels(Math.floor((x-r.left)*this.canvas.width/r.width),Math.floor((r.bottom-y)*this.canvas.height/r.height),1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);gl.bindFramebuffer(gl.FRAMEBUFFER,null);this.invalid=true;return this.revMap.get(px[0]+px[1]*256+px[2]*65536)||''}
  interaction(){let pointers=new Map(),last=null,down=null;const c=this.canvas,s=this.state;
   c.addEventListener('contextmenu',e=>e.preventDefault());c.addEventListener('pointerdown',e=>{c.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);last=[e.clientX,e.clientY];down=[e.clientX,e.clientY];this.drag=true;});
   c.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const old=pointers.get(e.pointerId);if(pointers.size===2){const other=[...pointers.entries()].find(([id])=>id!==e.pointerId)[1];let d0=Math.hypot(old[0]-other[0],old[1]-other[1]),d1=Math.hypot(e.clientX-other[0],e.clientY-other[1]);if(d1>5)s.distance=Math.max(.3,Math.min(6,s.distance*d0/d1));let dx=e.clientX-old[0],dy=e.clientY-old[1];s.target[0]-=dx*.0005*s.distance;s.target[1]+=dy*.0005*s.distance;}else{let dx=e.clientX-last[0],dy=e.clientY-last[1];if(e.buttons===2||e.shiftKey){let scale=s.distance*.0006;s.target[0]-=Math.cos(s.yaw)*dx*scale;s.target[2]+=Math.sin(s.yaw)*dx*scale;s.target[1]+=dy*scale}else{s.yaw-=dx*.006;s.pitch=Math.max(-1.35,Math.min(1.50,s.pitch+dy*.006))}}pointers.set(e.pointerId,[e.clientX,e.clientY]);last=[e.clientX,e.clientY];this.invalid=true;});
   const end=e=>{if(down&&pointers.size===1&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<5)this.onpick?.(this.pick(e.clientX,e.clientY));pointers.delete(e.pointerId);this.drag=pointers.size>0;last=pointers.size?[...pointers.values()][0]:null;down=null;};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',e=>{pointers.delete(e.pointerId);this.drag=false;});c.addEventListener('wheel',e=>{e.preventDefault();s.distance=Math.max(.3,Math.min(6,s.distance*Math.exp(e.deltaY*.001)));this.invalid=true;},{passive:false});
   c.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;this.onlost?.()});
  }
  animate(){if(!this.lost&&!document.hidden){if(this.state.rotate&&!this.drag){this.state.yaw+=.003;this.invalid=true;}if(this.invalid){this.invalid=false;this.draw()}}requestAnimationFrame(this.animate)}
 }
 return {V,M,Builder,Renderer,material,color};
})();
