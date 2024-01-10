import{s as I,n as g,o as q,b as G}from"../chunks/scheduler.e108d1fd.js";import{S as N,i as O,g as x,h as b,j as _,f as p,k as h,a as U,r as R,s as M,u as D,c as j,x as k,v as E,d as z,t as C,w as T}from"../chunks/index.7cf2deec.js";function H(i){let n;return{c(){n=x("canvas"),this.h()},l(o){n=b(o,"CANVAS",{id:!0}),_(n).forEach(p),this.h()},h(){h(n,"id","background-shader")},m(o,s){U(o,n,s),i[3](n)},p:g,i:g,o:g,d(o){o&&p(n),i[3](null)}}}function V(i,n,o){let{frag:s=""}=n,{vert:l=""}=n,t,e,r,c=performance.now();const f=[-1,-1,1,-1,-1,1,1,1];let u;function d(){if(t&&(o(0,t.width=window.innerWidth,t),o(0,t.height=window.innerHeight,t),r&&e)){const a=r.getUniformLocation(e,"resolution");r.uniform2f(a,t.width,t.height),r.viewport(0,0,t.width,t.height)}}q(()=>{if(r=t.getContext("webgl"),!r){console.error("WebGL is not supported in this browser.");return}return u=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,u),r.bufferData(r.ARRAY_BUFFER,new Float32Array(f),r.STATIC_DRAW),r.enable(r.BLEND),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA),c=performance.now(),window.addEventListener("resize",d),S(l,s),()=>{window.removeEventListener("resize",d)}});function S(a,y){if(y||(y="precision mediump float;void main() {gl_FragColor=vec4(1);}"),a||(a="attribute vec4 a_position;void main() {gl_Position = a_position;}"),!r)return;const v=r.createShader(r.FRAGMENT_SHADER);if(!v){console.error("Could not create fragment shader"),r.deleteShader(v);return}if(r.shaderSource(v,y),r.compileShader(v),!r.getShaderParameter(v,r.COMPILE_STATUS)){const A=r.getShaderInfoLog(v);console.error("Fragment shader compilation error:",A)}const m=r.createShader(r.VERTEX_SHADER);if(!m){console.error("Could not create vertex shader"),r.deleteShader(m);return}if(r.shaderSource(m,a),r.compileShader(m),!r.getShaderParameter(m,r.COMPILE_STATUS)){const A=r.getShaderInfoLog(m);console.error("Vertex shader compilation error:",A)}if(e&&(r.deleteProgram(e),e=null),e=r.createProgram(),!e){console.error("Could not create shader program");return}r.attachShader(e,v),r.attachShader(e,m),r.linkProgram(e),r.deleteShader(v),r.deleteShader(m),r.useProgram(e);const F=r.getAttribLocation(e,"a_position");r.enableVertexAttribArray(F),r.vertexAttribPointer(F,2,r.FLOAT,!1,0,0),d(),w()}function w(){if(!(t&&r&&e))return;r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.useProgram(e),r.bindBuffer(r.ARRAY_BUFFER,u),r.drawArrays(r.TRIANGLE_STRIP,0,4);const a=r.getUniformLocation(e,"time");a&&r.uniform1f(a,(performance.now()-c)/1e3),requestAnimationFrame(w)}function B(a){G[a?"unshift":"push"](()=>{t=a,o(0,t)})}return i.$$set=a=>{"frag"in a&&o(1,s=a.frag),"vert"in a&&o(2,l=a.vert)},i.$$.update=()=>{i.$$.dirty&6&&S(l,s)},[t,s,l,B]}class L extends N{constructor(n){super(),O(this,n,V,H,I,{frag:1,vert:2})}}const P=`attribute vec4 a_position;\r
\r
void main() {\r
    gl_Position = a_position;\r
}`,Q=`// Copyright (c) 2024 George Azmaipharashvili. All rights reserved.\r
// Permission is granted to HelloNova to use, modify and distribute this code.\r
// All other entities are prohibited from using, modifying or distributing this code without explicit permission.\r
\r
precision mediump float;\r
\r
uniform float time;\r
uniform vec2 resolution;\r
\r
const float BLOOM = 1.;\r
const float STAR_ANIMATION_SPEED = .25;\r
\r
const float TAU = 6.283185307;\r
\r
float hash21(vec2 p)\r
{\r
	vec3 p3  = fract(vec3(p.xyx) * .1031);\r
    p3 += dot(p3, p3.yzx + 33.33);\r
    return fract((p3.x + p3.y) * p3.z);\r
}\r
\r
vec2 rand(vec2 p)\r
{\r
    p -= 0.9;\r
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));\r
    p3 += dot(p3, p3.yzx+33.33);\r
    return fract((p3.xx+p3.yz)*p3.zy) * 2.0 - 1.0;\r
}\r
\r
float noise(vec2 p)\r
{\r
    const float kF = 3.0;\r
    vec2 i = floor(p);\r
	vec2 f = fract(p);\r
    f = f*f*(3.0-2.0*f);\r
    return mix(mix(sin(kF*dot(p, rand(i+vec2(0,0)))),\r
               	   sin(kF*dot(p, rand(i+vec2(1,0)))),f.x),\r
               mix(sin(kF*dot(p, rand(i+vec2(0,1)))),\r
               	   sin(kF*dot(p, rand(i+vec2(1,1)))),f.x),f.y) * 0.5 + 0.5;\r
}\r
\r
vec2 rot2D(vec2 v, float a) {\r
	float s = sin(a);\r
	float c = cos(a);\r
	mat2 m = mat2(c, s, -s, c);\r
	return m * v;\r
}\r
\r
float luma(vec3 color) {\r
  return dot(color, vec3(0.299, 0.587, 0.114));\r
}\r
\r
vec3 hue_shift(vec3 col, float hue) {\r
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);\r
    float cosa = cos(hue);\r
    return vec3(col * cosa + cross(k, col) * sin(hue) + k * dot(k, col) * (1.0 - cosa));\r
}\r
\r
vec3 aces(vec3 x) {\r
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);\r
}\r
\r
float aces(float x) {\r
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);\r
}\r
\r
float star(vec2 uv, float s) {\r
    uv *= 2.5;\r
    float a = atan(uv.x, uv.y);\r
    vec2 v = vec2(cos(a), sin(a));\r
    float s1 = smoothstep(1., 0.3, abs(dot(v, uv)) * 2. * sqrt(s) + smoothstep(-0.1, 1.2, 0.8 * length(uv)));\r
    v = vec2(cos(a + TAU * 0.25), sin(a + TAU * 0.25));\r
    float s2 = smoothstep(1., 0.5, abs(dot(v, uv)) * 2.5 * sqrt(s) + length(uv) * 1.5);\r
    float sm = mix(s1, 1., s2);\r
    return sm + max(0.0, 1. - sm - sqrt(length(uv * .5)) * 1.2);\r
}\r
\r
vec3 scol(float n) {\r
    const float D = 1.0 / 6.0;\r
    if (n <= D) {\r
        return vec3(.917, .153, .760);\r
    } else if (n <= D * 2.0) {\r
        return vec3(.733, .160, .733);\r
    } else if (n <= D * 3.0) {\r
        return vec3(.607, .149, .714);\r
    } else if (n <= D * 4.0) {\r
        return vec3(.255, .560, .870);\r
    } else if (n <= D * 5.0) {\r
        return vec3(.172, .835, .769);\r
    } else {\r
        return vec3(.278, .843, .674);\r
    }\r
}\r
\r
vec3 lcol(float n) {\r
    const float D = 1.0 / 4.0;\r
    if (n <= D) {\r
        return vec3(.172, .122, .999);\r
    } else if (n <= D * 2.0) {\r
        return vec3(.255, .560, .870);\r
    } else if (n <= D * 3.0) {\r
        return vec3(.278, .843, .674);\r
    } else {\r
        return vec3(.917, .153, .760);\r
    }\r
}\r
\r
vec3 star_layer(vec2 uv, float t) {\r
    uv *= 0.7;\r
    vec3 col = vec3(0);\r
    vec2 gv = fract(uv);\r
    vec2 id = floor(uv);\r
\r
    for(int y = -1; y <= 1; y++) {\r
        for(int x = -1; x <= 1; x++) {\r
            vec2 offs = vec2(x, y);\r
            float n = hash21(id + offs);\r
            n *= n;\r
            vec2 p = gv - offs - vec2(n, fract(n * 34.)) + .5;\r
            float m = 1.0 + 0.03 * sin(t * 6. + n) + length(uv) * 0.1;\r
            m /= n + 0.3;\r
            p *= m;\r
            float s = star(p, 1. / m);\r
            vec3 color = scol(hash21(id + offs - 65.31));\r
            color += max(0.0, 1. - 10. * pow(length(p), 1.3)) * .6;\r
            s *= 0.5 + 0.5 * sin(n * TAU + t);\r
            col += s * color;\r
        }\r
    }\r
    return col;\r
}\r
\r
vec4 orb(vec2 uv, float t, float min_res) {\r
    /// Initial  Orb\r
    float l = dot(uv, uv);\r
    float f = 24.0 / min_res;\r
    float mask = smoothstep(1.0 + f, 1.0 - f, l);\r
    float alpha = sqrt(l) * mask;\r
    vec4 col = vec4(vec3(0.05, 0.05, .5), alpha);\r
    if (alpha > 0.0) {\r
        vec3 n = normalize(vec3(uv, sqrt(abs(1.0 - l))));\r
        col.rgb -= mask * n * 0.2;\r
\r
        /// Reflections\r
        float ls = sqrt(l);\r
        vec3 nr = vec3(normalize(uv), n.z);\r
        nr.xy = rot2D(nr.xy, -t);\r
        float r = mask * noise(nr.xy * l * ls * 2.) * .5;\r
        r *= smoothstep(0.9, 0.8, ls);\r
        col.a += r;\r
        col.rgb += r * r;\r
\r
        nr.xy = rot2D(nr.xy, t * 1.2);\r
        r = noise(nr.xy * l) * 0.5 + noise(nr.xy * l * l + 31.61) * 0.5;\r
        col.rgb += 0.5 * mask * r * r * r * vec3(0.6, 1, 0.6) * smoothstep(0.6, 0.4, l);\r
        col.a += mask * smoothstep(0.5, 1., r);\r
\r
        nr.xy = rot2D(nr.xy, -t * 1.3);\r
        r = noise(nr.xy * l - 1361.26);\r
        col.rgb += mask * r * r * r * r * vec3(0.6, 0.5, 1) * smoothstep(0.4, 0.2, l);\r
        col.rgb = hue_shift(col.rgb, mask * -0.3 * r * r * r);\r
\r
        nr.xy = rot2D(nr.xy, t * 1.45);\r
        r = noise(nr.xy * l - 513.26);\r
        col.rgb += 0.5 * mask * pow(r, 4.);\r
        col.rgb = hue_shift(col.rgb, mask * -r * r);\r
        col.a += mask * smoothstep(0.5, 1., r);\r
\r
        nr.xy = rot2D(nr.xy, -t);\r
        r = smoothstep(0.4, 1.5, noise(nr.xy * (0.5 + l) - 33.));\r
        float a = mask * 16. * r * smoothstep(0.2, 0.1, l) * l;\r
        col.a += a;\r
        col.rgb += a * .25;\r
\r
        nr.xy = rot2D(nr.xy, -t * 2.4);\r
        r = noise(nr.xy * l + 221.126) * 0.35;\r
        col.rgb = hue_shift(col.rgb, mask * r);\r
        col.rgb += r * r * r * r * 0.25;\r
        col.a += mask * r / (1. + l);\r
        col.a = aces(col.a);\r
        col.rgb *= abs(col.rgb);\r
        col.rgb = aces(col.rgb * 0.8) * 1.1;\r
        col.a *= smoothstep(-0.3, 0.2, l);\r
\r
        /// Stars\r
        const float STAR_FREQ = 12.;\r
        float ts = t * STAR_ANIMATION_SPEED;\r
        float ani = fract(ts);\r
        \r
        vec2 sn = vec2(cos(ts), sin(ts)) * noise(vec2(ts) * 0.3) * 0.1;\r
        vec2 sv = n.xy / (ani + 2.) + sn;\r
        vec3 stars1 = star_layer(sv * STAR_FREQ, t);\r
\r
        sv = n.xy / (ani + 1.) + sn;\r
        vec3 stars2 = star_layer(sv * STAR_FREQ, t);\r
        vec3 stars = mix(stars1, stars2, ani);\r
\r
        col.rgb = mix(col.rgb, stars, min(1.0, length(stars) * n.z * n.z * n.z * n.z * n.z * n.z * 2.));\r
        col.a += mask * length(stars) * n.z * n.z * n.z * n.z;\r
\r
        col.rgb += mask * 0.25 * pow(l + 0.05, 4.);\r
        col.a += mask * pow(l + 0.1, 8.);\r
        \r
        r = noise(uv * l * 1.5 - 513.26 + t * 0.2) - 0.5;\r
        col.rgb = hue_shift(col.rgb, mask * r);\r
\r
        float df = mask * smoothstep(0.9 - f, 0.9 + f, l);\r
        col.rgb = hue_shift(col.rgb, df * (2.5 * smoothstep(-f, f, uv.x * cos(t * 0.4) - uv.y * sin(t * 0.4)) - 1. + col.g * 2. - col.r));\r
    } \r
    \r
    if (alpha < 1.) {\r
        float glow = (1.0 - mask) * (2. - l);\r
        col.a += glow * .8;\r
        col.rgb += glow * glow * glow * 0.4;\r
    }\r
\r
    return col;\r
}\r
\r
vec4 lines(vec2 uv, float t) {\r
    if (dot(uv, uv) < 1.) \r
        return vec4(0);\r
    const float N = 24.0;\r
    const float G = N / 4.;\r
    t *= 0.4;\r
    vec4 col = vec4(0);\r
    vec2 nv = normalize(uv);\r
    for (float i = 0.; i < N; ++i) {\r
        float j = mod(i, G);\r
        float k = floor(i / G);\r
        float d = max(0., noise(nv * .4 + t - j * 0.02 - k * 32.) * 2. - 1.25) * 0.2 * (j / G + 0.5);\r
        float m = 1. + d * d * 30.;\r
        float mask = smoothstep(0.01 * m, 0.0, distance(nv * (1.0 + d), uv));\r
        col.rgb += lcol(i / N) * mask / m;\r
    }\r
    return col;\r
}\r
\r
void main()\r
{\r
    float min_res = min(resolution.x, resolution.y);\r
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min_res * 1.25;\r
    if (dot(uv, uv) > 2.) discard;\r
    float t = time * 0.75;\r
\r
    vec3 col = vec3(0);\r
    vec4 orb = orb(uv, t, min_res);    \r
    col.rgb += orb.rgb * orb.a;\r
    gl_FragColor.a += orb.a;\r
\r
    vec4 li = lines(uv, t);   \r
\r
    float f = 48.0 / min_res;\r
    float mask = smoothstep(1.0 + f, 1.0, dot(uv, uv));\r
\r
    col.rgb = mix(li.rgb, col.rgb, clamp(mask * orb.a, 0.0, 1.0));\r
    col.rgb += orb.rgb * (1.0 - mask) * orb.a * BLOOM;\r
    \r
    gl_FragColor.a = max(gl_FragColor.a, li.a);\r
\r
    gl_FragColor.rgb = col;\r
}`,W=`// Copyright (c) 2024 George Azmaipharashvili. All rights reserved.\r
// Permission is granted to HelloNova to use, modify and distribute this code.\r
// All other entities are prohibited from using, modifying or distributing this code without explicit permission.\r
\r
precision mediump float;\r
\r
uniform float time;\r
uniform vec2 resolution;\r
\r
vec2 hash2(vec2 p) {\r
   return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3)))) * 5232.85324);   \r
}\r
\r
vec3 hash3(vec2 p)\r
{\r
    vec3 q = vec3(dot(p,vec2(127.1,311.7)), \r
				   dot(p,vec2(269.5,183.3)), \r
				   dot(p,vec2(419.2,371.9)));\r
	return fract(sin(q) * 43758.5453);\r
}\r
\r
float worley(vec2 x)\r
{\r
    vec2 p = floor(x);\r
    vec2 f = fract(x);\r
	float va = 1.0;\r
    for(int j = -1; j <= 1; j++) \r
    for(int i = -1; i <= 1; i++)\r
    {\r
        vec2 g = vec2(i, j);\r
		vec2 r = g - f + hash2(p + g);\r
		va = min(dot(r, r), va);\r
    }\r
    return va;\r
}\r
\r
float noise(vec2 p) {\r
    const float kF = 2.0;\r
    vec2 i = floor(p);\r
	vec2 f = fract(p);\r
    f = f*f*(3.0-2.0*f);\r
    return mix(mix(sin(kF*dot(p, hash2(i+vec2(0,0)))),\r
               	   sin(kF*dot(p, hash2(i+vec2(1,0)))),f.x),\r
               mix(sin(kF*dot(p, hash2(i+vec2(0,1)))),\r
               	   sin(kF*dot(p, hash2(i+vec2(1,1)))),f.x),f.y) * 0.5 + 0.5;\r
}\r
\r
float fabric(vec2 p) {\r
    const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);\r
    float f = 0.0;\r
    f = 0.4 * noise(p); p = m * p;\r
    f += 0.2 * noise(p); p = m * p;\r
    f += 0.1 * noise(p); p = m * p;\r
    f += 0.05 * noise(p); p = m * p;\r
    return f;\r
}\r
\r
float fbm(vec2 x) {\r
    float t = time * 0.1;\r
    x *= 1.0 + fabric(97.3 + x - t);\r
    return worley(x + t + 3.0 * fabric(x * 0.5 - t - fabric(x * 0.5 + sin(t)))); \r
}\r
\r
vec3 palette(float x) {\r
    return (sin(3.0 - vec3(2.15, -0.5, 1.2) - x * 2.) * 0.5 + 0.5);\r
}\r
\r
float aurora(vec2 x) {\r
    vec2 p = x;\r
    float a = fbm(p);\r
    return a;\r
}\r
\r
vec3 get_normal(vec2 uv) {\r
    vec2 e = vec2(0.1, 0);\r
    float nx = (aurora(uv - e.xy) - aurora(uv + e.xy)) / (2.0 * e.x);\r
    float ny = (aurora(uv - e.yx) - aurora(uv + e.yx)) / (2.0 * e.x);\r
    vec3 n = normalize(vec3(nx, ny, -1.));\r
    return n;\r
}\r
\r
vec4 aurora_col(vec2 x) {\r
    vec3 n = get_normal(x);\r
    float a = aurora(x);\r
    float bands = fabric(x * vec2(12.0, a) + vec2(0.0, time * 0.1)) + 0.5 * a;\r
    vec4 col = vec4(palette(a), sqrt(a) * n.y);\r
    col.a *= min(bands * bands, 1.0);\r
    // col.a = 1.0;\r
    // col.rgb = vec3(fbm(x));\r
    return col; \r
}\r
\r
void main()\r
{\r
    float min_res = min(resolution.x, resolution.y);\r
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min_res * 1.25;\r
    gl_FragColor = aurora_col(uv);\r
}`;function Y(i){let n,o,s,l,t,e,r;return s=new L({props:{frag:W,vert:P}}),e=new L({props:{frag:Q,vert:P}}),{c(){n=x("div"),o=x("div"),R(s.$$.fragment),l=M(),t=x("div"),R(e.$$.fragment),this.h()},l(c){n=b(c,"DIV",{class:!0});var f=_(n);o=b(f,"DIV",{id:!0,class:!0});var u=_(o);D(s.$$.fragment,u),u.forEach(p),l=j(f),t=b(f,"DIV",{id:!0,class:!0});var d=_(t);D(e.$$.fragment,d),d.forEach(p),f.forEach(p),this.h()},h(){h(o,"id","aurora"),h(o,"class","svelte-18dfary"),h(t,"id","orb"),h(t,"class","svelte-18dfary"),h(n,"class","shaders svelte-18dfary")},m(c,f){U(c,n,f),k(n,o),E(s,o,null),k(n,l),k(n,t),E(e,t,null),r=!0},p:g,i(c){r||(z(s.$$.fragment,c),z(e.$$.fragment,c),r=!0)},o(c){C(s.$$.fragment,c),C(e.$$.fragment,c),r=!1},d(c){c&&p(n),T(s),T(e)}}}class J extends N{constructor(n){super(),O(this,n,null,Y,I,{})}}export{J as component};
