import * as THREE from 'three';
import { gsap } from 'gsap';

// ═══════════════════════════════════════════════════════════════════
// 1. RENDERER + SCENE
// ═══════════════════════════════════════════════════════════════════
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x04040d, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x04040d, 0.018);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 14);

// ═══════════════════════════════════════════════════════════════════
// 2. BACKGROUND GRID
// ═══════════════════════════════════════════════════════════════════
function buildGrid() {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0x0d1a2e, transparent: true, opacity: 0.6 });
  const N = 40, STEP = 1.5, HALF = N * STEP / 2;
  for (let i = 0; i <= N; i++) {
    const p = -HALF + i * STEP;
    const hg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-HALF, p, 0), new THREE.Vector3(HALF, p, 0)]);
    const vg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p, -HALF, 0), new THREE.Vector3(p, HALF, 0)]);
    group.add(new THREE.Line(hg, mat), new THREE.Line(vg, mat));
  }
  group.position.z = -8;
  scene.add(group);
  return group;
}
const gridGroup = buildGrid();

// ═══════════════════════════════════════════════════════════════════
// 3. TESSERACT MATH
// ═══════════════════════════════════════════════════════════════════
const TESS_V = [];
for (let i = 0; i < 16; i++) {
  TESS_V.push(new THREE.Vector4(
    (i & 1) ? 1 : -1,
    (i & 2) ? 1 : -1,
    (i & 4) ? 1 : -1,
    (i & 8) ? 1 : -1
  ));
}
const TESS_EDGES = [];
for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 4; j++) {
    const nb = i ^ (1 << j);
    if (i < nb) TESS_EDGES.push([i, nb]);
  }
}

// ═══════════════════════════════════════════════════════════════════
// 4. GEOMETRY BUFFERS
// ═══════════════════════════════════════════════════════════════════
const SIZE = 3.2;
const W_CAM = 2.8;

const edgePositions = new Float32Array(TESS_EDGES.length * 2 * 3);
const edgeGeo = new THREE.BufferGeometry();
edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));

function getEdgeColor(a, b) {
  const wa = TESS_V[a].w, wb = TESS_V[b].w;
  if (wa === 1 && wb === 1)  return new THREE.Color(0x00e5ff);
  if (wa === -1 && wb === -1) return new THREE.Color(0xff7043);
  return new THREE.Color(0x9c6bff);
}
const edgeBaseColors = new Float32Array(TESS_EDGES.length * 2 * 3);
TESS_EDGES.forEach(([a, b], i) => {
  const col = getEdgeColor(a, b);
  const base = i * 6;
  edgeBaseColors[base]=col.r; edgeBaseColors[base+1]=col.g; edgeBaseColors[base+2]=col.b;
  edgeBaseColors[base+3]=col.r; edgeBaseColors[base+4]=col.g; edgeBaseColors[base+5]=col.b;
});
const edgeColors = new Float32Array(edgeBaseColors);
edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeColors, 3));

const edgeMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 });
const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
scene.add(edgeLines);

const vertPositions = new Float32Array(16 * 3);
const vertGeo = new THREE.BufferGeometry();
vertGeo.setAttribute('position', new THREE.BufferAttribute(vertPositions, 3));
const vertMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.9, sizeAttenuation: true });
const vertPoints = new THREE.Points(vertGeo, vertMat);
scene.add(vertPoints);

// ═══════════════════════════════════════════════════════════════════
// 5. AXIS ARROWS
// ═══════════════════════════════════════════════════════════════════
const AXIS_COLORS = [0x4ab4f0, 0x39ff8a, 0xff7043, 0x9c6bff];
const AXIS_DIRS   = [
  new THREE.Vector3(1,0,0),
  new THREE.Vector3(0,1,0),
  new THREE.Vector3(0,0,1),
  new THREE.Vector3(0.6,0.6,0.5).normalize(),
];
const axisGroup = new THREE.Group();
scene.add(axisGroup);
const axisArrows = [];
AXIS_DIRS.forEach((dir, i) => {
  const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0,0,0), 5.5, AXIS_COLORS[i], 0.35, 0.18);
  arrow.line.material.transparent = true; arrow.line.material.opacity = 0;
  arrow.cone.material.transparent = true; arrow.cone.material.opacity = 0;
  axisArrows.push(arrow);
  axisGroup.add(arrow);
});

// ═══════════════════════════════════════════════════════════════════
// 6. PARTICLES
// ═══════════════════════════════════════════════════════════════════
const NPARTICLES = 600;
const pPositions = new Float32Array(NPARTICLES * 3);
const pVelocities = [];
const pColors = new Float32Array(NPARTICLES * 3);
const PCOLS = [new THREE.Color(0x4ab4f0), new THREE.Color(0x00e5ff), new THREE.Color(0x9c6bff), new THREE.Color(0x39ff8a)];
for (let i = 0; i < NPARTICLES; i++) {
  pPositions[i*3]   = (Math.random()-0.5)*30;
  pPositions[i*3+1] = (Math.random()-0.5)*20;
  pPositions[i*3+2] = (Math.random()-0.5)*15-5;
  pVelocities.push((Math.random()-0.5)*0.008,(Math.random()-0.5)*0.006,(Math.random()-0.5)*0.004);
  const c = PCOLS[Math.floor(Math.random()*4)];
  pColors[i*3]=c.r; pColors[i*3+1]=c.g; pColors[i*3+2]=c.b;
}
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions,3));
pGeo.setAttribute('color', new THREE.BufferAttribute(pColors,3));
const pMat = new THREE.PointsMaterial({ vertexColors:true, size:0.06, transparent:true, opacity:0.5, sizeAttenuation:true });
scene.add(new THREE.Points(pGeo, pMat));

// ═══════════════════════════════════════════════════════════════════
// 7. GLOW SPRITES
// ═══════════════════════════════════════════════════════════════════
function makeGlowTexture(color = '74,180,240') {
  const size = 64, cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  g.addColorStop(0,`rgba(${color},1)`);
  g.addColorStop(0.3,`rgba(${color},0.4)`);
  g.addColorStop(1,`rgba(${color},0)`);
  ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
  return new THREE.CanvasTexture(cv);
}
const glowTex = makeGlowTexture();
const glowSprites = [];
for (let i = 0; i < 16; i++) {
  const mat = new THREE.SpriteMaterial({ map:glowTex, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.6,0.6,1);
  scene.add(sprite);
  glowSprites.push(sprite);
}

// Hover highlight sprite (single, larger)
const hoverGlowTex = makeGlowTexture('255,220,80');
const hoverSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:hoverGlowTex, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false }));
hoverSprite.scale.set(1.4,1.4,1);
scene.add(hoverSprite);

// Edge highlight line
const edgeHlGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
const edgeHlMat = new THREE.LineBasicMaterial({ color:0xffdc50, transparent:true, opacity:0, linewidth:2 });
const edgeHlLine = new THREE.Line(edgeHlGeo, edgeHlMat);
scene.add(edgeHlLine);

// Pull progress line (shown while dragging an edge)
const pullGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
const pullMat = new THREE.LineBasicMaterial({ color:0x39ff8a, transparent:true, opacity:0, linewidth:3 });
const pullLine = new THREE.Line(pullGeo, pullMat);
scene.add(pullLine);

// ═══════════════════════════════════════════════════════════════════
// 8. PORTFOLIO CONTENT DATA
// ═══════════════════════════════════════════════════════════════════
const DIM_DATA = [
  {
    num:'0', name:'Point',
    formula:'dim(∅) = 0\n{x₀} ∈ ℝ⁰',
    v:1, e:0, f:0, c:0,
    tag: null, title: null, body: null, items: null,
    axisOpacity:[0,0,0,0],
    instruction:'drag the point right to unfold the first dimension',
    glowOpacity:0.95, edgeOpacity:0,
  },
  {
    num:'1', name:'Line',
    formula:'dim(V) = 1\nf: ℝ → ℝ',
    v:2, e:1, f:0, c:0,
    tag:'TIMELINE',
    title:'The Journey So Far',
    body:'From ECE foundations to data systems at scale.',
    items:[
      '2019–2023  B.Tech ECE (AI/ML) · JIIT India',
      '2022–2023  SWE Networking · BSNL — MQTT v5, eSIM LPA SDK, C/C++ for 4G LTE, 8k+ devices',
      '2023–2024  Data Analyst · Jio Platforms — ETL pipelines, TensorFlow Lite, telemetry at scale',
      '2024–2026  M.S. Data Science · Arizona State University',
      '2026 →      Seeking new grad roles · F-1 OPT · Open to DS / SWE / ML / Network tracks',
    ],
    axisOpacity:[0.9,0,0,0],
    instruction:'drag an edge upward to sweep into 2D',
    glowOpacity:0.7, edgeOpacity:0.5,
  },
  {
    num:'2', name:'Square',
    formula:'dim(V) = 2\nf: ℝ² → ℝ²',
    v:4, e:4, f:1, c:0,
    tag:'SKILLS',
    title:'Technical Surface Area',
    body:'Languages, systems, and tooling across the full stack.',
    items:[
      'Languages    Python · C/C++ · SQL · JavaScript · TypeScript · Java · Scala · Bash',
      'ML / AI      TensorFlow · PyTorch · Scikit-learn · LLMs · RAG · MCP · OpenCV · NLP',
      'Data Eng     ETL/ELT · PySpark · Airflow · Kafka · Snowflake · dbt · PostgreSQL · MongoDB',
      'Cloud        AWS · Azure · GCP · Databricks · Docker · Kubernetes · Terraform · CI/CD',
      'Viz & BI     Tableau · Power BI · D3.js · Matplotlib · Looker · Data Storytelling',
      'Protocols    MQTT v5 · REST · GraphQL · eSIM LPA · Wireshark · Burp Suite · Postman',
    ],
    axisOpacity:[0.7,0.9,0,0],
    instruction:'drag an edge outward to extrude into 3D',
    glowOpacity:0.5, edgeOpacity:0.7,
  },
  {
    num:'3', name:'Cube',
    formula:'dim(V) = 3\nf: ℝ³ → ℝ³',
    v:8, e:12, f:6, c:1,
    tag:'PROJECTS',
    title:'Things I Have Built',
    body:'End-to-end systems across ML, GenAI, data, and visualization.',
    items:[
      'AI Finance Agent     FastAPI · React · Llama 3.2 · LangGraph · MCP · Isolation Forest',
      '                     0.93 F1 fraud classifier · 0.926 NLP intent · 218ms median latency',
      'CRISPR Scrollytelling  D3.js · Scrollama · interactive narrative dashboards',
      '                     Geographic, policy & adoption analysis of CRISPR across 3 dimensions',
      'Jio ETL Pipeline     Python · SQL · Pandas · BI dashboards · TensorFlow Lite on edge',
      'BSNL eSIM SDK        C/C++ · MQTT v5 · 4 lifecycle operations · 8,000+ connected devices',
    ],
    axisOpacity:[0.6,0.6,0.9,0],
    instruction:'drag an edge to project into the 4th dimension',
    glowOpacity:0.4, edgeOpacity:0.85,
  },
  {
    num:'4', name:'Tesseract',
    formula:'dim(V) = 4\nf: ℝ⁴ → ℝ⁴',
    v:16, e:32, f:24, c:8,
    tag:'IMPACT + CONTACT',
    title:'Measurable Outcomes',
    body:'Numbers that made it to production.',
    items:[
      '12%   improvement in device uptime (Jio AirFiber telemetry + BI dashboards)',
      '40%   reduction in false alerts (TensorFlow Lite anomaly detection on edge)',
      '8k+   connected devices supported (eSIM LPA SDK lifecycle operations)',
      '100k+ transaction records analyzed (fraud detection + GenAI finance agent)',
      '0.98  ROC-AUC · 0.93 F1 · 218ms latency (production ML pipeline)',
      '——    ptallap2@asu.edu · (602) 756-5938 · LinkedIn · GitHub',
    ],
    axisOpacity:[0.5,0.5,0.5,0.8],
    instruction:'drag vertices to rotate freely in 4D hyperspace',
    glowOpacity:0.3, edgeOpacity:1.0,
  },
];

// ═══════════════════════════════════════════════════════════════════
// 9. STATE
// ═══════════════════════════════════════════════════════════════════
const state = { d1:0, d2:0, d3:0, d4:0, rotX:0, rotY:0 };
let currentDim = 0;
let isTransitioning = false;
let autoRotate = true;
let autoRotSpeed = { x:0.0015, y:0.0025 };
const clock = new THREE.Clock();

// Interaction state
const INTERACT = {
  mode: 'none',       // 'none' | 'rotate' | 'edge-pull'
  isDragging: false,
  dragStartScreen: { x:0, y:0 },
  lastScreen: { x:0, y:0 },
  hoveredVertex: -1,  // index or -1
  hoveredEdge: -1,    // index or -1
  pullProgress: 0,    // 0→1 while pulling edge
  pullOrigin3D: new THREE.Vector3(),
  pullDir3D: new THREE.Vector3(),
};

// ═══════════════════════════════════════════════════════════════════
// 10. PROJECTION
// ═══════════════════════════════════════════════════════════════════
const projected = new Array(16).fill(null).map(() => new THREE.Vector3());

function project4Dto3D(v4, d1, d2, d3, d4, rotX, rotY) {
  let x = v4.x * d1 * SIZE;
  let y = v4.y * d2 * SIZE;
  let z = v4.z * d3 * SIZE;
  let w = v4.w * d4;
  let wf = 1.0;
  if (d4 > 0.001) wf = W_CAM / (W_CAM - w * 1.3 * d4);
  x *= wf; y *= wf; z *= wf;
  const cx = Math.cos(rotX), sx = Math.sin(rotX);
  const cy = Math.cos(rotY), sy = Math.sin(rotY);
  const ry = y*cx - z*sx, rz = y*sx + z*cx;
  const rx2 = x*cy + rz*sy, rz2 = -x*sy + rz*cy;
  return new THREE.Vector3(rx2, ry, rz2);
}

function updateGeometry() {
  const { d1, d2, d3, d4, rotX, rotY } = state;
  for (let i = 0; i < 16; i++) {
    projected[i].copy(project4Dto3D(TESS_V[i], d1, d2, d3, d4, rotX, rotY));
    vertPositions[i*3]   = projected[i].x;
    vertPositions[i*3+1] = projected[i].y;
    vertPositions[i*3+2] = projected[i].z;
    glowSprites[i].position.copy(projected[i]);
  }
  vertGeo.attributes.position.needsUpdate = true;
  for (let i = 0; i < TESS_EDGES.length; i++) {
    const [a,b] = TESS_EDGES[i];
    const base = i*6;
    edgePositions[base]  =projected[a].x; edgePositions[base+1]=projected[a].y; edgePositions[base+2]=projected[a].z;
    edgePositions[base+3]=projected[b].x; edgePositions[base+4]=projected[b].y; edgePositions[base+5]=projected[b].z;
  }
  edgeGeo.attributes.position.needsUpdate = true;
}

// ═══════════════════════════════════════════════════════════════════
// 11. HIT DETECTION — vertex & edge in screen space
// ═══════════════════════════════════════════════════════════════════
const _ndcV = new THREE.Vector3();
function toScreen(worldPos) {
  _ndcV.copy(worldPos).project(camera);
  return {
    x: (_ndcV.x * 0.5 + 0.5) * window.innerWidth,
    y: (-_ndcV.y * 0.5 + 0.5) * window.innerHeight,
  };
}

// Returns { type:'vertex'|'edge'|'none', index }
function hitTest(mouseX, mouseY) {
  // Dim 0: everything is the single center point → always vertex
  if (currentDim === 0) return { type:'vertex', index:0 };

  const VERT_RADIUS = 22;   // px
  const EDGE_RADIUS = 14;   // px

  // Check vertices first
  for (let i = 0; i < 16; i++) {
    const s = toScreen(projected[i]);
    const dx = mouseX - s.x, dy = mouseY - s.y;
    if (Math.sqrt(dx*dx+dy*dy) < VERT_RADIUS) return { type:'vertex', index:i };
  }

  // Check edges (midpoint proximity)
  for (let i = 0; i < TESS_EDGES.length; i++) {
    const [a,b] = TESS_EDGES[i];
    const sa = toScreen(projected[a]), sb = toScreen(projected[b]);
    const mx = (sa.x+sb.x)/2, my = (sa.y+sb.y)/2;
    const dx = mouseX - mx, dy = mouseY - my;
    if (Math.sqrt(dx*dx+dy*dy) < EDGE_RADIUS) return { type:'edge', index:i };
  }

  return { type:'none', index:-1 };
}

// ═══════════════════════════════════════════════════════════════════
// 12. HOVER — update cursor & highlight
// ═══════════════════════════════════════════════════════════════════
function updateHover(mouseX, mouseY) {
  if (INTERACT.isDragging) return;
  const hit = hitTest(mouseX, mouseY);

  // Reset highlights
  hoverSprite.material.opacity = 0;
  edgeHlMat.opacity = 0;
  // Reset edge colors
  for (let i = 0; i < edgeBaseColors.length; i++) edgeColors[i] = edgeBaseColors[i];
  edgeGeo.attributes.color.needsUpdate = true;

  INTERACT.hoveredVertex = -1;
  INTERACT.hoveredEdge   = -1;

  if (hit.type === 'vertex') {
    INTERACT.hoveredVertex = hit.index;
    hoverSprite.position.copy(projected[hit.index]);
    hoverSprite.material.opacity = 0.6;
    renderer.domElement.style.cursor = 'grab';
  } else if (hit.type === 'edge' && currentDim < 4) {
    INTERACT.hoveredEdge = hit.index;
    const [a,b] = TESS_EDGES[hit.index];
    // Highlight this edge white
    const base = hit.index*6;
    for (let k = 0; k < 6; k += 3) {
      edgeColors[base+k]=1; edgeColors[base+k+1]=1; edgeColors[base+k+2]=1;
    }
    edgeGeo.attributes.color.needsUpdate = true;
    // Update edge highlight line
    const posArr = edgeHlGeo.attributes.position.array;
    posArr[0]=projected[a].x; posArr[1]=projected[a].y; posArr[2]=projected[a].z;
    posArr[3]=projected[b].x; posArr[4]=projected[b].y; posArr[5]=projected[b].z;
    edgeHlGeo.attributes.position.needsUpdate = true;
    edgeHlMat.opacity = 0.8;
    renderer.domElement.style.cursor = 'crosshair';
  } else {
    renderer.domElement.style.cursor = 'default';
  }
}

// ═══════════════════════════════════════════════════════════════════
// 13. DRAG — two distinct modes
// ═══════════════════════════════════════════════════════════════════
function getEventPos(e) {
  return e.touches
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };
}

function onPointerDown(e) {
  const pos = getEventPos(e);
  const hit = hitTest(pos.x, pos.y);

  INTERACT.isDragging = true;
  INTERACT.dragStartScreen = { ...pos };
  INTERACT.lastScreen = { ...pos };
  INTERACT.pullProgress = 0;
  autoRotate = false;

  if (hit.type === 'edge' && currentDim < 4) {
    INTERACT.mode = 'edge-pull';
    INTERACT.hoveredEdge = hit.index;
    const [a,b] = TESS_EDGES[hit.index];
    // Store midpoint in world space as pull origin
    INTERACT.pullOrigin3D.copy(projected[a]).add(projected[b]).multiplyScalar(0.5);
    // Pull direction: outward from center
    INTERACT.pullDir3D.copy(INTERACT.pullOrigin3D).normalize();
    pullMat.opacity = 0.9;
    renderer.domElement.style.cursor = 'crosshair';
  } else {
    // vertex or empty space → rotate
    INTERACT.mode = 'rotate';
    renderer.domElement.style.cursor = 'grabbing';
  }
}

function onPointerMove(e) {
  const pos = getEventPos(e);
  if (!INTERACT.isDragging) {
    updateHover(pos.x, pos.y);
    return;
  }
  const dx = pos.x - INTERACT.lastScreen.x;
  const dy = pos.y - INTERACT.lastScreen.y;
  INTERACT.lastScreen = { ...pos };

  if (INTERACT.mode === 'rotate') {
    // Pure rotation, no dimension advance
    state.rotX += dy * 0.006;
    state.rotY += dx * 0.006;

  } else if (INTERACT.mode === 'edge-pull') {
    // Accumulate total drag distance from start
    const totalDX = pos.x - INTERACT.dragStartScreen.x;
    const totalDY = pos.y - INTERACT.dragStartScreen.y;
    const dist = Math.sqrt(totalDX*totalDX + totalDY*totalDY);
    const PULL_NEEDED = 120; // px to fully pull
    INTERACT.pullProgress = Math.min(1, dist / PULL_NEEDED);

    // Update pull line: from edge midpoint outward
    const end = INTERACT.pullOrigin3D.clone().addScaledVector(
      INTERACT.pullDir3D, INTERACT.pullProgress * 2.5
    );
    const posArr = pullGeo.attributes.position.array;
    posArr[0]=INTERACT.pullOrigin3D.x; posArr[1]=INTERACT.pullOrigin3D.y; posArr[2]=INTERACT.pullOrigin3D.z;
    posArr[3]=end.x; posArr[4]=end.y; posArr[5]=end.z;
    pullGeo.attributes.position.needsUpdate = true;

    // Trigger transition at 80%
    if (INTERACT.pullProgress >= 0.80 && !isTransitioning) {
      triggerEdgePullTransition();
    }
  }

  // Dim 0 exception: dragging right (regardless of hit) advances
  if (currentDim === 0 && !isTransitioning) {
    const totalDX = pos.x - INTERACT.dragStartScreen.x;
    if (totalDX > 80) transitionTo(1);
  }
}

function onPointerUp() {
  INTERACT.isDragging = false;
  INTERACT.mode = 'none';
  INTERACT.pullProgress = 0;
  pullMat.opacity = 0;
  // Reset edge colors
  for (let i = 0; i < edgeBaseColors.length; i++) edgeColors[i] = edgeBaseColors[i];
  edgeGeo.attributes.color.needsUpdate = true;
  hoverSprite.material.opacity = 0;
  renderer.domElement.style.cursor = 'default';
  if (currentDim >= 2) setTimeout(() => { autoRotate = true; }, 2000);
}

function triggerEdgePullTransition() {
  transitionTo(currentDim + 1);
  INTERACT.pullProgress = 0;
  pullMat.opacity = 0;
}

renderer.domElement.addEventListener('mousedown', onPointerDown);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);
renderer.domElement.addEventListener('touchstart', onPointerDown, { passive:true });
window.addEventListener('touchmove', onPointerMove, { passive:true });
window.addEventListener('touchend', onPointerUp);

// ═══════════════════════════════════════════════════════════════════
// 14. NAV DOTS + KEYBOARD
// ═══════════════════════════════════════════════════════════════════
document.getElementById('nav-dots').style.pointerEvents = 'all';
document.getElementById('nav-dots').addEventListener('click', e => {
  const dot = e.target.closest('.ndot');
  if (!dot) return;
  const d = parseInt(dot.dataset.d);
  jumpTo(d);
});

window.addEventListener('keydown', e => {
  if (e.key==='ArrowRight'||e.key===' ') transitionTo(currentDim+1);
  if (e.key==='ArrowLeft') transitionTo(currentDim-1);
});

// ═══════════════════════════════════════════════════════════════════
// 15. TRANSITIONS
// ═══════════════════════════════════════════════════════════════════
const DIM_PROPS = [
  { d1:0, d2:0, d3:0, d4:0 },
  { d1:1, d2:0, d3:0, d4:0 },
  { d1:1, d2:1, d3:0, d4:0 },
  { d1:1, d2:1, d3:1, d4:0 },
  { d1:1, d2:1, d3:1, d4:1 },
];

function transitionTo(d) {
  if (isTransitioning || d === currentDim || d < 0 || d > 4) return;
  isTransitioning = true;
  currentDim = d;
  gsap.to(state, {
    ...DIM_PROPS[d], duration:1.8, ease:'power3.inOut',
    onComplete: () => { isTransitioning = false; },
  });
  if (d >= 2) { autoRotate = true; autoRotSpeed.x = 0.0012+d*0.0004; autoRotSpeed.y = 0.002+d*0.0005; }
  updateHUD(d);
}

function jumpTo(d) {
  if (d === currentDim) return;
  isTransitioning = true;
  currentDim = d;
  gsap.to(state, {
    ...DIM_PROPS[d], duration:1.6, ease:'power3.inOut',
    onComplete: () => { isTransitioning = false; },
  });
  updateHUD(d);
}

// ═══════════════════════════════════════════════════════════════════
// 16. HUD UPDATE
// ═══════════════════════════════════════════════════════════════════
function updateHUD(d) {
  const info = DIM_DATA[d];

  // Dim number flip
  const numEl = document.getElementById('dim-number');
  gsap.to(numEl, { opacity:0, duration:0.2, onComplete:() => {
    numEl.textContent = info.num;
    gsap.to(numEl, { opacity:0.10, duration:0.5 });
  }});
  document.getElementById('dim-name').textContent = info.name;
  document.getElementById('math-formula').innerHTML = info.formula.replace('\n','<br>');

  // Topology counters
  const countUp = (id, val) => {
    const el = document.getElementById(id);
    const old = parseInt(el.textContent)||0;
    gsap.to({ v:old }, { v:val, duration:0.7, ease:'power2.out', onUpdate: function() {
      el.textContent = Math.round(this.targets()[0].v);
    }});
  };
  countUp('s-v', info.v); countUp('s-e', info.e); countUp('s-f', info.f); countUp('s-c', info.c);

  // Content panel
  const panel = document.getElementById('content-panel');
  gsap.to(panel, { opacity:0, duration:0.25, onComplete:() => {
    document.getElementById('content-tag').textContent = info.tag || '—';
    document.getElementById('content-title').textContent = info.title || '';
    document.getElementById('content-body').textContent = info.body || '';

    // Items list
    let itemsEl = document.getElementById('content-items');
    if (!itemsEl) {
      itemsEl = document.createElement('div');
      itemsEl.id = 'content-items';
      itemsEl.style.cssText = 'margin-top:10px;text-align:left;font-family:Space Mono,monospace;font-size:11px;color:#4ab4f0;opacity:0.75;line-height:2;letter-spacing:0.04em;';
      panel.appendChild(itemsEl);
    }
    itemsEl.innerHTML = '';
    if (info.items) {
      info.items.forEach((item, i) => {
        const row = document.createElement('div');
        row.textContent = item;
        row.style.cssText = `opacity:0;transform:translateY(6px);transition:opacity 0.4s ${i*0.08}s,transform 0.4s ${i*0.08}s`;
        itemsEl.appendChild(row);
        setTimeout(() => { row.style.opacity='1'; row.style.transform='translateY(0)'; }, 50);
      });
    }

    if (info.title) {
      panel.classList.add('visible');
      gsap.to(panel, { opacity:1, duration:0.6 });
    } else {
      panel.classList.remove('visible');
    }
  }});

  // Instruction
  document.getElementById('instruction-text').textContent = info.instruction;

  // Nav dots
  document.querySelectorAll('.ndot').forEach((dot,i) => dot.classList.toggle('active', i===d));

  // Axes
  axisArrows.forEach((arrow, i) => {
    const op = info.axisOpacity[i];
    gsap.to(arrow.line.material, { opacity:op*0.5, duration:0.8 });
    gsap.to(arrow.cone.material, { opacity:op*0.8, duration:0.8 });
  });

  // Glow
  glowSprites.forEach(s => gsap.to(s.material, { opacity:info.glowOpacity*0.5, duration:0.8 }));
  gsap.to(edgeMat, { opacity:info.edgeOpacity, duration:0.8 });
  gsap.to(vertMat, { opacity:d===0?0.95:0.6, duration:0.6 });
  vertMat.size = d===0 ? 0.22 : 0.10;
}

// ═══════════════════════════════════════════════════════════════════
// 17. INTRO
// ═══════════════════════════════════════════════════════════════════

// Inject name + mission on 0D screen
const hudEl = document.getElementById('hud');
const identityEl = document.createElement('div');
identityEl.id = 'identity';
identityEl.style.cssText = `
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%);
  text-align:center; pointer-events:none;
  opacity:0;
`;
identityEl.innerHTML = `
  <div style="font-family:'Space Mono',monospace;font-size:clamp(28px,5vw,52px);font-weight:700;
    color:#fff;letter-spacing:0.04em;text-shadow:0 0 60px rgba(74,180,240,0.5);margin-bottom:14px;">
    PAVAN TEJA TALLAPALLI
  </div>
  <div style="font-family:'Inter',sans-serif;font-size:clamp(12px,1.8vw,16px);
    color:#4ab4f0;letter-spacing:0.12em;opacity:0.8;max-width:560px;line-height:1.7;">
    Building intelligent systems at the intersection of<br>
    data science, machine learning, and distributed networks
  </div>
`;
hudEl.appendChild(identityEl);

edgeMat.opacity = 0; vertMat.opacity = 0;
glowSprites.forEach(s => { s.material.opacity = 0; });

gsap.timeline({ delay:0.4 })
  .to(vertMat, { opacity:0.95, duration:1.2, ease:'power2.out' })
  .to(scene.fog, { density:0.018, duration:2 }, 0)
  .to(identityEl, { opacity:1, duration:1.2, ease:'power2.out' }, 0.6)
  .call(() => {
    glowSprites.forEach(s => gsap.to(s.material, { opacity:0.55, duration:1 }));
    updateHUD(0);
  }, null, 0.8);

// Hide identity on dim change
const origTransitionTo = transitionTo;
function hideIdentityOnAdvance() {
  gsap.to(identityEl, { opacity:0, duration:0.5 });
}

// ═══════════════════════════════════════════════════════════════════
// 18. RENDER LOOP
// ═══════════════════════════════════════════════════════════════════
let identityHidden = false;

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  if (autoRotate && !INTERACT.isDragging) {
    state.rotX += autoRotSpeed.x + Math.sin(elapsed*0.23)*0.0003;
    state.rotY += autoRotSpeed.y + Math.cos(elapsed*0.17)*0.0004;
  }

  // Hide identity panel once we leave 0D
  if (currentDim > 0 && !identityHidden) {
    identityHidden = true;
    gsap.to(identityEl, { opacity:0, duration:0.5 });
  }
  if (currentDim === 0 && identityHidden && !isTransitioning) {
    identityHidden = false;
    gsap.to(identityEl, { opacity:1, duration:0.6 });
  }

  camera.position.x = Math.sin(elapsed*0.07)*0.4;
  camera.position.y = Math.cos(elapsed*0.05)*0.25;
  gridGroup.rotation.z = elapsed*0.005;

  // 0D pulse
  if (currentDim === 0 && !isTransitioning) {
    const pulse = Math.sin(elapsed*1.8)*0.5+0.5;
    glowSprites[0].material.opacity = 0.4+pulse*0.4;
    glowSprites[0].scale.setScalar(0.5+pulse*0.4);
    vertMat.size = 0.18+pulse*0.08;
  }

  // Pull progress feedback — tint hovered edge green as you pull
  if (INTERACT.mode === 'edge-pull' && INTERACT.hoveredEdge >= 0) {
    const p = INTERACT.pullProgress;
    const base = INTERACT.hoveredEdge * 6;
    // Lerp from white to green as progress increases
    edgeColors[base]=1-p; edgeColors[base+1]=1; edgeColors[base+2]=1-p;
    edgeColors[base+3]=1-p; edgeColors[base+4]=1; edgeColors[base+5]=1-p;
    edgeGeo.attributes.color.needsUpdate = true;
  }

  // Particles
  for (let i = 0; i < NPARTICLES; i++) {
    pPositions[i*3]   += pVelocities[i*3];
    pPositions[i*3+1] += pVelocities[i*3+1];
    pPositions[i*3+2] += pVelocities[i*3+2];
    if (Math.abs(pPositions[i*3])>15)   pPositions[i*3]   *= -0.98;
    if (Math.abs(pPositions[i*3+1])>10) pPositions[i*3+1] *= -0.98;
  }
  pGeo.attributes.position.needsUpdate = true;

  updateGeometry();
  renderer.render(scene, camera);
}

animate();

// ═══════════════════════════════════════════════════════════════════
// 19. RESIZE
// ═══════════════════════════════════════════════════════════════════
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});