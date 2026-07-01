import * as THREE from 'three';
import { gsap } from 'gsap';

// ═══════════════════════════════════════════════════════════════════
// RENDERER + SCENE
// ═══════════════════════════════════════════════════════════════════
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x04040d, 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x04040d, 0.016);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 14);

const clock = new THREE.Clock();

// ═══════════════════════════════════════════════════════════════════
// BACKGROUND GRID
// ═══════════════════════════════════════════════════════════════════
function buildGrid() {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0x0a1628, transparent: true, opacity: 0.7 });
  const N = 50, STEP = 1.5, HALF = N * STEP / 2;
  for (let i = 0; i <= N; i++) {
    const p = -HALF + i * STEP;
    const hg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-HALF, p, 0), new THREE.Vector3(HALF, p, 0)]);
    const vg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p, -HALF, 0), new THREE.Vector3(p, HALF, 0)]);
    group.add(new THREE.Line(hg, mat), new THREE.Line(vg, mat));
  }
  group.position.z = -10;
  scene.add(group);
  return group;
}
const gridGroup = buildGrid();

// ═══════════════════════════════════════════════════════════════════
// TESSERACT MATH — 16 vertices, 32 edges
// ═══════════════════════════════════════════════════════════════════
const TESS_V = [];
for (let i = 0; i < 16; i++) {
  TESS_V.push(new THREE.Vector4(
    (i & 1) ? 1 : -1, (i & 2) ? 1 : -1,
    (i & 4) ? 1 : -1, (i & 8) ? 1 : -1
  ));
}
const TESS_EDGES = [];
for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 4; j++) {
    const nb = i ^ (1 << j);
    if (i < nb) TESS_EDGES.push([i, nb]);
  }
}

// Cube faces (front back left right top bottom) — indices into cube verts (0–7)
const CUBE_FACES = [
  { verts:[0,1,2,3], name:'Data Engineering', color:0x00e5ff,   skills:['ETL/ELT Pipelines','PySpark · Kafka','Airflow · dbt','Snowflake · PostgreSQL'] },
  { verts:[4,5,6,7], name:'Cloud & DevOps',   color:0x39ff8a,   skills:['AWS · Azure · GCP','Docker · Kubernetes','Terraform · CI/CD','Databricks · Airflow'] },
  { verts:[0,1,5,4], name:'Machine Learning', color:0x9c6bff,   skills:['TensorFlow · PyTorch','Scikit-learn · OpenCV','LLMs · RAG · MCP','Anomaly Detection'] },
  { verts:[2,3,7,6], name:'Software Eng',     color:0xff7043,   skills:['Python · C/C++ · Go','REST · GraphQL','FastAPI · Node.js','Testing & QA'] },
  { verts:[0,3,7,4], name:'Networking',       color:0xffdc50,   skills:['MQTT v5 · eSIM LPA','Wireshark · TCPdump','4G LTE · GSM','Protocol Analysis'] },
  { verts:[1,2,6,5], name:'Data Science',     color:0xff6baf,   skills:['Statistical Learning','NLP · Transformers','D3.js · Tableau','A/B Testing · EDA'] },
];

// ═══════════════════════════════════════════════════════════════════
// DATA ANCHORED TO GEOMETRY
// ═══════════════════════════════════════════════════════════════════

// 1D: timeline events anchored to positions along the line (t = 0..1)
const TIMELINE_NODES = [
  { t:0.00, tag:'JIIT',  label:'B.Tech ECE (AI/ML)', detail:'Jaypee Institute · 2019–2023\nFoundations in AI, ML, DSP, C/C++' },
  { t:0.26, tag:'BSNL',  label:'SWE · Networking',   detail:'Jun 2022–Jun 2023\nMQTT v5 · eSIM LPA SDK · 8k+ devices\nC/C++ for 4G LTE switching systems' },
  { t:0.54, tag:'JIO',   label:'Data Analyst',        detail:'Jun 2023–Jul 2024\nETL pipelines · TensorFlow Lite\n12% uptime ↑ · 40% false alerts ↓' },
  { t:0.78, tag:'ASU',   label:'M.S. Data Science',   detail:'Aug 2024–May 2026\nComputing & Decision Analytics\nML · NLP · Big Data · Statistics' },
  { t:1.00, tag:'NOW',   label:'Open to Roles',        detail:'New grad · F-1 OPT\nDS · SWE · ML · Network tracks\nptallap2@asu.edu · (602) 756-5938' },
];

// 2D: skill clusters anchored to 4 square vertices
const SKILL_VERTICES = [
  { tag:'LANG',  label:'Languages',   detail:'Python · SQL · C/C++\nJavaScript · TypeScript\nJava · Scala · Bash' },
  { tag:'ML/AI', label:'ML & GenAI',  detail:'TensorFlow · PyTorch\nLLMs · RAG · MCP · NLP\nScikit-learn · OpenCV' },
  { tag:'DATA',  label:'Data Eng',    detail:'ETL/ELT · PySpark\nKafka · Airflow · dbt\nSnowflake · MongoDB' },
  { tag:'CLOUD', label:'Cloud & Ops', detail:'AWS · Azure · GCP\nDocker · Kubernetes\nTerraform · CI/CD' },
];

// 3D: cube vertices hold project/role data (8 vertices)
const CUBE_VERTEX_DATA = [
  { tag:'BSNL',    label:'eSIM SDK',       detail:'MQTT v5 · C/C++\n8,000+ connected devices\n4 lifecycle operations' },
  { tag:'JIO-1',   label:'ETL Pipeline',   detail:'Python · SQL · Pandas\nLarge-scale device telemetry\nDiagnostics & monitoring' },
  { tag:'JIO-2',   label:'TF Lite Model',  detail:'TensorFlow Lite · Edge ML\n40% reduction in false alerts\nAnomaly detection on-device' },
  { tag:'JIO-3',   label:'BI Dashboards',  detail:'Power BI · KPI reports\n12% uptime improvement\nDevice health visibility' },
  { tag:'PROJ-1',  label:'Finance Agent',  detail:'FastAPI · React · LangGraph\n0.93 F1 · 0.98 ROC-AUC\n218ms median latency' },
  { tag:'PROJ-2',  label:'GenAI Copilot',  detail:'Llama 3.2 · MCP · RAG\n0.926 NLP intent accuracy\nIsolation Forest · Z-score' },
  { tag:'PROJ-3',  label:'CRISPR Viz',     detail:'D3.js · Scrollama\nNarrative data storytelling\nGeographic & policy analysis' },
  { tag:'ASU',     label:'M.S. Research',  detail:'Computing & Decision Analytics\nML · NLP · Big Data\nStatistical Learning' },
];

// 4D: outer vertices (w=+1, indices 8–15) = impact metrics
//     inner vertices (w=-1, indices 0–7)  = tech that drove them
const IMPACT_OUTER = [
  { tag:'12%',  label:'Uptime ↑',       detail:'Device uptime improvement\nvia BI dashboards + telemetry\nJio AirFiber production' },
  { tag:'40%',  label:'Alerts ↓',       detail:'False alert reduction\nTensorFlow Lite on edge\nAnomaly detection model' },
  { tag:'8k+',  label:'Devices',        detail:'Connected devices managed\neSIM LPA SDK lifecycle\nBSNL telecom infrastructure' },
  { tag:'100k+',label:'Records',        detail:'Transaction records analyzed\nFraud detection pipeline\nGradient Boosting classifier' },
  { tag:'0.93', label:'F1 Score',       detail:'Fraud classifier performance\nSMOTE resampling · XGBoost\nProduction ML pipeline' },
  { tag:'0.98', label:'ROC-AUC',        detail:'Classifier discrimination\nPersonal Finance Agent\nFastAPI · SQLite · React' },
  { tag:'218ms',label:'Latency',        detail:'Median query latency\nConversational GenAI copilot\nLlama 3.2 · LangGraph · MCP' },
  { tag:'0.926',label:'NLP Intent',     detail:'NLP intent accuracy\nBART · Vector Databases\nReal-time inference pipeline' },
];

// ═══════════════════════════════════════════════════════════════════
// GEOMETRY BUFFERS
// ═══════════════════════════════════════════════════════════════════
const SIZE = 3.2, W_CAM = 2.8;

const edgePositions = new Float32Array(TESS_EDGES.length * 2 * 3);
const edgeGeo = new THREE.BufferGeometry();
edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));

function getEdgeBaseColor(a, b) {
  const wa = TESS_V[a].w, wb = TESS_V[b].w;
  if (wa === 1 && wb === 1)  return new THREE.Color(0x00e5ff);
  if (wa === -1 && wb === -1) return new THREE.Color(0xff7043);
  return new THREE.Color(0x9c6bff);
}
const edgeBaseColors = new Float32Array(TESS_EDGES.length * 2 * 3);
TESS_EDGES.forEach(([a,b], i) => {
  const col = getEdgeBaseColor(a,b);
  const base = i*6;
  edgeBaseColors[base]=col.r; edgeBaseColors[base+1]=col.g; edgeBaseColors[base+2]=col.b;
  edgeBaseColors[base+3]=col.r; edgeBaseColors[base+4]=col.g; edgeBaseColors[base+5]=col.b;
});
const edgeColors = new Float32Array(edgeBaseColors);
edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeColors, 3));

const edgeMat = new THREE.LineBasicMaterial({ vertexColors:true, transparent:true, opacity:0 });
const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
scene.add(edgeLines);

const vertPositions = new Float32Array(16 * 3);
const vertGeo = new THREE.BufferGeometry();
vertGeo.setAttribute('position', new THREE.BufferAttribute(vertPositions, 3));
const vertMat = new THREE.PointsMaterial({ color:0xffffff, size:0.22, transparent:true, opacity:0, sizeAttenuation:true });
const vertPoints = new THREE.Points(vertGeo, vertMat);
scene.add(vertPoints);

// ═══════════════════════════════════════════════════════════════════
// CUBE FACE MESHES (glowing fill)
// ═══════════════════════════════════════════════════════════════════
const faceMeshes = [];
CUBE_FACES.forEach((f, fi) => {
  const geo = new THREE.BufferGeometry();
  // Two triangles per quad
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4*3), 3));
  geo.setIndex([0,1,2, 0,2,3]);
  const col = new THREE.Color(f.color);
  const mat = new THREE.MeshBasicMaterial({
    color: col, transparent: true, opacity: 0,
    side: THREE.DoubleSide, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  faceMeshes.push({ mesh, faceData: f, baseOpacity: 0.06, hovered: false });
});

// ═══════════════════════════════════════════════════════════════════
// GLOW SPRITES + HOVER SPRITE
// ═══════════════════════════════════════════════════════════════════
function makeGlowTex(r,g,b) {
  const sz=64, cv=document.createElement('canvas');
  cv.width=cv.height=sz;
  const ctx=cv.getContext('2d');
  const gr=ctx.createRadialGradient(sz/2,sz/2,0,sz/2,sz/2,sz/2);
  gr.addColorStop(0,`rgba(${r},${g},${b},1)`);
  gr.addColorStop(0.35,`rgba(${r},${g},${b},0.4)`);
  gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
  ctx.fillStyle=gr; ctx.fillRect(0,0,sz,sz);
  return new THREE.CanvasTexture(cv);
}
const glowTex     = makeGlowTex(74,180,240);
const hoverTexV   = makeGlowTex(255,220,80);
const hoverTexE   = makeGlowTex(57,255,138);

const glowSprites = [];
for (let i=0;i<16;i++) {
  const mat = new THREE.SpriteMaterial({ map:glowTex, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false });
  const sp = new THREE.Sprite(mat);
  sp.scale.set(0.7,0.7,1);
  scene.add(sp);
  glowSprites.push(sp);
}
const hoverSpriteV = new THREE.Sprite(new THREE.SpriteMaterial({ map:hoverTexV, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false }));
hoverSpriteV.scale.set(1.8,1.8,1);
scene.add(hoverSpriteV);

// Edge highlight
const edgeHlGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
const edgeHlMat = new THREE.LineBasicMaterial({ color:0x39ff8a, transparent:true, opacity:0 });
scene.add(new THREE.Line(edgeHlGeo, edgeHlMat));

// Pull line
const pullGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
const pullMat = new THREE.LineBasicMaterial({ color:0x39ff8a, transparent:true, opacity:0 });
scene.add(new THREE.Line(pullGeo, pullMat));

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════
const state = { d1:0, d2:0, d3:0, d4:0, rotX:0, rotY:0 };
const DIM_PROPS = [
  {d1:0,d2:0,d3:0,d4:0}, {d1:1,d2:0,d3:0,d4:0},
  {d1:1,d2:1,d3:0,d4:0}, {d1:1,d2:1,d3:1,d4:0},
  {d1:1,d2:1,d3:1,d4:1},
];
let currentDim = 0, isTransitioning = false;
let autoRotate = true;
let autoRotSpeed = { x:0.0012, y:0.002 };

const INTERACT = {
  mode:'none', isDragging:false,
  dragStartScreen:{x:0,y:0}, lastScreen:{x:0,y:0},
  hoveredVertex:-1, hoveredEdge:-1, hoveredFace:-1,
  pullProgress:0,
  pullOrigin3D: new THREE.Vector3(),
  pullDir3D: new THREE.Vector3(),
};

// ═══════════════════════════════════════════════════════════════════
// PROJECTION
// ═══════════════════════════════════════════════════════════════════
const projected = Array.from({length:16}, () => new THREE.Vector3());

function project4D(v4, d1,d2,d3,d4, rotX,rotY) {
  let x=v4.x*d1*SIZE, y=v4.y*d2*SIZE, z=v4.z*d3*SIZE, w=v4.w*d4;
  if (d4>0.001) { const wf=W_CAM/(W_CAM-w*1.3*d4); x*=wf; y*=wf; z*=wf; }
  const cx=Math.cos(rotX),sx=Math.sin(rotX),cy=Math.cos(rotY),sy=Math.sin(rotY);
  const ry=y*cx-z*sx, rz=y*sx+z*cx;
  return new THREE.Vector3(x*cy+rz*sy, ry, -x*sy+rz*cy);
}

function updateGeometry() {
  const {d1,d2,d3,d4,rotX,rotY}=state;
  for (let i=0;i<16;i++) {
    projected[i].copy(project4D(TESS_V[i],d1,d2,d3,d4,rotX,rotY));
    vertPositions[i*3]=projected[i].x; vertPositions[i*3+1]=projected[i].y; vertPositions[i*3+2]=projected[i].z;
    glowSprites[i].position.copy(projected[i]);
  }
  vertGeo.attributes.position.needsUpdate=true;
  for (let i=0;i<TESS_EDGES.length;i++) {
    const [a,b]=TESS_EDGES[i], base=i*6;
    edgePositions[base]=projected[a].x;   edgePositions[base+1]=projected[a].y; edgePositions[base+2]=projected[a].z;
    edgePositions[base+3]=projected[b].x; edgePositions[base+4]=projected[b].y; edgePositions[base+5]=projected[b].z;
  }
  edgeGeo.attributes.position.needsUpdate=true;

  // Update face meshes (only valid in dim 3+)
  if (currentDim >= 3 || isTransitioning) {
    CUBE_FACES.forEach((f, fi) => {
      const pts = f.verts.map(v => projected[v]);
      const pa = faceMeshes[fi].mesh.geometry.attributes.position.array;
      pts.forEach((p,k) => { pa[k*3]=p.x; pa[k*3+1]=p.y; pa[k*3+2]=p.z; });
      faceMeshes[fi].mesh.geometry.attributes.position.needsUpdate=true;
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// CSS LABEL SYSTEM — anchored to 3D points
// ═══════════════════════════════════════════════════════════════════
const labelContainer = document.createElement('div');
labelContainer.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:15;';
document.body.appendChild(labelContainer);

function toScreen(worldPos) {
  const v = worldPos.clone().project(camera);
  return {
    x: (v.x*0.5+0.5)*window.innerWidth,
    y: (-v.y*0.5+0.5)*window.innerHeight,
  };
}

class AnchoredLabel {
  constructor({ tag, detail, color='#4ab4f0', offsetX=0, offsetY=-28 }) {
    this.el = document.createElement('div');
    this.el.style.cssText = `
      position:absolute; pointer-events:none;
      transform:translate(-50%,-50%);
      opacity:0; transition:opacity 0.3s;
      display:flex; flex-direction:column; align-items:center; gap:3px;
    `;
    this.tagEl = document.createElement('div');
    this.tagEl.textContent = tag;
    this.tagEl.style.cssText = `
      font-family:'Space Mono',monospace; font-size:9px;
      font-weight:700; letter-spacing:0.18em;
      color:${color}; background:rgba(4,4,13,0.85);
      padding:2px 7px; border:1px solid ${color}44;
      border-radius:2px; white-space:nowrap;
    `;
    this.detailEl = document.createElement('div');
    this.detailEl.style.cssText = `
      font-family:'Space Mono',monospace; font-size:9px;
      color:#8ab4cc; background:rgba(4,4,13,0.92);
      border:1px solid #1a3a5a; border-radius:3px;
      padding:6px 10px; white-space:pre; line-height:1.7;
      max-width:220px; text-align:center;
      opacity:0; transform:translateY(4px);
      transition:opacity 0.25s, transform 0.25s;
    `;
    this.detailEl.textContent = detail;
    this.el.appendChild(this.tagEl);
    this.el.appendChild(this.detailEl);
    labelContainer.appendChild(this.el);
    this.offsetX = offsetX; this.offsetY = offsetY;
    this.visible = false; this.detailVisible = false;
  }
  setPos(worldPos) {
    const s = toScreen(worldPos);
    this.el.style.left = (s.x + this.offsetX) + 'px';
    this.el.style.top  = (s.y + this.offsetY) + 'px';
  }
  show(showDetail=false) {
    this.el.style.opacity = '1';
    this.visible = true;
    if (showDetail) {
      this.detailEl.style.opacity='1';
      this.detailEl.style.transform='translateY(0)';
      this.detailVisible=true;
    } else {
      this.detailEl.style.opacity='0';
      this.detailEl.style.transform='translateY(4px)';
      this.detailVisible=false;
    }
  }
  hide() { this.el.style.opacity='0'; this.visible=false; this.detailVisible=false; }
  remove() { this.el.remove(); }
}

// Label pools per dimension — rebuilt on each dim change
let activeLabels = [];
function clearLabels() { activeLabels.forEach(l=>l.remove()); activeLabels=[]; }

// Timeline line endpoints in world space
const LINE_START = new THREE.Vector3(), LINE_END = new THREE.Vector3();

function buildLabelsForDim(d) {
  clearLabels();
  if (d===0) return; // 0D: identity panel handles it

  if (d===1) {
    // Timeline nodes along the line
    TIMELINE_NODES.forEach((node,i) => {
      const colors=['#4ab4f0','#39ff8a','#ff7043','#9c6bff','#ffdc50'];
      const l = new AnchoredLabel({ tag:node.tag, detail:`${node.label}\n${node.detail}`, color:colors[i], offsetY: i%2===0 ? -36 : 36 });
      l._t = node.t;
      l._type = 'timeline';
      activeLabels.push(l);
    });
  }

  if (d===2) {
    // Skill clusters at 4 square vertices (indices 0–3 in tesseract)
    const vtxMap=[0,1,2,3]; // square uses first 4 verts
    SKILL_VERTICES.forEach((sv,i) => {
      const offsets=[{x:-8,y:-36},{x:8,y:-36},{x:8,y:36},{x:-8,y:36}];
      const colors=['#4ab4f0','#9c6bff','#00e5ff','#39ff8a'];
      const l = new AnchoredLabel({ tag:sv.tag, detail:`${sv.label}\n${sv.detail}`, color:colors[i], offsetX:offsets[i].x, offsetY:offsets[i].y });
      l._vertIdx = vtxMap[i];
      l._type = 'vertex';
      activeLabels.push(l);
    });
  }

  if (d===3) {
    // Data at cube vertices
    CUBE_VERTEX_DATA.forEach((cv,i) => {
      const l = new AnchoredLabel({ tag:cv.tag, detail:`${cv.label}\n${cv.detail}`, color:'#4ab4f0', offsetY:-34 });
      l._vertIdx = i;
      l._type = 'vertex';
      activeLabels.push(l);
    });
    // Face center labels (short tag only — detail on hover handled by face hover)
    CUBE_FACES.forEach((f,fi) => {
      const col = '#'+f.color.toString(16).padStart(6,'0');
      const l = new AnchoredLabel({ tag:f.name, detail: f.skills.join('\n'), color:col, offsetY:-16 });
      l._faceIdx = fi;
      l._type = 'face';
      activeLabels.push(l);
    });
  }

  if (d===4) {
    // Outer vertices (8–15) = impact metrics
    IMPACT_OUTER.forEach((io,i) => {
      const l = new AnchoredLabel({ tag:io.tag, detail:`${io.label}\n${io.detail}`, color:'#00e5ff', offsetY:-34 });
      l._vertIdx = 8+i;
      l._type = 'vertex';
      activeLabels.push(l);
    });
    // Inner vertices (0–7) label = driven-by tech
    CUBE_VERTEX_DATA.forEach((cv,i) => {
      const l = new AnchoredLabel({ tag:cv.tag, detail:cv.detail, color:'#ff7043', offsetY:30 });
      l._vertIdx = i;
      l._type = 'vertex';
      activeLabels.push(l);
    });
  }
}

function updateLabelPositions(elapsed) {
  activeLabels.forEach(l => {
    if (l._type==='timeline') {
      // Interpolate along the line between projected[0] and projected[1]
      const pos = projected[0].clone().lerp(projected[1], l._t);
      l.setPos(pos);
      l.show(l.detailVisible);
    } else if (l._type==='vertex') {
      if (l._vertIdx!==undefined) {
        l.setPos(projected[l._vertIdx]);
        l.show(l.detailVisible);
      }
    } else if (l._type==='face') {
      // Face center = average of its vertices
      const f = CUBE_FACES[l._faceIdx];
      const center = new THREE.Vector3();
      f.verts.forEach(v => center.add(projected[v]));
      center.divideScalar(4);
      l.setPos(center);
      l.show(l.detailVisible);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// HIT DETECTION
// ═══════════════════════════════════════════════════════════════════
function hitTest(mx, my) {
  if (currentDim===0) return { type:'vertex', index:0 };
  const VR=26, ER=16, FR=40;

  // Vertices
  for (let i=0;i<16;i++) {
    const s=toScreen(projected[i]);
    if (Math.hypot(mx-s.x,my-s.y)<VR) return { type:'vertex', index:i };
  }
  // Face centers (dim 3+)
  if (currentDim>=3) {
    for (let fi=0;fi<CUBE_FACES.length;fi++) {
      const f=CUBE_FACES[fi];
      const center=new THREE.Vector3();
      f.verts.forEach(v=>center.add(projected[v]));
      center.divideScalar(4);
      const s=toScreen(center);
      if (Math.hypot(mx-s.x,my-s.y)<FR) return { type:'face', index:fi };
    }
  }
  // Edges
  for (let i=0;i<TESS_EDGES.length;i++) {
    const [a,b]=TESS_EDGES[i];
    const sa=toScreen(projected[a]), sb=toScreen(projected[b]);
    if (Math.hypot(mx-(sa.x+sb.x)/2, my-(sa.y+sb.y)/2)<ER) return { type:'edge', index:i };
  }
  return { type:'none', index:-1 };
}

// ═══════════════════════════════════════════════════════════════════
// HOVER SYSTEM
// ═══════════════════════════════════════════════════════════════════
function updateHover(mx, my) {
  if (INTERACT.isDragging) return;
  const hit = hitTest(mx, my);

  // Reset
  hoverSpriteV.material.opacity=0;
  edgeHlMat.opacity=0;
  for (let i=0;i<edgeBaseColors.length;i++) edgeColors[i]=edgeBaseColors[i];
  edgeGeo.attributes.color.needsUpdate=true;
  INTERACT.hoveredVertex=-1; INTERACT.hoveredEdge=-1; INTERACT.hoveredFace=-1;

  // Reset face glow & labels to base
  faceMeshes.forEach((fm,fi) => {
    if (!fm.hovered) gsap.to(fm.mesh.material, { opacity:currentDim>=3?0.06:0, duration:0.3 });
  });
  activeLabels.forEach(l => { if (l.detailVisible) { l.detailEl.style.opacity='0'; l.detailEl.style.transform='translateY(4px)'; l.detailVisible=false; } });

  if (hit.type==='vertex') {
    INTERACT.hoveredVertex=hit.index;
    hoverSpriteV.position.copy(projected[hit.index]);
    hoverSpriteV.material.opacity=0.7;
    renderer.domElement.style.cursor='grab';
    // Show detail for matching label
    activeLabels.filter(l=>l._type==='vertex'&&l._vertIdx===hit.index).forEach(l=>l.show(true));
  } else if (hit.type==='face') {
    INTERACT.hoveredFace=hit.index;
    renderer.domElement.style.cursor='pointer';
    gsap.to(faceMeshes[hit.index].mesh.material, { opacity:0.22, duration:0.3 });
    faceMeshes[hit.index].hovered=true;
    activeLabels.filter(l=>l._type==='face'&&l._faceIdx===hit.index).forEach(l=>l.show(true));
  } else if (hit.type==='edge' && currentDim<4) {
    INTERACT.hoveredEdge=hit.index;
    renderer.domElement.style.cursor='crosshair';
    const [a,b]=TESS_EDGES[hit.index];
    const base=hit.index*6;
    for (let k=0;k<6;k+=3){ edgeColors[base+k]=1;edgeColors[base+k+1]=1;edgeColors[base+k+2]=1; }
    edgeGeo.attributes.color.needsUpdate=true;
    const pa=edgeHlGeo.attributes.position.array;
    pa[0]=projected[a].x;pa[1]=projected[a].y;pa[2]=projected[a].z;
    pa[3]=projected[b].x;pa[4]=projected[b].y;pa[5]=projected[b].z;
    edgeHlGeo.attributes.position.needsUpdate=true;
    edgeHlMat.opacity=0.9;
    // Show timeline label on hover in dim 1
    if (currentDim===1) {
      activeLabels.forEach(l=>{ if(l._type==='timeline') l.show(false); });
    }
  } else {
    renderer.domElement.style.cursor='default';
    faceMeshes.forEach(fm=>{ fm.hovered=false; });
  }
}

// ═══════════════════════════════════════════════════════════════════
// DRAG / POINTER
// ═══════════════════════════════════════════════════════════════════
function getPos(e) {
  return e.touches ? { x:e.touches[0].clientX, y:e.touches[0].clientY } : { x:e.clientX, y:e.clientY };
}
function onDown(e) {
  const pos=getPos(e);
  const hit=hitTest(pos.x,pos.y);
  INTERACT.isDragging=true;
  INTERACT.dragStartScreen={...pos};
  INTERACT.lastScreen={...pos};
  INTERACT.pullProgress=0;
  autoRotate=false;
  if (hit.type==='edge'&&currentDim<4) {
    INTERACT.mode='edge-pull'; INTERACT.hoveredEdge=hit.index;
    const [a,b]=TESS_EDGES[hit.index];
    INTERACT.pullOrigin3D.copy(projected[a]).add(projected[b]).multiplyScalar(0.5);
    INTERACT.pullDir3D.copy(INTERACT.pullOrigin3D).normalize();
    pullMat.opacity=0.9;
    renderer.domElement.style.cursor='crosshair';
  } else {
    INTERACT.mode='rotate';
    renderer.domElement.style.cursor='grabbing';
  }
}
function onMove(e) {
  const pos=getPos(e);
  if (!INTERACT.isDragging) { updateHover(pos.x,pos.y); return; }
  const dx=pos.x-INTERACT.lastScreen.x, dy=pos.y-INTERACT.lastScreen.y;
  INTERACT.lastScreen={...pos};

  if (INTERACT.mode==='rotate') {
    state.rotX+=dy*0.006; state.rotY+=dx*0.006;
  } else if (INTERACT.mode==='edge-pull') {
    const tdx=pos.x-INTERACT.dragStartScreen.x, tdy=pos.y-INTERACT.dragStartScreen.y;
    INTERACT.pullProgress=Math.min(1,Math.hypot(tdx,tdy)/120);
    const end=INTERACT.pullOrigin3D.clone().addScaledVector(INTERACT.pullDir3D,INTERACT.pullProgress*2.5);
    const pa=pullGeo.attributes.position.array;
    pa[0]=INTERACT.pullOrigin3D.x;pa[1]=INTERACT.pullOrigin3D.y;pa[2]=INTERACT.pullOrigin3D.z;
    pa[3]=end.x;pa[4]=end.y;pa[5]=end.z;
    pullGeo.attributes.position.needsUpdate=true;
    if (INTERACT.pullProgress>=0.80&&!isTransitioning) { transitionTo(currentDim+1); }
  }
  // 0D exception
  if (currentDim===0&&!isTransitioning&&(pos.x-INTERACT.dragStartScreen.x)>80) transitionTo(1);
}
function onUp() {
  INTERACT.isDragging=false; INTERACT.mode='none'; INTERACT.pullProgress=0;
  pullMat.opacity=0;
  for (let i=0;i<edgeBaseColors.length;i++) edgeColors[i]=edgeBaseColors[i];
  edgeGeo.attributes.color.needsUpdate=true;
  hoverSpriteV.material.opacity=0;
  renderer.domElement.style.cursor='default';
  if (currentDim>=2) setTimeout(()=>{ autoRotate=true; },2000);
}
renderer.domElement.addEventListener('mousedown',onDown);
window.addEventListener('mousemove',onMove);
window.addEventListener('mouseup',onUp);
renderer.domElement.addEventListener('touchstart',onDown,{passive:true});
window.addEventListener('touchmove',onMove,{passive:true});
window.addEventListener('touchend',onUp);

// ═══════════════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════════════
function transitionTo(d) {
  if (isTransitioning||d===currentDim||d<0||d>4) return;
  isTransitioning=true; currentDim=d;
  gsap.to(state,{ ...DIM_PROPS[d], duration:1.8, ease:'power3.inOut', onComplete:()=>{ isTransitioning=false; }});
  if (d>=2) { autoRotate=true; autoRotSpeed.x=0.0012+d*0.0003; autoRotSpeed.y=0.002+d*0.0004; }
  // Stagger face opacity on entering dim 3
  if (d===3) {
    setTimeout(()=>{
      faceMeshes.forEach((fm,i)=>{ setTimeout(()=>gsap.to(fm.mesh.material,{opacity:0.06,duration:0.6}),i*120); });
    },800);
  } else if (d<3) {
    faceMeshes.forEach(fm=>gsap.to(fm.mesh.material,{opacity:0,duration:0.4}));
  }
  updateHUD(d);
  setTimeout(()=>buildLabelsForDim(d), d===0?100:900);
}

function jumpTo(d) {
  if (d===currentDim) return;
  isTransitioning=true; currentDim=d;
  gsap.to(state,{ ...DIM_PROPS[d], duration:1.6, ease:'power3.inOut', onComplete:()=>{ isTransitioning=false; }});
  if (d===3||d===4) {
    setTimeout(()=>{ faceMeshes.forEach((fm,i)=>{ setTimeout(()=>gsap.to(fm.mesh.material,{opacity:0.06,duration:0.6}),i*80); }); },600);
  } else {
    faceMeshes.forEach(fm=>gsap.to(fm.mesh.material,{opacity:0,duration:0.4}));
  }
  updateHUD(d);
  setTimeout(()=>buildLabelsForDim(d),900);
}

// ═══════════════════════════════════════════════════════════════════
// HUD
// ═══════════════════════════════════════════════════════════════════
const DIM_META = [
  { num:'0',name:'Point',    formula:'dim(∅) = 0\n{x₀} ∈ ℝ⁰',   v:1, e:0,  f:0,  c:0,  instruction:'drag the point → to unfold the first dimension' },
  { num:'1',name:'Line',     formula:'dim(V) = 1\nf: ℝ → ℝ',     v:2, e:1,  f:0,  c:0,  instruction:'hover nodes on the line  ·  drag an edge ↑ to sweep into 2D' },
  { num:'2',name:'Square',   formula:'dim(V) = 2\nf: ℝ² → ℝ²',   v:4, e:4,  f:1,  c:0,  instruction:'hover vertices for skills  ·  drag an edge ↗ to extrude into 3D' },
  { num:'3',name:'Cube',     formula:'dim(V) = 3\nf: ℝ³ → ℝ³',   v:8, e:12, f:6,  c:1,  instruction:'hover faces & vertices  ·  drag an edge to project into 4D' },
  { num:'4',name:'Tesseract',formula:'dim(V) = 4\nf: ℝ⁴ → ℝ⁴',   v:16,e:32, f:24, c:8,  instruction:'outer cube = impact metrics  ·  inner cube = tech stack  ·  drag to rotate' },
];
function updateHUD(d) {
  const m=DIM_META[d];
  const numEl=document.getElementById('dim-number');
  gsap.to(numEl,{opacity:0,duration:0.2,onComplete:()=>{ numEl.textContent=m.num; gsap.to(numEl,{opacity:0.10,duration:0.5}); }});
  document.getElementById('dim-name').textContent=m.name;
  document.getElementById('math-formula').innerHTML=m.formula.replace('\n','<br>');
  const cu=(id,v)=>{ const el=document.getElementById(id),old=parseInt(el.textContent)||0; gsap.to({v:old},{v,duration:0.7,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(this.targets()[0].v)}}); };
  cu('s-v',m.v);cu('s-e',m.e);cu('s-f',m.f);cu('s-c',m.c);
  document.getElementById('instruction-text').textContent=m.instruction;
  // Hide generic content panel — data is now IN the geometry
  const panel=document.getElementById('content-panel');
  panel.classList.remove('visible');
  gsap.to(panel,{opacity:0,duration:0.2});
  document.querySelectorAll('.ndot').forEach((dot,i)=>dot.classList.toggle('active',i===d));
  axisArrows.forEach((arrow,i)=>{
    const ops=[[0,0,0,0],[0.9,0,0,0],[0.7,0.9,0,0],[0.6,0.6,0.9,0],[0.5,0.5,0.5,0.8]];
    const op=ops[d][i];
    gsap.to(arrow.line.material,{opacity:op*0.5,duration:0.8});
    gsap.to(arrow.cone.material,{opacity:op*0.8,duration:0.8});
  });
  glowSprites.forEach(s=>gsap.to(s.material,{opacity:[0.55,0.45,0.3,0.25,0.2][d]*0.8,duration:0.8}));
  gsap.to(edgeMat,{opacity:[0,0.5,0.7,0.85,1.0][d],duration:0.8});
  gsap.to(vertMat,{opacity:d===0?0.95:0.5,duration:0.6});
  vertMat.size=d===0?0.22:0.10;
}

// Nav dots + keyboard
document.getElementById('nav-dots').style.pointerEvents='all';
document.getElementById('nav-dots').addEventListener('click',e=>{ const dot=e.target.closest('.ndot'); if(dot) jumpTo(parseInt(dot.dataset.d)); });
window.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'||e.key===' ')transitionTo(currentDim+1); if(e.key==='ArrowLeft')transitionTo(currentDim-1); });

// Axis arrows
const AXIS_DIRS=[new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(0.6,0.6,0.5).normalize()];
const AXIS_COLS=[0x4ab4f0,0x39ff8a,0xff7043,0x9c6bff];
const axisGroup=new THREE.Group(); scene.add(axisGroup);
const axisArrows=[];
AXIS_DIRS.forEach((dir,i)=>{ const a=new THREE.ArrowHelper(dir,new THREE.Vector3(),5.5,AXIS_COLS[i],0.35,0.18); a.line.material.transparent=true;a.line.material.opacity=0;a.cone.material.transparent=true;a.cone.material.opacity=0; axisArrows.push(a);axisGroup.add(a); });

// ═══════════════════════════════════════════════════════════════════
// 0D IDENTITY SCREEN
// ═══════════════════════════════════════════════════════════════════
const identityEl = document.createElement('div');
identityEl.style.cssText=`position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;z-index:12;`;
identityEl.innerHTML=`
  <div style="font-family:'Space Mono',monospace;font-size:clamp(22px,4vw,48px);font-weight:700;
    color:#fff;letter-spacing:0.06em;text-shadow:0 0 60px rgba(74,180,240,0.6);margin-bottom:16px;line-height:1.1;">
    PAVAN TEJA<br>TALLAPALLI
  </div>
  <div style="font-family:'Inter',sans-serif;font-size:clamp(11px,1.6vw,15px);
    color:#4ab4f0;letter-spacing:0.1em;opacity:0.85;max-width:500px;line-height:1.8;margin-bottom:20px;">
    Building intelligent systems at the intersection of<br>
    data science, machine learning, and distributed networks
  </div>
  <div style="font-family:'Space Mono',monospace;font-size:9px;color:#334a66;letter-spacing:0.2em;">
    ptallap2@asu.edu &nbsp;·&nbsp; (602) 756-5938 &nbsp;·&nbsp; M.S. Data Science · ASU · F-1 OPT
  </div>
`;
document.body.appendChild(identityEl);

let identityHidden=false;

// ═══════════════════════════════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════════════════════════════
const NPART=600;
const pp=new Float32Array(NPART*3), pv=[], pc=new Float32Array(NPART*3);
const PCOLS=[new THREE.Color(0x4ab4f0),new THREE.Color(0x00e5ff),new THREE.Color(0x9c6bff),new THREE.Color(0x39ff8a)];
for(let i=0;i<NPART;i++){
  pp[i*3]=(Math.random()-0.5)*30;pp[i*3+1]=(Math.random()-0.5)*20;pp[i*3+2]=(Math.random()-0.5)*15-5;
  pv.push((Math.random()-0.5)*0.008,(Math.random()-0.5)*0.006,(Math.random()-0.5)*0.004);
  const c=PCOLS[i%4];pc[i*3]=c.r;pc[i*3+1]=c.g;pc[i*3+2]=c.b;
}
const partGeo=new THREE.BufferGeometry();
partGeo.setAttribute('position',new THREE.BufferAttribute(pp,3));
partGeo.setAttribute('color',new THREE.BufferAttribute(pc,3));
scene.add(new THREE.Points(partGeo,new THREE.PointsMaterial({vertexColors:true,size:0.055,transparent:true,opacity:0.45,sizeAttenuation:true})));

// ═══════════════════════════════════════════════════════════════════
// INTRO
// ═══════════════════════════════════════════════════════════════════
edgeMat.opacity=0; vertMat.opacity=0;
glowSprites.forEach(s=>{ s.material.opacity=0; });
faceMeshes.forEach(fm=>{ fm.mesh.material.opacity=0; });

gsap.timeline({delay:0.4})
  .to(vertMat,{opacity:0.95,duration:1.2,ease:'power2.out'})
  .to(identityEl,{opacity:1,duration:1.2,ease:'power2.out'},0.6)
  .call(()=>{ glowSprites.forEach(s=>gsap.to(s.material,{opacity:0.55,duration:1})); updateHUD(0); },null,0.8);

// ═══════════════════════════════════════════════════════════════════
// RENDER LOOP
// ═══════════════════════════════════════════════════════════════════
function animate() {
  requestAnimationFrame(animate);
  const elapsed=clock.getElapsedTime();

  if (autoRotate&&!INTERACT.isDragging) {
    state.rotX+=autoRotSpeed.x+Math.sin(elapsed*0.23)*0.0003;
    state.rotY+=autoRotSpeed.y+Math.cos(elapsed*0.17)*0.0004;
  }

  // Identity panel show/hide
  if (currentDim>0&&!identityHidden) { identityHidden=true; gsap.to(identityEl,{opacity:0,duration:0.5}); }
  if (currentDim===0&&identityHidden&&!isTransitioning) { identityHidden=false; gsap.to(identityEl,{opacity:1,duration:0.6}); }

  camera.position.x=Math.sin(elapsed*0.07)*0.35;
  camera.position.y=Math.cos(elapsed*0.05)*0.22;
  gridGroup.rotation.z=elapsed*0.004;

  // 0D pulse
  if (currentDim===0&&!isTransitioning) {
    const pulse=Math.sin(elapsed*1.8)*0.5+0.5;
    glowSprites[0].material.opacity=0.4+pulse*0.45;
    glowSprites[0].scale.setScalar(0.5+pulse*0.45);
    vertMat.size=0.18+pulse*0.08;
  }

  // Edge pull color feedback
  if (INTERACT.mode==='edge-pull'&&INTERACT.hoveredEdge>=0) {
    const p=INTERACT.pullProgress, base=INTERACT.hoveredEdge*6;
    edgeColors[base]=1-p;edgeColors[base+1]=1;edgeColors[base+2]=1-p;
    edgeColors[base+3]=1-p;edgeColors[base+4]=1;edgeColors[base+5]=1-p;
    edgeGeo.attributes.color.needsUpdate=true;
  }

  // Particles
  for(let i=0;i<NPART;i++){
    pp[i*3]+=pv[i*3];pp[i*3+1]+=pv[i*3+1];pp[i*3+2]+=pv[i*3+2];
    if(Math.abs(pp[i*3])>15)pp[i*3]*=-0.98;
    if(Math.abs(pp[i*3+1])>10)pp[i*3+1]*=-0.98;
  }
  partGeo.attributes.position.needsUpdate=true;

  updateGeometry();
  updateLabelPositions(elapsed);
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
});