import * as THREE from 'three';
import gsap from 'gsap';
import './style.css'; 

// --- 1. Scene Setup ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050510, 0.05);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Add the background grid
const gridHelper = new THREE.GridHelper(50, 50, 0x112233, 0x112233);
gridHelper.rotation.x = Math.PI / 2;
gridHelper.position.z = -5;
scene.add(gridHelper);

// --- 2. Tesseract Mathematics ---
// A tesseract has 16 vertices and 32 edges. 
const targetVertices = [];
for (let i = 0; i < 16; i++) {
    targetVertices.push({
        x: (i & 1) ? 1 : -1,
        y: (i & 2) ? 1 : -1,
        z: (i & 4) ? 1 : -1,
        w: (i & 8) ? 1 : -1
    });
}

const edgeIndices = [];
for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 4; j++) {
        const neighbor = i ^ (1 << j);
        if (i < neighbor) { // Prevent drawing duplicate lines
            edgeIndices.push(i, neighbor);
        }
    }
}

// Create geometry buffers
const lineGeo = new THREE.BufferGeometry();
const linePositions = new Float32Array(edgeIndices.length * 3); 
lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
const lineMat = new THREE.LineBasicMaterial({ color: 0x5E81AC, transparent: true, opacity: 0.6 });
const lines = new THREE.LineSegments(lineGeo, lineMat);
scene.add(lines);

const pointGeo = new THREE.BufferGeometry();
const pointPositions = new Float32Array(16 * 3);
pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
const pointMat = new THREE.PointsMaterial({ color: 0x88C0D0, size: 0.2, transparent: true, opacity: 1.0 });
const points = new THREE.Points(pointGeo, pointMat);
scene.add(points);

// --- 3. Animation State ---
// These variables control the expansion into each dimension (0 to 1)
const state = {
    d1: 0, // X-axis (Line)
    d2: 0, // Y-axis (Square)
    d3: 0, // Z-axis (Cube)
    d4: 0, // W-axis (Tesseract)
    rotateX: 0,
    rotateY: 0
};

let currentDimension = 0;
let isTransitioning = false;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// --- 4. Render Loop & 4D Projection ---
function animate() {
    requestAnimationFrame(animate);

    const SIZE = 3; 
    const W_CAM = 2.5; 
    const currentPositions = [];

    // Auto-rotation for visual flair
    if (!isDragging && currentDimension > 1) {
        state.rotateX += 0.002;
        state.rotateY += 0.003;
    }

    // Calculate vertex positions based on current dimensional state
    for (let i = 0; i < 16; i++) {
        const tv = targetVertices[i];
        
        let x = tv.x * state.d1 * SIZE;
        let y = tv.y * state.d2 * SIZE;
        let z = tv.z * state.d3 * SIZE;
        let w = tv.w * state.d4; 
        
        // 4D to 3D Perspective Projection (creates the inner/outer cube effect)
        let w_factor = 1;
        if (state.d4 > 0) {
            w_factor = W_CAM / (W_CAM - w * 1.2); 
        }

        let projX = x * w_factor;
        let projY = y * w_factor;
        let projZ = z * w_factor;

        // Apply 3D Rotation
        let rx = projX;
        let ry = projY * Math.cos(state.rotateX) - projZ * Math.sin(state.rotateX);
        let rz = projY * Math.sin(state.rotateX) + projZ * Math.cos(state.rotateX);

        let finalX = rx * Math.cos(state.rotateY) + rz * Math.sin(state.rotateY);
        let finalY = ry;
        let finalZ = -rx * Math.sin(state.rotateY) + rz * Math.cos(state.rotateY);

        currentPositions.push({ x: finalX, y: finalY, z: finalZ });

        pointPositions[i * 3] = finalX;
        pointPositions[i * 3 + 1] = finalY;
        pointPositions[i * 3 + 2] = finalZ;
    }

    // Connect the edges
    for (let i = 0; i < edgeIndices.length; i++) {
        const vIndex = edgeIndices[i];
        const pos = currentPositions[vIndex];
        linePositions[i * 3] = pos.x;
        linePositions[i * 3 + 1] = pos.y;
        linePositions[i * 3 + 2] = pos.z;
    }

    pointGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}
animate();

// --- 5. Interaction Mechanics ---
window.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    // Manual rotation for higher dimensions
    if (currentDimension > 0) {
        state.rotateY += deltaX * 0.005;
        state.rotateX += deltaY * 0.005;
    }

    // Drag detection to trigger transitions
    if (!isTransitioning) {
        if (currentDimension === 0 && deltaX > 40) transitionTo(1);
        else if (currentDimension === 1 && deltaY < -40) transitionTo(2);
        else if (currentDimension === 2 && Math.abs(deltaX) > 40) transitionTo(3);
        else if (currentDimension === 3 && Math.abs(deltaY) > 40) transitionTo(4);
    }

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// --- 6. Dimensional Transitions & Data Mapping ---
function updateUI(title, subtitle, instruction) {
    document.getElementById('title').innerText = title;
    document.getElementById('subtitle').innerHTML = subtitle; // using innerHTML for line breaks
    document.getElementById('instruction').innerText = instruction;
}

function transitionTo(targetDim) {
    isTransitioning = true;
    currentDimension = targetDim;
    
    const duration = 1.5;
    const ease = "power2.out";

    if (targetDim === 1) {
        gsap.to(state, { d1: 1, duration, ease, onComplete: () => isTransitioning = false });
        updateUI(
            "Timeline", 
            "M.S. Data Science (ASU) • SDE (Jio Platforms) • SDE (BSNL)", 
            "↑ Drag UP to sweep into 2D (Skills)"
        );
    } 
    else if (targetDim === 2) {
        gsap.to(state, { d2: 1, duration, ease, onComplete: () => isTransitioning = false });
        updateUI(
            "Core Skills", 
            "Python, SQL, C++, PySpark, ML, LLMs, ETL pipelines", 
            "→ Drag RIGHT to fold into 3D (Projects)"
        );
    }
    else if (targetDim === 3) {
        gsap.to(state, { d3: 1, duration, ease, onComplete: () => isTransitioning = false });
        updateUI(
            "Key Projects", 
            "AI Finance Agent (MCP server polling)<br/>CRISPR Scrollytelling (Genomic physical trait prediction for GenAI)", 
            "↓ Drag DOWN to unfold 4D (Impact)"
        );
    }
    else if (targetDim === 4) {
        gsap.to(state, { d4: 1, duration, ease, onComplete: () => isTransitioning = false });
        updateUI(
            "Measurable Impact", 
            "12% uptime inc. • 40% less false alerts • 8k+ devices managed", 
            "Welcome to the 4th Dimension."
        );
    }
}

// --- 7. Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});