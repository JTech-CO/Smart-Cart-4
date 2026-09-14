#!/usr/bin/env python3
"""Compile the shipped GLSL ES sources and test draw/pick pixels in a headless EGL
OpenGL ES context. This is NOT execution of the JavaScript WebGL2 renderer."""
import ctypes as C,json,re,os,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];results=[];info={}
def check(name,ok,detail=None):results.append({'name':name,'status':'PASS' if ok else 'FAIL','detail':detail})
def main():
    os.environ.setdefault('LIBGL_ALWAYS_SOFTWARE','1');os.environ.setdefault('EGL_PLATFORM','surfaceless')
    try:
        E=C.CDLL('libEGL.so.1');G=C.CDLL('libGL.so.1');I=C.c_int;U=C.c_uint;P=C.c_void_p;F=C.c_float
        def fn(lib,name,rest,args):
            x=getattr(lib,name);x.restype=rest;x.argtypes=args;return x
        display=fn(E,'eglGetPlatformDisplay',P,[U,P,C.POINTER(I)])(0x31DD,None,None);a=I();b=I()
        if not fn(E,'eglInitialize',U,[P,C.POINTER(I),C.POINTER(I)])(display,C.byref(a),C.byref(b)):raise RuntimeError('No surfaceless EGL display')
        fn(E,'eglBindAPI',U,[U])(0x30A0);cfg=P();n=I();attrs=(I*9)(0x3040,0x40,0x3033,1,0x3024,8,0x3023,8,0x3038)
        if not fn(E,'eglChooseConfig',U,[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)])(display,attrs,C.byref(cfg),1,C.byref(n)) or n.value<1:raise RuntimeError('No GLES3 pbuffer configuration')
        surf=fn(E,'eglCreatePbufferSurface',P,[P,P,C.POINTER(I)])(display,cfg,(I*5)(0x3057,32,0x3056,32,0x3038))
        ctx=fn(E,'eglCreateContext',P,[P,P,P,C.POINTER(I)])(display,cfg,None,(I*3)(0x3098,3,0x3038))
        if not ctx or not fn(E,'eglMakeCurrent',U,[P,P,P,P])(display,surf,surf,ctx):raise RuntimeError('Unable to create current GLES3 context')
        getstr=fn(G,'glGetString',C.c_char_p,[U]);info.update(version=getstr(0x1F02).decode(),renderer=getstr(0x1F01).decode());check('Headless OpenGL ES context',True,info)
        create=fn(G,'glCreateShader',U,[U]);sourcefn=fn(G,'glShaderSource',None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)]);compilefn=fn(G,'glCompileShader',None,[U]);statusfn=fn(G,'glGetShaderiv',None,[U,U,C.POINTER(I)]);logfn=fn(G,'glGetShaderInfoLog',None,[U,I,C.POINTER(I),P]);shaders=[]
        text=(ROOT/'js/engine.js').read_text()
        for name,typ in [('VS',0x8B31),('FS',0x8B30)]:
            src=re.search(r'const '+name+r'=`(.*?)`;',text,re.S).group(1).encode();shader=create(typ);p=C.c_char_p(src);sourcefn(shader,1,C.byref(p),None);compilefn(shader);ok=I();statusfn(shader,0x8B81,C.byref(ok));buf=C.create_string_buffer(16384);logfn(shader,16384,None,buf);check(name+' GLSL ES source compiles',bool(ok.value),buf.value.decode());shaders.append(shader)
        prog=fn(G,'glCreateProgram',U,[])();attach=fn(G,'glAttachShader',None,[U,U]);[attach(prog,s) for s in shaders];fn(G,'glLinkProgram',None,[U])(prog);ok=I();fn(G,'glGetProgramiv',None,[U,U,C.POINTER(I)])(prog,0x8B82,C.byref(ok));check('GLSL program links',bool(ok.value))
        if not ok.value:raise RuntimeError('Shader link failed')
        fn(G,'glUseProgram',None,[U])(prog);loc=fn(G,'glGetUniformLocation',I,[U,C.c_char_p]);u=lambda name:loc(prog,('u'+name).encode())
        mfn=fn(G,'glUniformMatrix4fv',None,[I,I,C.c_ubyte,C.POINTER(F)]);identity=(F*16)(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);mfn(u('VP'),1,0,identity);mfn(u('Light'),1,0,identity)
        v3=fn(G,'glUniform3f',None,[I,F,F,F]);uf=fn(G,'glUniform1f',None,[I,F]);ui=fn(G,'glUniform1i',None,[I,I]);v3(u('Offset'),0,0,0);v3(u('PickColor'),17/255,29/255,53/255);v3(u('Color'),.26,.36,.42);v3(u('Eye'),0,0,2)
        for k,v in {'Metal':.4,'Rough':.45,'Alpha':1.,'Emission':0.,'Selected':0.,'Fade':0.}.items():uf(u(k),v)
        for k,v in {'Mode':1,'Floor':0,'Grid':0,'Surface':0,'HasLabel':0,'Shadow':0,'Label':1}.items():ui(u(k),v)
        vao=U();fn(G,'glGenVertexArrays',None,[I,C.POINTER(U)])(1,C.byref(vao));fn(G,'glBindVertexArray',None,[U])(vao)
        buf=U();fn(G,'glGenBuffers',None,[I,C.POINTER(U)])(1,C.byref(buf));fn(G,'glBindBuffer',None,[U,U])(0x8892,buf);verts=(F*18)(-.8,-.8,0,0,0,1,.8,-.8,0,0,0,1,0,.8,0,0,0,1);fn(G,'glBufferData',None,[U,C.c_size_t,P,U])(0x8892,C.sizeof(verts),verts,0x88E4)
        attrib=fn(G,'glVertexAttribPointer',None,[U,I,U,C.c_ubyte,I,P]);enable=fn(G,'glEnableVertexAttribArray',None,[U]);enable(0);enable(1);attrib(0,3,0x1406,0,24,None);attrib(1,3,0x1406,0,24,P(12));fn(G,'glViewport',None,[I,I,I,I])(0,0,32,32)
        clear=fn(G,'glClear',None,[U]);fn(G,'glClearColor',None,[F,F,F,F])(0,0,0,1);clear(0x4000);draw=fn(G,'glDrawArrays',None,[U,I,I]);draw(4,0,3);pixel=(C.c_ubyte*4)();read=fn(G,'glReadPixels',None,[I,I,I,I,U,U,P]);read(16,16,1,1,0x1908,0x1401,pixel);check('Picking shader encodes reference RGB',all(abs(pixel[i]-v)<=1 for i,v in enumerate([17,29,53])),list(pixel))
        ui(u('Mode'),0);clear(0x4000);draw(4,0,3);read(16,16,1,1,0x1908,0x1401,pixel);check('Material shader produces lit fragment',max(pixel[:3])>20 and list(pixel[:3])!=[17,29,53],list(pixel));error=fn(G,'glGetError',U,[])();check('No OpenGL ES API error after shader tests',error==0,error)
        fn(E,'eglMakeCurrent',U,[P,P,P,P])(display,None,None,None);fn(E,'eglDestroyContext',U,[P,P])(display,ctx);fn(E,'eglDestroySurface',U,[P,P])(display,surf);fn(E,'eglTerminate',U,[P])(display)
    except OSError as e:results.append({'name':'EGL/GLES dependency availability','status':'NOT_RUN','detail':str(e)})
    except Exception as e:check('Shader regression execution',False,str(e))
    report={'scope':'Exact VS/FS source compile/link and test-triangle drawing in EGL GLES, not browser WebGL, full-scene rendering or hardware GPU performance.','environment':info,'checks':results};(ROOT/'docs/shader-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));return any(x['status']=='FAIL' for x in results)
if __name__=='__main__':sys.exit(main())
