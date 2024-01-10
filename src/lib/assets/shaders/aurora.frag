// Copyright (c) 2024 George Azmaipharashvili. All rights reserved.
// Permission is granted to HelloNova to use, modify and distribute this code.
// All other entities are prohibited from using, modifying or distributing this code without explicit permission.

precision mediump float;

uniform float time;
uniform vec2 resolution;

vec2 hash2(vec2 p) {
   return fract(sin(vec2(dot(p, vec2(123.4, 748.6)), dot(p, vec2(547.3, 659.3)))) * 5232.85324);   
}

vec3 hash3(vec2 p)
{
    vec3 q = vec3(dot(p,vec2(127.1,311.7)), 
				   dot(p,vec2(269.5,183.3)), 
				   dot(p,vec2(419.2,371.9)));
	return fract(sin(q) * 43758.5453);
}

float worley(vec2 x)
{
    vec2 p = floor(x);
    vec2 f = fract(x);
	float va = 1.0;
    for(int j = -1; j <= 1; j++) 
    for(int i = -1; i <= 1; i++)
    {
        vec2 g = vec2(i, j);
		vec2 r = g - f + hash2(p + g);
		va = min(dot(r, r), va);
    }
    return va;
}

float noise(vec2 p) {
    const float kF = 2.0;
    vec2 i = floor(p);
	vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(sin(kF*dot(p, hash2(i+vec2(0,0)))),
               	   sin(kF*dot(p, hash2(i+vec2(1,0)))),f.x),
               mix(sin(kF*dot(p, hash2(i+vec2(0,1)))),
               	   sin(kF*dot(p, hash2(i+vec2(1,1)))),f.x),f.y) * 0.5 + 0.5;
}

float fabric(vec2 p) {
    const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    float f = 0.0;
    f = 0.4 * noise(p); p = m * p;
    f += 0.2 * noise(p); p = m * p;
    f += 0.1 * noise(p); p = m * p;
    f += 0.05 * noise(p); p = m * p;
    return f;
}

float fbm(vec2 x) {
    float t = time * 0.1;
    x *= 1.0 + fabric(97.3 + x - t);
    return worley(x + t + 3.0 * fabric(x * 0.5 - t - fabric(x * 0.5 + sin(t)))); 
}

vec3 palette(float x) {
    return (sin(3.0 - vec3(2.15, -0.5, 1.2) - x * 2.) * 0.5 + 0.5);
}
vec2 rot_2d(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, s, -s, c);
	return m * v;
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

vec4 aurora_col(vec2 x) {
    float t = time * 0.1;
    vec3 n = get_normal(x);
    float a = aurora(x);
    float bands = fabric(x * vec2(12.0, a) + vec2(0.0, t));
    bands *= bands;
    vec4 col = vec4(palette(a), 1.5 * sqrt(a) * n.y);
    col.a *= min(bands + 0.3 * a * a, 1.0);
    // col.a *= 2.0;
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