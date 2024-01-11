// Copyright (c) 2024 George Azmaipharashvili. All rights reserved.
// Permission is granted to HelloNova to use, modify and distribute this code.
// All other entities are prohibited from using, modifying or distributing this code without explicit permission.

precision mediump float;

uniform float time;
uniform vec2 resolution;

vec2 hash2(vec2 p) {
   return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3)))) * 5232.85324);   
}

float noise(vec2 p) {
    const float kF = 2.0;
    vec2 i = floor(p);
	vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(sin(kF*dot(p, hash2(i+vec2(0,0)))),
               	   sin(kF*dot(p, hash2(i+vec2(1,0)))),f.x),
               mix(sin(kF*dot(p, hash2(i+vec2(0,1)))),
               	   sin(kF*dot(p, hash2(i+vec2(1,1)))),f.x),f.y);
}

float fabric(vec2 p) {
    const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    float f = 0.0;
    f = 0.5 * noise(p); p = m * p;
    f += 0.35 * noise(p); p = m * p;
    f += 0.1 * noise(p); p = m * p;
    f += 0.05 * noise(p); p = m * p;
    return f;
}

float fbm(vec2 x) {
    float t = time * 0.1;
    x += vec2(0.25, 0.15) * noise(x * 2.0 - t);
    float noise = fabric(x * vec2(0.5, 2.0)) * 0.5 + 0.5;
    return noise * noise;
}

vec3 palette(float x) {
    return (sin(3.0 - vec3(2.15, -0.5, 1.2) - x * 2.) * 0.5 + 0.5);
}

float aurora(vec2 x) {
    float a = fbm(x);
    return a;
}

vec3 get_normal(vec2 uv) {
    vec2 e = vec2(0.1, 0);
    float nx = (aurora(uv - e.xy) - aurora(uv + e.xy)) / (2.0 * e.x);
    float ny = (aurora(uv - e.yx) - aurora(uv + e.yx)) / (2.0 * e.x);
    vec3 n = normalize(vec3(nx, ny, -1.));
    return n;
}

vec3 hue_shift(vec3 c, float s){
    return c * mat3(c += .33 - (c = vec3(cos(s), s = -sin(s) * .6, -s)).x / 3., c.zxy, c.yzx);
}

vec4 aurora_col(vec2 x) {
    // x.y = abs(x.y);
    x *= vec2(1.0, 1.5);
    float t = time * 0.1;
    vec3 n = get_normal(x);
    float a = aurora(x);
    float bands = 0.5 + 0.5 * fabric(x * vec2(12.0, 0.0) + vec2(0.0, t));
    bands *= bands;
    float y = max(0.0, n.y);
    vec4 col = vec4(palette(a), a * (0.2 + y * y * 0.8));
    col.a *= a + bands * y;
    col.a *= 64.0 / (1.0 + a * 32.0);
    float h = pow(col.a, 4.0) * 0.5;
    col.rgb *= 1.0 + h;
    col.a = sqrt(col.a);
    // col.a = 1.0;
    // col.rgb = vec3(a);
    return col; 
}

void main()
{
    float min_res = min(resolution.x, resolution.y);
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min_res;
    gl_FragColor = aurora_col(uv);
}