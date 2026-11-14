// Animated doll (same technique as the channel intro): WebGL warp of the
// original illustration — blink, soft smile, gentle head tilt and hair sway.
// The drawing itself is never altered or redrawn.
const SRC = { x0: 490, y0: 200, size: 700, cx: 840, cy: 550, r: 338 };
const EYES = [
  { top: [[791, 351], [795, 339], [803, 333.2], [814, 329.6], [824, 327.2], [834, 327], [840, 329]],
    bot: [[791, 351], [800, 349.5], [812, 346.5], [824, 341.5], [836, 335], [840, 329]], pad: 6, lw: 3.0, outer: 'right', wing: [844, 326.6] },
  { top: [[733, 375], [734.5, 363], [741, 358], [753, 359], [760, 365]],
    bot: [[733, 375], [739, 375.8], [748, 372.6], [755, 369.5], [760, 365]], pad: 4.5, lw: 2.4, outer: 'left', wing: [729.6, 377.2] }
];
const ease = t => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

function yAt(pts, x) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    if (x >= x0 && x <= x1) return y0 + (y1 - y0) * ease((x - x0) / (x1 - x0 || 1));
  }
  return pts[x < pts[0][0] ? 0 : pts.length - 1][1];
}
function drawLid(g, eye, k) {
  const ox = SRC.x0, oy = SRC.y0, x0 = eye.top[0][0], x1 = eye.top[eye.top.length - 1][0], N = 28;
  const topE = [], lidE = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = x0 + (x1 - x0) * u, t = yAt(eye.top, x), b = yAt(eye.bot, x);
    const taper = Math.pow(Math.sin(Math.PI * u), 0.6), closed = t + (b - t) * 0.9 + 0.6 * taper;
    lidE.push([x - ox, t + (closed - t) * k - oy]);
    topE.push([x - ox, t - eye.pad * taper * Math.min(1, k * 2.2) - oy]);
  }
  let minY = Infinity, maxY = -Infinity;
  topE.forEach(p => minY = Math.min(minY, p[1])); lidE.forEach(p => maxY = Math.max(maxY, p[1]));
  g.save(); g.filter = 'blur(0.6px)';
  const gr = g.createLinearGradient(0, minY - 1, 0, maxY + 1);
  gr.addColorStop(0, 'rgb(244,160,116)'); gr.addColorStop(0.65, 'rgb(237,145,102)'); gr.addColorStop(1, 'rgb(228,132,92)');
  g.fillStyle = gr; g.beginPath();
  topE.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]));
  for (let i = N; i >= 0; i--) g.lineTo(lidE[i][0], lidE[i][1] + 0.8);
  g.closePath(); g.fill();
  g.filter = 'blur(0.35px)';
  g.fillStyle = `rgba(38,20,14,${Math.min(1, k * 1.6)})`; g.beginPath();
  const th = i => { const u = i / N, out = eye.outer === 'right' ? u : 1 - u; return eye.lw * (0.25 + 0.45 * Math.pow(Math.sin(Math.PI * Math.min(u, 0.999)), 0.5) + 0.4 * out); };
  lidE.forEach((p, i) => i ? g.lineTo(p[0], p[1] - th(i) * 0.35) : g.moveTo(p[0], p[1] - th(i) * 0.35));
  for (let i = N; i >= 0; i--) g.lineTo(lidE[i][0], lidE[i][1] + th(i) * 0.65);
  g.closePath(); g.fill();
  if (k > 0.5) {
    const end = eye.outer === 'right' ? lidE[N] : lidE[0];
    g.strokeStyle = `rgba(38,20,14,${(k - 0.5) * 2})`; g.lineWidth = eye.lw * 0.8; g.lineCap = 'round';
    g.beginPath(); g.moveTo(end[0], end[1]); g.lineTo(eye.wing[0] - ox, eye.wing[1] - oy); g.stroke();
  }
  g.restore();
}

const FS = `precision highp float;
varying vec2 v; uniform sampler2D tex; uniform float theta, time, smile, sway;
const vec2 ORIGIN = vec2(${SRC.x0}.0, ${SRC.y0}.0); const float SIZE = ${SRC.size}.0;
const vec2 C = vec2(${SRC.cx}.0, ${SRC.cy}.0); const float R = ${SRC.r}.0;
const vec2 PIVOT = vec2(815.0, 525.0); const vec2 M1 = vec2(823.0, 404.0); const vec2 M2 = vec2(766.0, 422.0);
void main(){
  vec2 p = ORIGIN + v * SIZE; vec2 q = p;
  float w = 1.0 - smoothstep(430.0, 620.0, q.y);
  float an = -theta * w; float cs = cos(an), sn = sin(an);
  vec2 d = q - PIVOT; q = PIVOT + vec2(cs*d.x - sn*d.y, sn*d.x + cs*d.y);
  float side = sign(q.x - 845.0);
  float m = smoothstep(420.0, 700.0, q.y) * smoothstep(100.0, 205.0, abs(q.x - 845.0));
  q.x -= sway * m * sin(time * 1.9 + q.y * 0.011 + side * 0.9);
  q.y -= 0.5 * sway * m * sin(time * 1.35 + q.y * 0.008 + side);
  float g1 = exp(-dot(q - M1, q - M1) / 98.0), g2 = exp(-dot(q - M2, q - M2) / 98.0);
  q.y += smile * 1.7 * (g1 + g2); q.x += smile * 0.7 * (-g1 + g2);
  vec3 col = texture2D(tex, (q - ORIGIN) / SIZE).rgb;
  float ac = 1.0 - smoothstep(R - 1.6, R, length(p - C));
  float minc = min(col.r, min(col.g, col.b));
  float aw = clamp((0.985 - minc) / 0.88, 0.0, 1.0) * (1.0 - smoothstep(C.y - 160.0, C.y - 90.0, p.y));
  vec3 un = aw > 0.002 ? clamp((col - (1.0 - aw)) / aw, 0.0, 1.0) : col;
  float a = max(ac, aw);
  gl_FragColor = vec4(mix(un, col, ac) * a, a);
}`;

/**
 * Mounts the animated doll on a <canvas>. Returns { stop }.
 * Falls back to a static <img> when WebGL is unavailable.
 */
export async function mountDoll(canvas, src, { gentle = false } = {}) {
  const amp = gentle ? 0.7 : 1;
  const img = new Image(); img.src = src; img.decoding = 'async';
  await img.decode();
  canvas.width = canvas.height = SRC.size;
  const pristine = document.createElement('canvas'); pristine.width = pristine.height = SRC.size;
  pristine.getContext('2d').drawImage(img, SRC.x0, SRC.y0, SRC.size, SRC.size, 0, 0, SRC.size, SRC.size);
  const crop = document.createElement('canvas'); crop.width = crop.height = SRC.size;
  const cctx = crop.getContext('2d');

  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl) { // graceful fallback: circular static image
    const c2 = canvas.getContext('2d');
    c2.save(); c2.beginPath(); c2.arc(350, 350, 338, 0, Math.PI * 2); c2.clip(); c2.drawImage(pristine, 0, 0); c2.restore();
    return { stop() {} };
  }
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 a; varying vec2 v; void main(){ v = vec2(a.x*.5+.5, .5-a.y*.5); gl_Position = vec4(a,0.,1.); }'));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]
    .forEach(([k, v]) => gl.texParameteri(gl.TEXTURE_2D, k, v));
  const U = {}; ['theta', 'time', 'smile', 'sway'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  gl.viewport(0, 0, SRC.size, SRC.size);

  let lastK = -1;
  const upload = k => {
    if (Math.abs(k - lastK) < 1e-4) return;
    lastK = k;
    cctx.clearRect(0, 0, SRC.size, SRC.size); cctx.drawImage(pristine, 0, 0);
    if (k > 0.001) EYES.forEach(e => drawLid(cctx, e, k));
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, crop);
  };
  const render = (t, k) => {
    upload(k);
    // same recipe as the intro, a little livelier for a page that stays on screen
    const tilt = Math.sin(Math.PI * 2 * t / 5.2) * 0.75 + Math.sin(Math.PI * 2 * t / 8.3 + 1) * 0.35;
    gl.uniform1f(U.theta, amp * (2.0 * Math.PI / 180) * tilt * smooth(0.3, 1.6, t));
    gl.uniform1f(U.time, t * 1.1);
    gl.uniform1f(U.smile, 0.5 + 0.5 * smooth(0.8, 1.6, t) * (0.6 + 0.4 * Math.sin(t * 0.8)));
    gl.uniform1f(U.sway, amp * 4.6 * smooth(0.2, 1.4, t));
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  // blinks at natural, slightly random intervals
  let nextBlink = 1.6, blinkAt = -10, raf = 0, visible = true, t0 = performance.now(), paused = 0;
  const blinkK = t => { const d = t - blinkAt; if (d < 0 || d > 0.3) return 0; if (d < 0.075) return (d / 0.075) ** 2; if (d < 0.115) return 1; return 1 - (1 - Math.pow(1 - (d - 0.115) / 0.17, 3)); };
  const loop = now => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const t = (now - t0) / 1000;
    if (t > nextBlink) { blinkAt = t; nextBlink = t + (Math.random() < 0.2 ? 0.35 : 2.4 + Math.random() * 2.6); }   // sometimes a double blink
    render(t, clamp(blinkK(t)));
  };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);
  raf = requestAnimationFrame(loop);
  return { stop() { cancelAnimationFrame(raf); io.disconnect(); } };
}
