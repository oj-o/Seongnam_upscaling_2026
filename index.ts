import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// UI Elements
const video = document.getElementById('webcam') as HTMLVideoElement;
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const startScreen = document.getElementById('start-screen')!;
const uiLayer = document.getElementById('ui-layer')!;
const messageBox = document.getElementById('message-box')!;
const gameStatus = document.getElementById('game-status')!;
const instructionOverlay = document.getElementById('instruction-overlay')!;
const nextStageBtn = document.getElementById('next-stage-btn') as HTMLButtonElement;
const manualStartBtn = document.getElementById('manual-start-btn') as HTMLButtonElement;
const endScreen = document.getElementById('end-screen')!;
const collisionFlash = document.getElementById('collision-flash')!;

// Three.js Variables
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let loader: GLTFLoader, stlLoader: STLLoader;
let character: THREE.Object3D | null = null;
let characterVisual: THREE.Mesh | null = null;
let currentItem: THREE.Object3D | null = null;
let endGoal: THREE.Object3D | null = null;
let blocks: THREE.Object3D[] = [];
let videoTexture: THREE.VideoTexture | null = null;

// Game State
let gameState: 'start' | 'tracking' | 'play' | 'ending' = 'start';
let currentStage = 1;
let isInitialized = false;
let messageTimer = 0;
let detectionStartTime = 0;
let stageStartTime = 0;
let lastCollisionTime = 0;

// Constants - CRITICALLY INCREASED
const SPEED = 0.8; // Ultra sensitive
const ROTATION_SPEED = 0.2;
const moveState = { up: false, down: false, left: false, right: false };
const ASSET_PATHS = {
    images: './asset_canvas/images/',
    stl: './asset_canvas/3d/',
    glb: './asset_canvas/glb_3D/'
};

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 8.0));
    const dl = new THREE.DirectionalLight(0xffffff, 6.0);
    dl.position.set(50, 200, 100);
    scene.add(dl);

    // Optimized AR perspective - Character is CLOSER and LARGER
    camera.position.set(0, 45, 60);
    camera.lookAt(0, 0, -80);

    loader = new GLTFLoader();
    stlLoader = new STLLoader();
}

function triggerCollisionEffect() {
    const now = Date.now();
    if (now - lastCollisionTime < 500) return;
    lastCollisionTime = now;

    collisionFlash.style.display = 'block';
    setTimeout(() => { collisionFlash.style.display = 'none'; }, 100);

    if (characterVisual) {
        const originalScale = characterVisual.scale.clone();
        characterVisual.scale.multiplyScalar(1.5);
        setTimeout(() => { if (characterVisual) characterVisual.scale.copy(originalScale); }, 200);
    }
}

function checkCollisions(newPos: THREE.Vector3) {
    if (!character) return false;
    for (const block of blocks) {
        // Increased detection radius for massive blocks
        if (newPos.distanceTo(block.position) < 25.0) {
            triggerCollisionEffect();
            return true;
        }
    }
    return false;
}

async function loadStageAssets(stage: number) {
    if (currentItem) { scene.remove(currentItem); currentItem = null; }
    if (endGoal) { scene.remove(endGoal); endGoal = null; }
    blocks.forEach(b => scene.remove(b));
    blocks = [];

    if (stage === 1) {
        gameStatus.innerText = "STAGE 1: 탐험 시작";
        if (!character) {
            character = new THREE.Group();
            
            // HUGE NEON CORE
            const coreGeo = new THREE.SphereGeometry(8, 24, 24);
            const coreMat = new THREE.MeshPhongMaterial({ 
                color: 0x32FF7E, emissive: 0x32FF7E, emissiveIntensity: 3.0,
                transparent: true, opacity: 0.95
            });
            characterVisual = new THREE.Mesh(coreGeo, coreMat);
            characterVisual.position.y = 8;
            character.add(characterVisual);

            // Large Aura ring
            const ringGeo = new THREE.TorusGeometry(12, 1.2, 12, 48);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x32FF7E });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 8;
            character.add(ring);

            character.position.set(0, 0, -40);
            scene.add(character);
            
            loader.load(`${ASSET_PATHS.glb}canvas1_character.glb`, (gltf: any) => {
                const model = gltf.scene;
                model.scale.setScalar(25.0); // Massive model
                model.position.y = 0;
                character!.add(model);
                if (characterVisual) characterVisual.scale.setScalar(0.4);
            });
        } else {
            character.position.set(0, 0, -40);
            character.visible = true;
        }
    } else if (stage === 2) {
        gameStatus.innerText = "STAGE 2: 장애물 구간";
        // MASSIVE OBSTACLES
        const blockGeo = new THREE.BoxGeometry(35, 35, 35);
        const blockMat = new THREE.MeshPhongMaterial({ 
            color: 0x32FF7E, emissive: 0x224422, transparent: true, opacity: 0.85 
        });

        for (let i = 0; i < 15; i++) {
            const b = new THREE.Mesh(blockGeo, blockMat);
            const side = i % 2 === 0 ? 1 : -1;
            // Larger gaps for navigation
            const xOffset = side * (35 + Math.random() * 20); 
            b.position.set(xOffset, 17.5, -100 - (i * 45));
            scene.add(b);
            blocks.push(b);
        }
    } else if (stage === 3) {
        gameStatus.innerText = "STAGE 3: 최종 목표";
        // Giant Portal
        const goalGeo = new THREE.TorusGeometry(35, 5, 24, 100);
        const goalMat = new THREE.MeshPhongMaterial({ color: 0x4466FF, emissive: 0x4466FF, emissiveIntensity: 3.0 });
        const portal = new THREE.Mesh(goalGeo, goalMat);
        portal.position.set(0, 25, -800);
        endGoal = portal;
        scene.add(portal);

        // Huge Item
        const itemGeo = new THREE.IcosahedronGeometry(18, 0);
        const itemMat = new THREE.MeshPhongMaterial({ color: 0xFFFF00, emissive: 0xFFFF00, emissiveIntensity: 5.0 });
        const gem = new THREE.Mesh(itemGeo, itemMat);
        gem.position.set(0, 40, -700);
        currentItem = gem;
        scene.add(gem);
        
        loader.load(`${ASSET_PATHS.glb}canvas2_item.glb`, (gltf: any) => {
            const m = gltf.scene; m.scale.setScalar(40);
            if (currentItem) {
                m.position.copy(currentItem.position);
                scene.remove(currentItem);
                currentItem = m;
                scene.add(m);
            }
        });
    }
}

function startPlay() {
    if (gameState === 'play') return;
    gameState = 'play';
    instructionOverlay.style.display = 'none';
    uiLayer.style.display = 'block';
    currentStage = 1; stageStartTime = Date.now();
    loadStageAssets(1);
    updateHUD("캐릭터가 소환되었습니다! 하단 영역을 터치하여 목표까지 이동하세요.");
}

function updateHUD(msg: string) {
    messageBox.innerText = msg;
    messageBox.style.opacity = '1';
}

function updatePlay() {
    if (!character) return;
    messageTimer += 1/60;

    const nextPos = character.position.clone();
    let isMoving = false;
    if (moveState.up) { nextPos.z -= SPEED; isMoving = true; }
    if (moveState.down) { nextPos.z += SPEED; isMoving = true; }
    if (moveState.left) { nextPos.x -= SPEED; isMoving = true; }
    if (moveState.right) { nextPos.x += SPEED; isMoving = true; }
    
    nextPos.x = Math.max(-150, Math.min(150, nextPos.x));
    nextPos.z = Math.max(-1000, Math.min(60, nextPos.z));

    if (!checkCollisions(nextPos)) {
        character.position.copy(nextPos);
        if (isMoving) {
            const targetRotation = Math.atan2(nextPos.x - character.position.x, nextPos.z - character.position.z);
            character.rotation.y = THREE.MathUtils.lerp(character.rotation.y, targetRotation, ROTATION_SPEED);
        }
    }

    if (characterVisual) {
        characterVisual.rotation.y += 0.08;
        characterVisual.position.y = 8 + Math.sin(Date.now() * 0.015) * 4;
    }

    if (currentItem && currentItem.visible) {
        currentItem.rotation.y += 0.15;
        currentItem.position.y = 40 + Math.sin(Date.now() * 0.008) * 10;
    }

    const elapsed = Date.now() - stageStartTime;
    if (elapsed > 5000) nextStageBtn.style.display = 'block';

    if (currentStage === 1) {
        if (messageTimer > 10) updateHUD("앞으로 더 전진하여 거대한 장애물 구간을 찾으세요.");
        if (character.position.z < -80) {
            currentStage = 2; stageStartTime = Date.now(); nextStageBtn.style.display = 'none';
            loadStageAssets(2);
            updateHUD("장애물 구간! 거대한 블록들 사이의 길을 찾아 빠르게 이동하세요.");
        }
    } else if (currentStage === 2) {
        if (messageTimer > 10) updateHUD("거의 다 왔습니다! 세번째 구역의 빛나는 문을 찾으세요.");
        if (character.position.z < -650) {
            currentStage = 3; stageStartTime = Date.now(); nextStageBtn.style.display = 'none';
            loadStageAssets(3);
            updateHUD("최종 목표! 황금빛 아이템을 먹고 문으로 탈출하세요.");
        }
    } else if (currentStage === 3) {
        if (currentItem && currentItem.visible && character.position.distanceTo(currentItem.position) < 50) {
            const light = new THREE.PointLight(0xFFFF00, 1000, 500);
            light.position.copy(currentItem.position);
            scene.add(light);
            currentItem.visible = false;
            setTimeout(() => scene.remove(light), 1500);
            updateHUD("아이템 획득 완료! 푸른 거대 문 속으로 들어가세요.");
        }
        if (endGoal && (!currentItem || !currentItem.visible) && character.position.distanceTo(endGoal.position) < 50) {
            startFinalAnimation();
        }
    }
}

function startFinalAnimation() {
    if (gameState === 'ending') return;
    gameState = 'ending';
    const startPos = character!.position.clone();
    const targetPos = endGoal!.position.clone();
    let progress = 0;
    const animate = () => {
        progress += 0.005;
        if (character) {
            character.position.lerpVectors(startPos, targetPos, progress);
            character.scale.setScalar(character.scale.x * 0.95);
            character.rotation.y += 1.0;
        }
        if (progress < 1) requestAnimationFrame(animate);
        else {
            if (character) character.visible = false;
            uiLayer.style.display = 'none';
            endScreen.style.display = 'flex';
        }
    };
    animate();
}

function resetGame() {
    if (video.srcObject) { (video.srcObject as MediaStream).getTracks().forEach(t => t.stop()); video.srcObject = null; }
    gameState = 'start';
    startScreen.style.display = 'flex';
    uiLayer.style.display = 'none';
    instructionOverlay.style.display = 'none';
    endScreen.style.display = 'none';
    manualStartBtn.style.display = 'none';
    nextStageBtn.style.display = 'none';
    scene.background = new THREE.Color(0x000000);
    currentStage = 1;
    if (character) { scene.remove(character); character = null; }
    blocks.forEach(b => scene.remove(b));
    blocks = [];
    if (currentItem) scene.remove(currentItem);
    if (endGoal) scene.remove(endGoal);
}

function loop() {
    if (gameState === 'play') updatePlay();
    if (videoTexture) videoTexture.needsUpdate = true;
    if (scene && camera && renderer) renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

async function init() {
    if (isInitialized) return;
    initThree();
    manualStartBtn.onclick = () => startPlay();
    nextStageBtn.onclick = () => {
        if (!character) return;
        if (currentStage === 1) character.position.z = -100;
        else if (currentStage === 2) character.position.z = -680;
        else if (currentStage === 3) character.position.copy(currentItem ? currentItem.position : endGoal!.position);
        nextStageBtn.style.display = 'none';
    };
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = async () => {
            video.play().catch(() => {});
            try {
                if (screen.orientation && (screen.orientation as any).lock) await (screen.orientation as any).lock('landscape').catch(() => {});
                instructionOverlay.style.display = 'flex';
                manualStartBtn.style.display = 'none';
                
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } });
                video.srcObject = stream;
                await video.play();
                
                videoTexture = new THREE.VideoTexture(video);
                scene.background = videoTexture;
                startScreen.style.display = 'none';
                gameState = 'tracking';
                detectionStartTime = Date.now();
                const checkMotion = () => {
                    if (gameState !== 'tracking') return;
                    if (Date.now() - detectionStartTime > 3000) startPlay();
                    else requestAnimationFrame(checkMotion);
                };
                checkMotion();
                setTimeout(() => { if (gameState === 'tracking') manualStartBtn.style.display = 'block'; }, 5000);
            } catch (err: any) {
                alert("카메라 권한을 확인해주세요.");
                instructionOverlay.style.display = 'none';
            }
        };
    }
    window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    isInitialized = true;
    loop();
}

window.addEventListener('touchstart', (e) => {
    if (gameState !== 'play') return;
    const x = e.touches[0].clientX, y = e.touches[0].clientY, w = window.innerWidth, h = window.innerHeight;
    // Sensitive Quad Zones
    moveState.left = x < w * 0.45; moveState.right = x > w * 0.55; moveState.up = y < h * 0.45; moveState.down = y > h * 0.55;
    if (!(e.target instanceof HTMLButtonElement)) e.preventDefault();
}, { passive: false });
window.addEventListener('touchend', () => { moveState.up = moveState.down = moveState.left = moveState.right = false; });
window.addEventListener('blur', () => { if (gameState === 'play' || gameState === 'tracking') resetGame(); });
init();