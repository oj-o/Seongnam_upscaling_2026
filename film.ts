import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const startScreen = document.getElementById('start-screen')!;
const genOverlay = document.getElementById('generation-overlay')!;
const genTimer = document.getElementById('gen-timer')!;
const stopSaveBtn = document.getElementById('stop-save-btn') as HTMLButtonElement;

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, loader: GLTFLoader;
let character: THREE.Group | null = null;
let currentItem: THREE.Group | null = null;
let endGoal: THREE.Group | null = null;
let blocks: THREE.Mesh[] = [];

let currentStage = 1;
let isInitialized = false;
let demoTime = 0;

// --- Subtitle System ---
const subtitleCanvas = document.createElement('canvas');
const subCtx = subtitleCanvas.getContext('2d')!;
let subtitleTexture: THREE.CanvasTexture;
let subtitleSprite: THREE.Sprite;
let lastSubtitle = "";
let subAlpha = 0;

const SCRIPT = [
    { time: 0, text: "우리는 누구나 자신만의 보이지 않는 지형(Terrain)을 가집니다.", cam: [0, 8, 12], stage: 1 },
    { time: 8, text: "현실의 카메라가 아닌, 오직 내면의 눈으로만 볼 수 있는 땅입니다.", cam: [8, 5, 10], stage: 1 },
    { time: 20, text: "여정의 시작: 디지털로 구축된 마음의 평원 위에 우리 자신(캐릭터)이 서 있습니다.", cam: [0, 3, 8], stage: 1 },
    { time: 40, text: "하지만 진실한 자아에 이르는 길은 평탄하지만은 않습니다.", cam: [0, 8, 12], stage: 2 },
    { time: 60, text: "우리가 세운 방어기제와 사회적 장벽들...", cam: [5, 5, -5], stage: 2 },
    { time: 80, text: "그 딱딱하고 차가운 블록들 사이를 지나 우리는 더 깊은 곳으로 향합니다.", cam: [-5, 5, -8], stage: 2 },
    { time: 110, text: "마주함: 오랫동안 잊고 지냈던 내면의 파편들을 발견합니다.", cam: [0, 3, -6], stage: 3 },
    { time: 140, text: "이 작은 조각들은 우리가 외면했던 순수한 감정의 기록들입니다.", cam: [0, 2, -5], stage: 3 },
    { time: 170, text: "접촉의 순간, 조각은 빛을 발하며 우리의 일부가 됩니다.", cam: [0, 5, -8], stage: 3 },
    { time: 210, text: "이제 마지막 경계를 넘어, 온전한 나 자신과 조우할 시간입니다.", cam: [0, 15, -12], stage: 3 },
    { time: 240, text: "모든 경계는 허물어지고, 우리는 마침내 내면의 평온에 도달합니다.", cam: [0, 2, -13], stage: 3 },
    { time: 280, text: "Mind Terrain: 내면으로의 접촉은 진정한 치유의 시작입니다.", cam: [0, 8, 12], stage: 3 }
];

// --- Audio System ---
let audioCtx: AudioContext | null = null;
let audioDestination: MediaStreamAudioDestinationNode | null = null;

class MusicDirector {
    private oscillators: Map<number, { osc: OscillatorNode, gain: GainNode }> = new Map();
    private masterGain: GainNode | null = null;
    private filter: BiquadFilterNode | null = null;
    private reverb: ConvolverNode | null = null;
    
    private readonly SCALES = {
        OPENING: [261.63, 329.63, 392.00, 493.88, 523.25], 
        TENSION: [261.63, 311.13, 392.00, 466.16, 523.25], 
        CLIMAX: [293.66, 369.99, 440.00, 554.37, 587.33],  
        RESOLUTION: [329.63, 415.30, 493.88, 622.25, 659.25] 
    };

    constructor() {
        if (!audioCtx) return;
        this.masterGain = audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
        this.masterGain.connect(audioCtx.destination);
        if (audioDestination) this.masterGain.connect(audioDestination);
        this.filter = audioCtx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
        this.filter.connect(this.masterGain);
        this.reverb = audioCtx.createConvolver();
        this.setupReverb();
    }

    private setupReverb() {
        if (!audioCtx || !this.reverb) return;
        const length = audioCtx.sampleRate * 3;
        const impulse = audioCtx.createBuffer(2, length, audioCtx.sampleRate);
        for (let i = 0; i < 2; i++) {
            const channel = impulse.getChannelData(i);
            for (let j = 0; j < length; j++) {
                channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
            }
        }
        this.reverb.buffer = impulse;
        this.reverb.connect(this.masterGain!);
    }

    public start() {
        if (!audioCtx || !this.masterGain) return;
        this.masterGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 5);
    }

    private playNote(freq: number, startTime: number, duration: number, volume: number) {
        if (!audioCtx || !this.filter) return;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(volume * 1.5, startTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(g);
        g.connect(this.filter);
        if (this.reverb) g.connect(this.reverb);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    private nextSequenceTime = 0;
    public update(time: number, stage: number) {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        if (now > this.nextSequenceTime) {
            const progress = time / 300;
            let currentScale = this.SCALES.OPENING;
            let density = 2;
            if (progress < 0.2) { currentScale = this.SCALES.OPENING; density = 1; }
            else if (progress < 0.5) { currentScale = this.SCALES.TENSION; density = 2; this.filter!.frequency.setTargetAtTime(1500, now, 2); }
            else if (progress < 0.8) { currentScale = this.SCALES.CLIMAX; density = 3; this.filter!.frequency.setTargetAtTime(3500, now, 2); }
            else { currentScale = this.SCALES.RESOLUTION; density = 2; this.masterGain!.gain.setTargetAtTime(0.9, now, 5); }
            for (let i = 0; i < density; i++) {
                const freq = currentScale[Math.floor(Math.random() * currentScale.length)];
                const offset = Math.random() * 2;
                this.playNote(freq, now + offset, 4 + Math.random() * 2, 0.08);
                this.playNote(freq * 2, now + offset, 2 + Math.random() * 1, 0.04);
            }
            this.nextSequenceTime = now + 3 + Math.random() * 2;
        }
        const lfo = Math.sin(time * 0.1) * 300;
        this.filter!.frequency.setTargetAtTime(this.filter!.frequency.value + lfo, now, 0.5);
    }

    public playTransition() {
        if (!audioCtx || !this.masterGain) return;
        const now = audioCtx.currentTime;
        const arpeggio = [523.25, 659.25, 783.99, 1046.50];
        arpeggio.forEach((f, i) => { this.playNote(f, now + i * 0.1, 4, 0.15); });
    }
}

let musicDirector: MusicDirector | null = null;

function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    camera = new THREE.PerspectiveCamera(75, 1024 / 768, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: false, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(1024, 768);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 15, 10);
    scene.add(directionalLight);
    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);
    subtitleCanvas.width = 1024; subtitleCanvas.height = 400;
    subtitleTexture = new THREE.CanvasTexture(subtitleCanvas);
    const subMat = new THREE.SpriteMaterial({ map: subtitleTexture, transparent: true });
    subtitleSprite = new THREE.Sprite(subMat);
    subtitleSprite.scale.set(8, 3.125, 1);
    scene.add(subtitleSprite);
    const grid = new THREE.GridHelper(50, 50, 0x32FF7E, 0x222222);
    scene.add(grid);
    loader = new GLTFLoader();
}

async function loadStageAssets(stage: number) {
    if (currentItem) { scene.remove(currentItem); currentItem = null; }
    if (endGoal) { scene.remove(endGoal); endGoal = null; }
    blocks.forEach(b => scene.remove(b));
    blocks = [];
    const assetPath = 'asset_canvas/glb_3D/';
    const blockPath = 'asset_canvas/block/';
    const textureLoader = new THREE.TextureLoader();
    if (stage === 1) {
        if (!character) {
            loader.load(`${assetPath}canvas1_character.glb`, (gltf: any) => {
                character = gltf.scene; character.scale.set(2.0, 2.0, 2.0); scene.add(character);
            });
        }
    } else if (stage === 2) {
        const blockTex = textureLoader.load(`${blockPath}canvas2_block.jpeg`);
        const blockMat = new THREE.MeshPhongMaterial({ map: blockTex });
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 1), blockMat);
        b1.position.set(-3, 1.5, -5); scene.add(b1); blocks.push(b1);
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 1), blockMat);
        b2.position.set(3, 1.5, -9); scene.add(b2); blocks.push(b2);
    } else if (stage === 3) {
        loader.load(`${assetPath}canvas2_item.glb`, (gltf: any) => {
            currentItem = gltf.scene; currentItem.position.set(0, 1.0, -7); scene.add(currentItem);
        });
        loader.load(`${assetPath}canvas3_end.glb`, (gltf: any) => {
            endGoal = gltf.scene; endGoal.position.set(0, 0, -15); scene.add(endGoal);
        });
    }
}

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
let lastTime = 0;
let mainInterval: any = null;

function finalizeRecording() {
    console.log("Finalizing recording and triggering download...");
    const diag = document.getElementById('diag-log');
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        if (diag) diag.innerText = "파일을 마무리하는 중... 잠시만 기다려주세요.";
        mediaRecorder.stop();
    }
    if (mainInterval) { clearInterval(mainInterval); mainInterval = null; }
}

function startRecording() {
    recordedChunks = [];
    const diag = document.getElementById('diag-log');
    if (diag) diag.innerText = "녹화 엔진 준비 중...";
    try {
        const videoTrack = canvas.captureStream(30).getVideoTracks()[0];
        let tracks: MediaStreamTrack[] = [videoTrack];
        if (audioDestination) {
            const audioTracks = audioDestination.stream.getAudioTracks();
            if (audioTracks.length > 0) tracks.push(audioTracks[0]);
        }
        const combinedStream = new MediaStream(tracks);
        const mimeTypes = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=h264,aac', 'video/mp4', 'video/webm'];
        let selectedType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
        mediaRecorder = new MediaRecorder(combinedStream, { mimeType: selectedType, videoBitsPerSecond: 5000000 });
        mediaRecorder.ondataavailable = (e) => { 
            if (e.data && e.data.size > 0) {
                recordedChunks.push(e.data);
                if (diag) {
                    const sizeMB = (recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0) / 1024 / 1024).toFixed(1);
                    diag.innerText = `데이터 수집 중: ${sizeMB}MB / 안정적임`;
                }
            }
        };
        mediaRecorder.onstop = () => {
            if (recordedChunks.length === 0) { alert("기록 데이터 없음"); return; }
            const blob = new Blob(recordedChunks, { type: selectedType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `mind-terrain-film-${Date.now()}.${selectedType.includes('mp4') ? 'mp4' : 'webm'}`;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert(`영상 제작 완료! (${(blob.size / 1024 / 1024).toFixed(1)}MB)\n다운로드 폴더를 확인해주세요.`);
        };
        mediaRecorder.start(1000);
    } catch (err) { alert("녹화 실패: " + err); }
}

function update() {
    try {
        const now = performance.now();
        if (lastTime === 0) lastTime = now;
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        demoTime += Math.min(dt, 0.5);
        if (musicDirector) musicDirector.update(demoTime, currentStage);
        const mins = Math.floor(demoTime / 60).toString().padStart(2, '0');
        const secs = Math.floor(demoTime % 60).toString().padStart(2, '0');
        genTimer.innerText = `진행 시간: ${mins}:${secs} / 05:00`;
        document.title = `Mind Terrain Film (${mins}:${secs})`;
        if (demoTime >= 300) { finalizeRecording(); return; }
        let currentLine = SCRIPT[0];
        for (let i = SCRIPT.length - 1; i >= 0; i--) { if (demoTime >= SCRIPT[i].time) { currentLine = SCRIPT[i]; break; } }
        if (currentLine.text !== lastSubtitle) { subAlpha = Math.max(0, subAlpha - 0.05); if (subAlpha <= 0) lastSubtitle = currentLine.text; }
        else { subAlpha = Math.min(1, subAlpha + 0.05); }
        subCtx.clearRect(0, 0, 1024, 400); subCtx.fillStyle = `rgba(50, 255, 126, ${subAlpha})`;
        subCtx.font = "bold 35px sans-serif"; subCtx.textAlign = "center"; subCtx.textBaseline = "middle";
        subCtx.fillText(lastSubtitle, 512, 200); subtitleTexture.needsUpdate = true;
        const subPos = new THREE.Vector3(0, -2.5, -6); subPos.applyQuaternion(camera.quaternion);
        subPos.add(camera.position); subtitleSprite.position.copy(subPos); subtitleSprite.quaternion.copy(camera.quaternion);
        if (currentLine.stage !== currentStage) { currentStage = currentLine.stage; loadStageAssets(currentStage); if (musicDirector) musicDirector.playTransition(); }
        const targetCam = new THREE.Vector3(...currentLine.cam); camera.position.lerp(targetCam, 0.008);
        if (character && character.position) camera.lookAt(character.position.clone().add(new THREE.Vector3(0, 0, -3)));
        if (character && character.position) {
            if (demoTime < 40) { character.position.z -= 0.015; character.position.x = Math.sin(demoTime * 0.3) * 2; }
            else if (demoTime < 110) { character.position.z -= 0.025; }
            else if (demoTime < 180) {
                if (currentItem && currentItem.visible) { character.position.lerp(currentItem.position, 0.02); if (character.position.distanceTo(currentItem.position) < 0.5) currentItem.visible = false; }
                else character.position.z -= 0.01;
            } else if (demoTime < 270 && endGoal && endGoal.position) { character.position.lerp(endGoal.position, 0.01); if (character.position.distanceTo(endGoal.position) < 0.3) character.scale.multiplyScalar(0.99); }
        }
    } catch (e) { finalizeRecording(); }
}

function loop() { update(); renderer.render(scene, camera); }

document.getElementById('demo-btn')!.onclick = async () => {
    try {
        startScreen.style.display = 'none'; genOverlay.style.display = 'block';
        if (!document.getElementById('diag-log')) {
            const diag = document.createElement('div'); diag.id = 'diag-log';
            diag.style.fontSize = '0.8rem'; diag.style.marginTop = '10px'; diag.style.color = '#32FF7E'; diag.style.opacity = '0.8';
            genOverlay.appendChild(diag);
        }
        initThree(); loadStageAssets(1);
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        audioCtx = new AudioContextClass({ sampleRate: 48000 });
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        audioDestination = audioCtx.createMediaStreamDestination();
        musicDirector = new MusicDirector(); musicDirector.start();
        renderer.render(scene, camera);
        lastTime = performance.now();
        setTimeout(() => { startRecording(); if (mainInterval) clearInterval(mainInterval); mainInterval = setInterval(loop, 1000 / 60); }, 1000);
    } catch (e) { alert("Error: " + e); }
};

stopSaveBtn.onclick = () => { finalizeRecording(); };