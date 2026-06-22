import { useEffect, useRef } from "react";
import useIsMobile from "./useIsMobile";

// Subtle full-viewport shader backdrop — a slow fbm "fog" that drifts faint warm
// (accent) and cool tints over near-black, plus a touch of grain. Very low
// contrast on purpose: it adds living depth without breaking the dark identity.
// Desktop only, disabled for prefers-reduced-motion. Lightweight (OGL).

const vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `
precision highp float;
uniform float uTime;
uniform vec2 uRes;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv * 2.0;
  p.x *= uRes.x / uRes.y;
  float t = uTime * 0.03;

  float n  = fbm(p + vec2(t, t * 0.6));
  float n2 = fbm(p * 1.7 - vec2(t * 0.4, t));

  vec3 base = vec3(0.043, 0.051, 0.059); // near-black, matches --bg
  vec3 warm = vec3(0.105, 0.052, 0.064); // faint accent-ish
  vec3 cool = vec3(0.045, 0.060, 0.090); // faint cool

  vec3 col = base;
  col = mix(col, warm, smoothstep(0.45, 0.9, n) * 0.6);
  col = mix(col, cool, smoothstep(0.40, 0.9, n2) * 0.5);

  float g = hash(gl_FragCoord.xy + uTime) * 0.022;
  col += g - 0.011;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function ShaderBackground() {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mount = ref.current;
    if (!mount) return;

    let renderer, program, mesh, raf, onResize;
    let cancelled = false;

    import("ogl").then(({ Renderer, Triangle, Program, Mesh }) => {
      if (cancelled || !mount) return;
      renderer = new Renderer({ alpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
      const gl = renderer.gl;
      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] } },
      });
      mesh = new Mesh(gl, { geometry, program });

      const canvas = gl.canvas;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      mount.appendChild(canvas);

      onResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      };
      window.addEventListener("resize", onResize);
      onResize();

      const loop = (time) => {
        program.uniforms.uTime.value = time * 0.001;
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (onResize) window.removeEventListener("resize", onResize);
      if (mount) mount.innerHTML = "";
    };
  }, [isMobile]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    />
  );
}
