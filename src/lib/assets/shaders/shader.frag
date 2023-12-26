// Copyright (c) 2024 George Azmaipharashvili. All rights reserved.
// Permission is granted to HelloNova to use, modify and distribute this code.
// All other entities are prohibited from using, modifying or distributing this code without explicit permission.

precision highp float;

uniform float time;
uniform vec2 resolution;

const float BLOOM = 1.;
const float STAR_ANIMATION_SPEED = .25;

const float TAU = 6.283185307;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float rand2D(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 rand(vec2 p)
{
	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
	return 2.0*fract(sin(p)*43758.5453123) - 1.0;
}

float noise(vec2 p)
{
	vec2 i = floor(p + (p.x+p.y)*0.366025404);
    vec2 a = p - i + (i.x+i.y)*0.211324865;
    float m = step(a.y,a.x); 
    vec2 o = vec2(m,1.0-m);
    vec2 b = a - o + 0.211324865;
	vec2 c = a - 1.0 + 2.0*0.211324865;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0);
	vec3 n = h*h*h*h*vec3( dot(a,rand(i+0.0)), dot(b,rand(i+o)), dot(c,rand(i+1.0)));
    return dot(n, vec3(70))*.5+.5;
}

vec2 rot2D(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, s, -s, c);
	return m * v;
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 hue_shift(vec3 col, float hue) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosa = cos(hue);
    return vec3(col * cosa + cross(k, col) * sin(hue) + k * dot(k, col) * (1.0 - cosa));
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

float star(vec2 uv, float s) {
    uv *= 2.5;
    float a = atan(uv.x, uv.y);
    vec2 v = vec2(cos(a), sin(a));
    float s1 = smoothstep(1., 0.3, abs(dot(v, uv)) * 2. * sqrt(s) + smoothstep(-0.1, 1.2, 0.8 * length(uv)));
    v = vec2(cos(a + TAU * 0.25), sin(a + TAU * 0.25));
    float s2 = smoothstep(1., 0.5, abs(dot(v, uv)) * 2.5 * sqrt(s) + length(uv) * 1.6);
    float sm = mix(s1, 1., s2);
    return sm + max(0.0, 1. - sm - sqrt(length(uv * .5)) * 1.2);
}

vec3 scol(float n) {
    const vec3 STAR_COLOR1 = vec3(.917, .153, .760);
    const vec3 STAR_COLOR2 = vec3(.733, .160, .733);
    const vec3 STAR_COLOR3 = vec3(.607, .149, .714);
    const vec3 STAR_COLOR4 = vec3(.255, .560, .870);
    const vec3 STAR_COLOR5 = vec3(.172, .835, .769);
    const vec3 STAR_COLOR6 = vec3(.278, .843, .674);
    const float D = 1.0 / 6.0;
    if (n <= D) {
        return STAR_COLOR1;
    } else if (n <= D * 2.0) {
        return STAR_COLOR2;
    } else if (n <= D * 3.0) {
        return STAR_COLOR3;
    } else if (n <= D * 4.0) {
        return STAR_COLOR4;
    } else if (n <= D * 5.0) {
        return STAR_COLOR5;
    } else {
        return STAR_COLOR6;
    }
}

vec3 lcol(float n) {
    const vec3 LINE_COLOR1 = vec3(.172, .122, .999);
    const vec3 LINE_COLOR2 = vec3(.255, .560, .870);
    const vec3 LINE_COLOR3 = vec3(.278, .843, .674);
    const vec3 LINE_COLOR4 = vec3(.917, .153, .760);
    const float D = 1.0 / 4.0;
    if (n <= D) {
        return LINE_COLOR1;
    } else if (n <= D * 2.0) {
        return LINE_COLOR2;
    } else if (n <= D * 3.0) {
        return LINE_COLOR3;
    } else {
        return LINE_COLOR4;
    }
}

vec3 star_layer(vec2 uv, float t) {
    vec3 col = vec3(0);
    vec2 gv = fract(uv);
    vec2 id = floor(uv);

    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 offs = vec2(x, y);
            float n = hash21(id + offs);
            vec2 p = gv - offs - vec2(n, fract(n * 34.)) + .5;
            float m = .5 + 0.03 * sin(t * 6. + n) + length(uv) * 0.1;
            m /= n;
            p *= m;
            float s = star(p, 1. / m);
            vec3 color = scol(rand2D(id + offs));
            color += max(0.0, 1. - 10. * pow(length(p), 1.3)) * .6;
            s *= 0.5 + 0.5 * sin(n * TAU + t);
            col += s * color;
        }
    }
    return col;
}

vec4 orb(vec2 uv, float t, float min_res) {
    float l = dot(uv, uv);
    vec3 n = normalize(vec3(uv, sqrt(abs(1.0 - l))));
    float f = 24.0 / min_res;
    
    /// Initial  Orb
    float mask = smoothstep(1.0 + f, 1.0 - f, l);
    vec4 col = vec4(vec3(0, 0, .5), sqrt(l) * mask);
    col.rgb -= n * 0.15;

    /// Reflections
    vec3 nr = vec3(normalize(uv), n.z);
    nr.xy = rot2D(nr.xy, t);
    float ref = noise(nr.xy * l) * 0.5 + noise(nr.xy * l * l + 31.61) * 0.5;
    col.rgb += mask * pow(ref, 4.) * vec3(0.6, 1, 0.6) * smoothstep(0.6, 0.5, l);
    col.rgb += ref * ref * ref * ref * 0.25;
    col.rgb += smoothstep(0.2, 0.4, pow(ref, 4.) * smoothstep(0.6, 0.5, l)) * ref;
    col.a += mask * smoothstep(0.5, 1., ref);

    nr.xy = rot2D(nr.xy, -t * 1.8);
    ref = noise(nr.xy * l - 1361.26);
    col.rgb += mask * pow(ref, 4.) * vec3(0.6, 0.5, 1) * smoothstep(0.4, 0.2, l);
    col.rgb = hue_shift(col.rgb, 0.4 * pow(mask * ref, 6.));
    col.rgb += ref * ref * ref * ref * 0.25;
    col.a += mask * smoothstep(0.5, 1., ref);

    nr.xy = rot2D(nr.xy, t * 1.4);
    ref = noise(nr.xy * l - 513.26);
    col.rgb += mask * pow(ref, 8.);
    col.rgb = hue_shift(col.rgb, mask * -ref);
    col.a += mask * smoothstep(0.5, 1., ref);

    nr.xy = rot2D(nr.xy, -t);
    ref = smoothstep(0.4, 1.5, noise(nr.xy * (0.5 + l) - 217.));
    float a = mask * 16. * ref * smoothstep(0.2, 0.1, l) * l;
    col.a += a;
    col.rgb += a * .25;
    col.rgb += smoothstep(0.5, 0., a) * a;

    nr.xy = rot2D(nr.xy, -t * 2.4);
    ref = noise(nr.xy * l + 221.126) * 0.35;
    col.rgb = hue_shift(col.rgb, mask * ref);
    col.rgb += ref * ref * ref * ref * 0.25;
    col.a += mask * ref / (1. + l);
    col.a = sqrt(col.a * 0.8);
    col.b = pow(col.b, 1.25);

    /// Stars
    const float STAR_FREQ = 12.;
    float ts = t * STAR_ANIMATION_SPEED;
    float ani = fract(ts);
    
    vec2 sn = vec2(cos(ts), sin(ts)) * noise(vec2(ts) * 0.3) * 0.1;
    vec2 sv = n.xy / (ani + 2.) + sn;
    vec3 stars1 = star_layer(sv * STAR_FREQ, t);

    sv = n.xy / (ani + 1.) + sn;
    vec3 stars2 = star_layer(sv * STAR_FREQ, t);
    vec3 stars = mix(stars1, stars2, ani);

    col.rgb = mix(col.rgb, stars, min(1.0, length(stars) * n.z * n.z * n.z * n.z * n.z * n.z * 2.));
    col.a += mask * length(stars) * n.z * n.z * n.z * n.z;

    col.rgb += mask * 0.25 * pow(l + 0.05, 4.);
    col.a += mask * pow(l + 0.1, 8.);
    
    ref = noise(uv * l - 513.26) * 2. - 1.;
    col.rgb += mask * pow(ref, 8.);
    col.rgb = hue_shift(col.rgb, mask * ref);

    float glow = (1.0 - mask) * (2. - l);
    col.a += glow;
    col.rgb += glow * glow * glow * glow * 0.5;

    float df = mask * smoothstep(0.9 - f, 0.9 + f, l);
    col.rgb = hue_shift(col.rgb, df * (2.5 * smoothstep(-f, f, uv.x * cos(t * 0.3) - uv.y * sin(t * 0.4)) - 1.));
    
    return col;
}

vec4 lines(vec2 uv, float t) {
    const float N = 32.0;
    const float G = 4.0;
    t *= 0.3;
    vec4 col = vec4(0);
    vec2 nv = normalize(uv);
    for (float i = 0.; i < N; ++i) {
        float j = mod(i, G);
        float k = floor(i / G);
        float d = max(0., pow(noise(nv * .4 + t - j * 0.02 - k), 2.) * 2. - 1.) * 0.3 * (j / G + 0.5);
        float mask = smoothstep(0.01, 0.0, distance(nv * (1.0 + d), uv));
        col.rgb += lcol(i / N) * mask;
        col.a += mask * 0.7;
    }
    return col;
}

void main()
{
    float min_res = min(resolution.x, resolution.y);
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min_res * 1.25;
    float t = time * 0.5;

    vec3 col = vec3(0);
    vec4 orb = orb(uv, t, min_res);    
    col.rgb += orb.rgb * orb.a;
    gl_FragColor.a += orb.a;

    vec4 li = lines(uv, t);   

    float f = 48.0 / min_res;
    float mask = smoothstep(1.0 + f, 1.0, dot(uv, uv));

    col.rgb = mix(li.rgb, col.rgb, clamp(mask * orb.a, 0.0, 1.0));
    col.rgb += orb.rgb * (1.0 - mask) * orb.a * BLOOM;
    
    gl_FragColor.a = max(gl_FragColor.a, li.a);

    gl_FragColor.rgb = col;
}