export interface GameStats {
    heritage: number;   
    community: number;  
    future: number;     
}

export interface Choice {
    text: string;
    impact: Partial<GameStats>;
}

export interface Stage {
    id: number;
    character: "Saerongi" | "Saenami" | "Both";
    title: string;
    imageUrl: string;
    siteDescription: string;
    dialogue: string;
    targetClass: string;
    successText: string;
    choices?: Choice[];
}

export const STAGES: Stage[] = [
    {
        id: 0,
        character: "Both",
        title: "성남 관광 안내소",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/main/main_visual_01.jpg",
        siteDescription: "첨단과 혁신의 희망도시 성남에 오신 것을 환영합니다!",
        dialogue: "안녕! 성남의 매력을 발견하러 왔구나? 우리는 성남시 마스코트 새롱이와 새남이야. 어느 코스부터 시작해볼까?",
        targetClass: "Any",
        successText: "준비 완료! 자, 이제 출발하자!",
        choices: [
            { text: "역사/전통 코스 (새롱이)", impact: { heritage: 10 } },
            { text: "현대/미래 코스 (새남이)", impact: { future: 10 } }
        ]
    },
    {
        id: 1,
        character: "Saerongi",
        title: "남한산성",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_01_01.jpg",
        siteDescription: "유네스코 세계문화유산인 남한산성은 병자호란의 아픈 역사를 간직한 곳이자, 성남을 한눈에 내려다볼 수 있는 성남의 뿌리입니다.",
        dialogue: "성곽길을 따라 걸으며 성남의 역사를 느껴봐. '오래된 물건'이나 '역사책'을 보여주면 스탬프를 찍어줄게!",
        targetClass: "Traditional",
        successText: "수어장대의 기백이 느껴지는걸! 역사 전문성 상승!",
        choices: [
            { text: "성곽길 완주", impact: { heritage: 15 } },
            { text: "전시관 관람", impact: { heritage: 10, community: 5 } }
        ]
    },
    {
        id: 2,
        character: "Saerongi",
        title: "봉국사",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_01_02.jpg",
        siteDescription: "고려 현종 때 창건된 봉국사는 조선 현종의 두 공주를 기리기 위해 중창된 유서 깊은 사찰입니다.",
        dialogue: "조용한 산사에서 마음의 평화를 찾아봐. 평온함을 상징하는 '꽃'이나 '식물'을 보여줘.",
        targetClass: "Nature",
        successText: "사찰의 고요함이 마음을 정화해주네.",
        choices: [
            { text: "명상 체험", impact: { heritage: 10, community: 10 } },
            { text: "문화재 관찰", impact: { heritage: 15 } }
        ]
    },
    {
        id: 3,
        character: "Saerongi",
        title: "망경암",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_01_03.jpg",
        siteDescription: "서울을 바라본다는 뜻의 망경암은 암벽에 새겨진 마애여래좌상으로 유명하며, 시원한 조망을 자랑합니다.",
        dialogue: "여기서 바라보는 풍경이 정말 멋져! 멀리 내다볼 수 있는 '안경'이나 '기록도구'를 보여줄래?",
        targetClass: "Tech",
        successText: "탁 트인 조망처럼 성남의 미래도 밝아 보여!",
        choices: [
            { text: "풍경 사진 촬영", impact: { heritage: 10, future: 5 } },
            { text: "마애불 참배", impact: { heritage: 15 } }
        ]
    },
    {
        id: 4,
        character: "Saenami",
        title: "모란민속전통시장",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_02_01.jpg",
        siteDescription: "전국 최대 규모의 5일장인 모란시장은 매 4, 9일마다 열리며, 성남 시민들의 삶의 에너지가 넘치는 곳입니다.",
        dialogue: "사람 사는 냄새가 나는 시장이야! 활기찬 시장의 정을 담은 '바구니'나 '먹거리'를 보여줘!",
        targetClass: "Nature",
        successText: "모란시장의 정이 여기까지 느껴져! 공동체 스탯 상승!",
        choices: [
            { text: "기름 골목 탐방", impact: { community: 15 } },
            { text: "상인과 소통", impact: { community: 10, heritage: 5 } }
        ]
    },
    {
        id: 5,
        character: "Saenami",
        title: "성남 하이테크밸리",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_02_02.jpg",
        siteDescription: "성남의 산업 발전을 이끌어온 심장부로, 수많은 중소기업과 IT 제조 시설이 밀집해 있습니다.",
        dialogue: "성남의 경제를 만드는 곳이야! 산업의 도구인 '단단한 도구'나 '금속 물건'을 보여줘.",
        targetClass: "Tech",
        successText: "일하는 즐거움이 성남을 키우고 있어!",
        choices: [
            { text: "기업체 견학", impact: { community: 10, future: 10 } },
            { text: "제품 개발 참여", impact: { future: 15 } }
        ]
    },
    {
        id: 6,
        character: "Saerongi",
        title: "신구대학교식물원",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_03_01.jpg",
        siteDescription: "다양한 자생 식물과 정원이 어우러진 힐링 공간으로, 계절마다 아름다운 꽃 축제가 열립니다.",
        dialogue: "도심 속 정원에서 잠시 쉬어가자. 자연의 에너지가 담긴 '초록색 식물'을 보여줄래?",
        targetClass: "Nature",
        successText: "꽃향기가 가득한 성남, 정말 아름다워!",
        choices: [
            { text: "숲 해설 듣기", impact: { community: 10, heritage: 5 } },
            { text: "야생화 관찰", impact: { community: 15 } }
        ]
    },
    {
        id: 7,
        character: "Saenami",
        title: "판교 테크노밸리",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_02_03.jpg",
        siteDescription: "대한민국 IT 혁신의 중심지로, 카카오, 네이버 등 글로벌 IT 기업들이 모여 미래를 설계하는 곳입니다.",
        dialogue: "와! 여기가 한국의 실리콘밸리야. 미래 혁신의 상징인 '노트북'이나 '스마트폰'을 보여줘!",
        targetClass: "Tech",
        successText: "혁신의 에너지가 폭발하고 있어! 미래 전문성 상승!",
        choices: [
            { text: "스타트업 네트워킹", impact: { future: 15 } },
            { text: "스마트 시티 체험", impact: { future: 10, community: 10 } }
        ]
    },
    {
        id: 8,
        character: "Saenami",
        title: "성남 아트센터",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_03_02.jpg",
        siteDescription: "수준 높은 공연과 전시가 열리는 문화예술의 거점으로, 시민들의 감성을 채워주는 공간입니다.",
        dialogue: "예술은 우리의 삶을 풍요롭게 해. 예술적 감성을 담은 '그림'이나 '악기'를 보여줄래?",
        targetClass: "Traditional",
        successText: "아름다운 예술의 혼이 느껴지는구나!",
        choices: [
            { text: "콘서트 관람", impact: { future: 10, heritage: 10 } },
            { text: "미술관 도슨트", impact: { heritage: 15 } }
        ]
    },
    {
        id: 9,
        character: "Saenami",
        title: "분당 중앙공원",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_03_03.jpg",
        siteDescription: "전통 가옥과 야외 공연장, 아름다운 호수가 어우러진 도심 속 대규모 휴식처입니다.",
        dialogue: "과거와 현대가 만나는 공원이야. 휴식을 상징하는 '물'이나 '파란색 물건'을 보여줘.",
        targetClass: "Nature",
        successText: "시민들의 쉼터, 중앙공원이 최고야!",
        choices: [
            { text: "전통 가옥 답사", impact: { heritage: 10, community: 10 } },
            { text: "호수 산책", impact: { community: 15 } }
        ]
    },
    {
        id: 10,
        character: "Saenami",
        title: "네이버 1784",
        imageUrl: "https://blog.naver.com/naver_diary/222700305140", // Placeholder for visual, note: real images should be used
        siteDescription: "로봇 기술과 업무 공간이 융합된 세계 최초의 로봇 친화 빌딩으로, 미래의 일상을 미리 볼 수 있습니다.",
        dialogue: "로봇이 배달을 해주는 놀라운 곳이야! '로봇'이나 '첨단 기기'를 보여주면 미래 스탬프를 줄게.",
        targetClass: "Tech",
        successText: "미래가 이미 우리 곁에 와 있구나!",
        choices: [
            { text: "자율주행 로봇 관찰", impact: { future: 20 } },
            { text: "디지털 트윈 체험", impact: { future: 15, community: 5 } }
        ]
    },
    {
        id: 11,
        character: "Both",
        title: "탄천 물길",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_03_04.jpg",
        siteDescription: "성남의 남북을 관통하는 젖줄로, 수많은 시민이 산책과 운동을 즐기는 생태 하천입니다.",
        dialogue: "탄천의 물줄기처럼 성남도 활기차게 흘러가. 시원한 '음료수'나 '투명한 물건'을 보여줘.",
        targetClass: "Traditional",
        successText: "탄천의 생명력이 성남을 채우고 있어!",
        choices: [
            { text: "자전거 라이딩", impact: { community: 15 } },
            { text: "생태 정화 활동", impact: { community: 10, heritage: 10 } }
        ]
    },
    {
        id: 12,
        character: "Saenami",
        title: "정자동 카페거리",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_03_05.jpg",
        siteDescription: "이국적인 테라스 카페들이 줄지어 있는 거리로, 성남의 세련된 문화를 느낄 수 있는 명소입니다.",
        dialogue: "여유로운 오후, 커피 한 잔 어때? '커피 컵'이나 '예쁜 소품'을 보여줄래?",
        targetClass: "Traditional",
        successText: "성남의 여유로운 문화, 정말 좋아!",
        choices: [
            { text: "테라스 브런치", impact: { community: 10, future: 5 } },
            { text: "골목 상권 응원", impact: { community: 15 } }
        ]
    },
    {
        id: 13,
        character: "Both",
        title: "성남시청",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_04_01.jpg",
        siteDescription: "시민을 위한 열린 공간이자, 현대적인 건축미를 자랑하는 성남 행정의 중심지입니다.",
        dialogue: "시민의 목소리가 들리는 곳이야! '당신의 밝은 얼굴'을 보여주면 스탬프를 찍어줄게.",
        targetClass: "Nature",
        successText: "시민이 행복한 성남, 우리가 만들어요!",
        choices: [
            { text: "시민 광장 참여", impact: { community: 20 } },
            { text: "정책 아이디어 제안", impact: { future: 10, community: 10 } }
        ]
    },
    {
        id: 14,
        character: "Saenami",
        title: "드론 전용 비행장",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/sub/tour_04_02.jpg",
        siteDescription: "전국 최초로 조성된 드론 전용 비행장으로, 성남이 4차 산업혁명의 선두 주자임을 상징합니다.",
        dialogue: "하늘을 나는 꿈이 현실이 되는 곳! '날개 모양'이나 '하늘'을 보여줘.",
        targetClass: "Tech",
        successText: "성남의 꿈이 드론처럼 높이 날아오르고 있어!",
        choices: [
            { text: "드론 조종 체험", impact: { future: 20 } },
            { text: "스마트 물류 연구", impact: { future: 15, community: 5 } }
        ]
    },
    {
        id: 15,
        character: "Both",
        title: "성남 투어 마스터",
        imageUrl: "https://www.seongnam.go.kr/tour/resources/images/main/main_visual_02.jpg",
        siteDescription: "성남의 모든 보물을 찾으셨습니다! 이제 당신은 성남 문화 관광의 마스터입니다.",
        dialogue: "축하해! 모든 여정을 무사히 마쳤어. 당신이 만든 성남 투어의 결과는 어떨까?",
        targetClass: "Any",
        successText: "성남의 미래를 함께 그려가자!",
        choices: [
            { text: "투어 결과 보기", impact: {} }
        ]
    }
];

export class TRPGEngine {
    currentStageIndex: number = 0;
    stats: GameStats = { heritage: 10, community: 10, future: 10 };

    get currentStage() {
        return STAGES[this.currentStageIndex];
    }

    advanceStage(choiceIndex?: number) {
        if (choiceIndex !== undefined) {
            const choice = this.currentStage.choices?.[choiceIndex];
            if (choice) {
                if (choice.impact.heritage) this.stats.heritage += choice.impact.heritage;
                if (choice.impact.community) this.stats.community += choice.impact.community;
                if (choice.impact.future) this.stats.future += choice.impact.future;
            }
        }

        if (this.currentStageIndex < STAGES.length - 1) {
            this.currentStageIndex++;
            return true;
        }
        return false;
    }

    updateUI() {
        const stageInfo = document.getElementById('stage-info')!;
        const guName = document.getElementById('gu-name')!;
        const dialogueText = document.getElementById('dialogue-text')!;
        const interactionHint = document.getElementById('interaction-hint')!;
        const slimeName = document.getElementById('slime-name')!;
        const siteImage = document.getElementById('site-image') as HTMLImageElement;
        const siteDesc = document.getElementById('site-description')!;
        
        const barHeritage = document.getElementById('stat-history')!;
        const barCommunity = document.getElementById('stat-industry')!;
        const barFuture = document.getElementById('stat-innovation')!;

        const labels = document.querySelectorAll('.stat-label');
        if (labels.length >= 3) {
            labels[0].innerHTML = `역사/전통: ${this.stats.heritage}`;
            labels[1].innerHTML = `공동체/자연: ${this.stats.community}`;
            labels[2].innerHTML = `혁신/미래: ${this.stats.future}`;
        }

        stageInfo.innerText = `STAGE ${this.currentStageIndex}/15`;
        guName.innerText = this.currentStage.title;
        dialogueText.innerText = this.currentStage.dialogue;
        siteDesc.innerText = this.currentStage.siteDescription;
        if (siteImage) siteImage.src = this.currentStage.imageUrl;

        // Character Name Update
        if (this.currentStage.character === "Both") slimeName.innerText = "새롱이 & 새남이";
        else if (this.currentStage.character === "Saerongi") slimeName.innerText = "새롱이";
        else slimeName.innerText = "새남이";

        // UI Character Portrait Class
        const dialogueContainer = document.getElementById('dialogue-container')!;
        dialogueContainer.className = `char-${this.currentStage.character.toLowerCase()}`;

        barHeritage.style.width = `${Math.min(this.stats.heritage, 100)}%`;
        barCommunity.style.width = `${Math.min(this.stats.community, 100)}%`;
        barFuture.style.width = `${Math.min(this.stats.future, 100)}%`;

        let choiceContainer = document.getElementById('choice-container');
        if (!choiceContainer) {
            choiceContainer = document.createElement('div');
            choiceContainer.id = 'choice-container';
            document.getElementById('dialogue-container')?.appendChild(choiceContainer);
        }
        choiceContainer.innerHTML = '';
        choiceContainer.style.display = 'none';

        if (this.currentStage.targetClass === "Any") {
            interactionHint.innerText = "코스를 선택해주세요.";
            this.showChoices();
        } else {
            interactionHint.innerText = `${this.currentStage.targetClass} 관련 물체를 카메라에 비춰주세요...`;
        }
    }

    showChoices() {
        const choiceContainer = document.getElementById('choice-container');
        if (!choiceContainer || !this.currentStage.choices) return;

        choiceContainer.style.display = 'flex';
        choiceContainer.style.gap = '10px';
        choiceContainer.style.marginTop = '15px';
        choiceContainer.style.flexWrap = 'wrap';

        this.currentStage.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.innerText = choice.text;
            btn.className = 'choice-button';
            btn.onclick = () => {
                if (this.currentStage.targetClass === "Any") {
                    this.advanceStage(index);
                    this.updateUI();
                } else {
                    (window as any).pendingChoice = index;
                    btn.style.borderColor = '#32FF7E';
                    btn.style.color = '#32FF7E';
                }
            };
            choiceContainer.appendChild(btn);
        });
    }
}