import * as THREE from 'three';
import gsap from 'gsap';
import './style.css';

// --- 1. Scene Setup ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050510, 0.05);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const gridHelper = new THREE.GridHelper(50, 50, 0x112233, 0x112233);
gridHelper.rotation.x = Math.PI / 2;
scene.add(gridHelper);

// --- 2. State & Geometry ---
let currentDimension = 0; 
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const material = new THREE.MeshBasicMaterial({ 
    color: 0x88c0d0, 
    wireframe: true,
    transparent: true,
    opacity: 0.8
});

// Start with 0D Point (Sphere)
const pointGeo = new THREE.SphereGeometry(0.2, 16, 16);
const activeMesh = new THREE.Mesh(pointGeo, material);
scene.add(activeMesh);

// --- 3. Interaction Mechanics ---
window.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    // Detect dragging thresholds to trigger transitions
    if (currentDimension === 0 && deltaX > 50) {
        transitionTo1D();
    } else if (currentDimension === 1 && deltaY < -50) {
        transitionTo2D();
    }

    // Rotate object organically if in higher dimensions
    if(currentDimension > 0) {
        activeMesh.rotation.y += deltaX * 0.01;
        activeMesh.rotation.x += deltaY * 0.01;
    }

    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// --- 4. Dimensional Transitions ---
function transitionTo1D() {
    if (currentDimension !== 0) return;
    currentDimension = 1;
    
    // Scale on X axis to simulate stretching into a line
    gsap.to(activeMesh.scale, {
        x: 40,
        y: 0.1,
        z: 0.1,
        duration: 1.5,
        ease: "power2.out"
    });
    
    // Update Data
    document.getElementById('title').innerText = "Timeline";
    document.getElementById('subtitle').innerText = "ASU -> Jio Platforms -> BSNL -> JIIT";
    document.getElementById('instruction').innerText = "Drag UP to sweep into 2D (Skills)";
}

function transitionTo2D() {
    if (currentDimension !== 1) return;
    currentDimension = 2;
    
    // Scale on Y axis to simulate sweeping into a plane
    gsap.to(activeMesh.scale, {
        x: 20,
        y: 20,
        z: 0.1,
        duration: 1.5,
        ease: "power2.out"
    });
    
    // Update Data
    document.getElementById('title').innerText = "Core Skills";
    document.getElementById('subtitle').innerText = "Python, SQL, PySpark, Machine Learning, LLMs, ETL";
    document.getElementById('instruction').innerText = "Drag to fold into 3D (Projects)";
}

// --- 5. Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    
    // Subtle pulsing for the 0D point
    if (currentDimension === 0) {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.2;
        activeMesh.scale.set(scale, scale, scale);
    }
    
    renderer.render(scene, camera);
}
animate();

// --- 6. Handle Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});