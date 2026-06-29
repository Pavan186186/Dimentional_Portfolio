import * as THREE from 'three';
// Note: In a real Vite project, you would run `npm install three gsap`
// import gsap from 'gsap';

// 1. Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050510, 0.05);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Grid Helper for that UI feel
const gridHelper = new THREE.GridHelper(50, 50, 0x112233, 0x112233);
gridHelper.rotation.x = Math.PI / 2;
scene.add(gridHelper);

// 2. State & Geometry
let currentDimension = 0; // 0 = Point, 1 = Line, 2 = Square, 3 = Cube, 4 = Tesseract
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// The Geometry Material (Glowing Cyan)
const material = new THREE.MeshBasicMaterial({ 
    color: 0x88c0d0, 
    wireframe: true,
    transparent: true,
    opacity: 0.8
});

// The initial 0D Point (represented as a small sphere)
const pointGeo = new THREE.SphereGeometry(0.2, 16, 16);
const activeMesh = new THREE.Mesh(pointGeo, material);
scene.add(activeMesh);

// 3. Interaction (Raycaster & Mouse)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    // Logic to detect "pulling" to the next dimension
    if (currentDimension === 0 && deltaX > 50) {
        transitionTo1D();
    } else if (currentDimension === 1 && deltaY < -50) {
        transitionTo2D();
    }
    // Add logic for 3D and 4D based on specific drag patterns

    if(currentDimension > 1) {
        // Rotate object if dragging in higher dimensions
        activeMesh.rotation.y += deltaX * 0.01;
        activeMesh.rotation.x += deltaY * 0.01;
    }

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// 4. Dimensional Transitions
function transitionTo1D() {
    if (currentDimension !== 0) return;
    currentDimension = 1;
    
    // Morph Geometry: Point to Line (Timeline)
    const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    lineGeo.rotateZ(Math.PI / 2);
    activeMesh.geometry.dispose();
    activeMesh.geometry = lineGeo;
    
    // Update UI Content
    document.getElementById('title').innerText = "Timeline";
    document.getElementById('subtitle').innerText = "ASU -> Jio Platforms -> BSNL -> JIIT";
    document.getElementById('instruction').innerText = "Drag UP to sweep into 2D (Skills)";
}

function transitionTo2D() {
    if (currentDimension !== 1) return;
    currentDimension = 2;
    
    // Morph Geometry: Line to Plane (Square)
    const planeGeo = new THREE.PlaneGeometry(8, 8);
    activeMesh.geometry.dispose();
    activeMesh.geometry = planeGeo;
    
    // Update UI Content
    document.getElementById('title').innerText = "Core Skills";
    document.getElementById('subtitle').innerText = "Python, C++, SQL, Machine Learning, ETL pipelines";
    document.getElementById('instruction').innerText = "Drag to fold into 3D (Projects)";
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Subtle breathing animation for the 0D point
    if (currentDimension === 0) {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.2;
        activeMesh.scale.set(scale, scale, scale);
    }
    
    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});