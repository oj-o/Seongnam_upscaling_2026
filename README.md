# Mind Terrain

**소외된 마음에 접촉해 가는 과정을 AR 기반 경험으로 구성한 작업**

## 🌟 프로젝트 개요 (Concept)
일상 속에서 인식되지 않거나 소외되어 온 개인의 내면에 주목하며, 그 마음에 접촉해 가는 과정을 AR(증강현실) 기술을 통해 표현한 인터랙티브 미디어 아트 프로젝트입니다. 

우리는 수많은 자극 속에서 살아가지만, 정작 자신의 감각과 상태를 충분히 인식하지 못한 채 지나가곤 합니다. 본 작업은 AR 기반의 인터랙션을 통해 관람자가 자신의 감각과 상태를 마주하고, 스스로의 마음에 깊이 접촉해 보는 경험을 제안합니다.

## 🛠 주요 기술 스택 (Tech Stack)
- **Frontend:** TypeScript, Vite
- **3D/AR Engine:** Three.js, A-Frame (AR 기반 인터랙션)
- **AI/ML:** TensorFlow.js (COCO-SSD 모델 활용 추정)
- **Styling:** CSS3

## 🎮 이용 방법 (Instructions)
1. **[여정 시작]** 버튼을 눌러 내면의 세계로 입장하세요.
2. 하얀 캔버스나 비어있는 공간을 사각형 가이드 안에 비춰 **내면의 문**을 여세요.
3. 화면을 터치하여 **슬라임**을 움직여 깊은 곳의 **진심(황금빛 원)**에 도달하세요.
4. 일상의 자극(블록)에 부딪히면 감각이 흩어질 수 있으니, 차분히 마음을 집중해 보세요.

## 📁 주요 파일 구조
- `index.html` / `index.ts`: 메인 진입점 및 로직
- `film.html` / `film.ts`: 특정 시퀀스 또는 영상 관련 로직
- `trpg-engine.ts`: 인터랙티브 엔진/시스템 로직
- `asset_canvas/`: 3D 모델(.stl, .glb) 및 이미지 자산
- `public/`: 정적 리소스

## 🚀 시작하기 (Getting Started)

### 1. 사전 준비 (Prerequisites)
- **Node.js:** 안정적인 최신 LTS 버전(v18 이상 권장)이 설치되어 있어야 합니다.
- **브라우저:** AR 기능(WebXR)을 지원하는 최신 브라우저(Chrome, Safari 등)가 필요하며, 모바일 기기에서의 테스트를 권장합니다.

### 2. 저장소 복제 (Clone)
```bash
git clone https://github.com/oj-o/Seongnam_upscaling_2026.git
cd Seongnam_upscaling_2026
```

### 3. 의존성 설치 (Installation)
프로젝트에 필요한 패키지들을 설치합니다.
```bash
npm install
```

### 4. 로컬 개발 서버 실행 (Development)
실시간으로 코드 변경 사항을 확인하며 개발할 수 있는 로컬 서버를 실행합니다.
```bash
npm run dev
```
- 실행 후 터미널에 표시되는 로컬 주소(보통 `http://localhost:5173`)로 접속합니다.
- **모바일 테스트:** 개발 PC와 모바일 기기가 같은 네트워크(Wi-Fi)에 있다면, `--host` 옵션을 사용하여 모바일 기기에서도 접속할 수 있습니다. (`npx vite --host`)

### 5. 빌드 및 배포 (Build & Preview)
프로덕션 환경을 위해 프로젝트를 빌드합니다.
```bash
# 빌드 실행 (dist 폴더 생성)
npm run build

# 빌드된 결과물 미리보기
npm run preview
```

---
© 2026 Seongnam Upscaling Project.
