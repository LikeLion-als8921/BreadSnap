// BreadSnap JavaScript 파일
// 빵BTI 질문과 대전 빵 지도 관련 기능

// DOM 요소 가져오기
const mapContainer = document.getElementById('map-container');
const questionModal = document.getElementById('question-modal');
const resultModal = document.getElementById('result-modal');
const districtModal = document.getElementById('district-modal');
const districts = document.querySelectorAll('.district');

// 구 이름 매핑
const districtNames = {
    'yuseong': '유성구',
    'daedeok': '대덕구',
    'dong': '동구',
    'jung': '중구',
    'seo': '서구'
};

// 추천 멘트 데이터 (각 구별 8개 루트: 식감 2개 × 맛 2개 × 토핑 2개)
const recommendations = {
    '유성구': {
        '바삭/자극/가득': ['꾸드뱅 베이커리의 감자베이컨롤을 추천합니다!'],
        '바삭/자극/기본에 충실': ['그린 베이커리의 바게트통감자는 어떠세요?'],
        '바삭/슴슴/가득': ['그린 베이커리의 에그타르트를 추천합니다!'],
        '바삭/슴슴/기본에 충실': ['그린 베이커리의 치즈 치아바타를 드셔보세요!'],
        '촉촉/자극/가득': ['꾸드뱅 베이커리의 에그솔트베이컨 소금빵을 추천합니다!'],
        '촉촉/자극/기본에 충실': ['꾸드뱅 베이커리의 소시지빵은 어떠신가요?'],
        '촉촉/슴슴/가득': ['꾸드뱅 베이커리의 밤식빵을 추천합니다!'],
        '촉촉/슴슴/기본에 충실': ['에이트 카페의 소금빵을 만나보세요!']
    },
    '서구': {
        '바삭/자극/가득': ['성심당 대전역점의 튀김소보로를 추천합니다!'],
        '바삭/자극/기본에 충실': ['하레하레의 마늘바게트는 어떠세요?'],
        '바삭/슴슴/가득': ['성심당 대전역점의 판다롱 부추빵을 추천합니다!'],
        '바삭/슴슴/기본에 충실': ['하레하레의 크림치즈바게트(Plain)를 드셔보세요!'],
        '촉촉/자극/가득': ['하레하레의 크림치즈호두빵을 추천합니다!'],
        '촉촉/자극/기본에 충실': ['성심당 대전역점의 보문산 메아리는 어떠신가요?'],
        '촉촉/슴슴/가득': ['하레하레의 쌀치즈카스테라를 추천합니다!'],
        '촉촉/슴슴/기본에 충실': ['하레하레의 밤식빵(Plain)을 만나보세요!']
    },
    '중구': {
        '바삭/자극/가득': ['로로네베이커리의 리본 모양 패스트리(피스타치오 크림 패스트리 등)는 어떠세요?'],
        '바삭/자극/기본에 충실': ['성심당의 보문산 메아리를 맛보세요!'],
        '바삭/슴슴/가득': ['성심당의 우유롤을 드셔보세요!'],
        '바삭/슴슴/기본에 충실': ['콜드버터베이크샵의 소금빵을 추천해요!'],
        '촉촉/자극/가득': ['콜드버터베이크샵의 생우유크림 소금빵은 어떠신가요?'],
        '촉촉/자극/기본에 충실': ['몽심의 카야버터바게트를 맛보세요!'],
        '촉촉/슴슴/가득': ['PIEGARDEN의 토마토바질을 드셔보세요!'],
        '촉촉/슴슴/기본에 충실': ['성심당의 토요빵을 만나보세요!']
    },
    '동구': {
        '바삭/자극/가득': ['빵한모금의 딸기소쿠리를 추천합니다!'],
        '바삭/자극/기본에 충실': ['정동문화사의 에그타르트를 맛보세요!'],
        '바삭/슴슴/가득': ['모노브레드타임의 올리브치아바타샌드위치는 어떠세요?'],
        '바삭/슴슴/기본에 충실': ['모노브레드타임의 올리브치즈식빵을 추천해요!'],
        '촉촉/자극/가득': ['나래 베이커리의 밤 롤케이크는 어떠신가요?'],
        '촉촉/자극/기본에 충실': ['성심당 대전역점의 보문산 메아리를 맛보세요!'],
        '촉촉/슴슴/가득': ['미도리컬러의 파베이컨 베이글을 드셔보세요!'],
        '촉촉/슴슴/기본에 충실': ['이든베이커리의 쌀식빵을 만나보세요!']
    },
    '대덕구': {
        '바삭/자극/가득': ['보보로 베이커리의 감자베이컨롤을 추천합니다!'],
        '바삭/자극/기본에 충실': ['보보로 베이커리의 꽈배기는 어떠세요?'],
        '바삭/슴슴/가득': ['보보로 베이커리의 쑥떡이를 추천합니다!'],
        '바삭/슴슴/기본에 충실': ['보보로 베이커리의 어니언바게트를 드셔보세요!'],
        '촉촉/자극/가득': ['레시피 제과의 크림치즈호두를 추천합니다!'],
        '촉촉/자극/기본에 충실': ['레시피 제과의 마늘브레드는 어떠신가요?', '레시피 제과의 앙금크런치를 추천해요!'],
        '촉촉/슴슴/가득': ['레시피 제과의 소금브레드를 추천합니다!'],
        '촉촉/슴슴/기본에 충실': ['레시피 제과의 앙금크런치를 만나보세요!']
    }
};

// 인기/신상/특별 빵집 데이터
const districtBakeries = {
    '유성구': {
        'popular': ['꾸드뱅', '그린베이커리', '파셀', '하루팡'],
        'new': ['르뺑99', 'Husked', '와이케이크', 'verdent'],
        'special': ['에이트', '소신', '휘어', '잇츠올라잇']
    },
    '서구': {
        'popular': ['하레하레', '이런날', '손수베이커리', '앤크'],
        'new': ['릴베이커스', '시옷기역삐읍', '모노브레드타임 인 둔산', '남선당'],
        'special': ['츄로츄로', '롤라리틀베이커리', '델빠네', '관저당']
    },
    '중구': {
        'popular': ['콜드버터베이크샵', '성심당', '몽심', '정성을다하는베이커리'],
        'new': ['PIEGARDEN', '뮤제', '노마드오븐', '델빠네'],
        'special': ['로로네베이커리', '멜뷰', '점선면', '신라방']
    },
    '동구': {
        'popular': ['모노브레드타임', '정동문화사', '빵한모금', '이든베이커리'],
        'new': ['성심당대전역점', '황제찹쌀꽈배기', '롤라', '플라잉스콘'],
        'special': ['하늘만큼', '캔디콥스', '폴레폴레', '빵굽는마을']
    },
    '대덕구': {
        'popular': ['몽심', '보보로베이커리', '오렌지블로썸', '레시피제과'],
        'new': ['NTBR', '빵아빵아', '몽리카페', '보우보우'],
        'special': ['을축', '대청댐에이디카페', '파스카로제하우스', '카페글레버']
    }
};

// 클릭 이벤트 추가
districts.forEach(district => {
    district.addEventListener('click', function() {
        // 이전에 열려있을 수 있는 결과 창 숨기기
        resultModal.classList.add('hidden');
        
        // 클릭된 구의 ID 가져오기
        const districtId = this.id;
        
        // 질문 창 보여주기
        showQuestions(districtId);
    });
});

// 질문 창 내용 생성 함수
function showQuestions(districtName) {
    const districtKoreanName = districtNames[districtName];
    
    // 질문 창 내용 동적 생성
    questionModal.innerHTML = `
        <div class="question-content">
            <h2>${districtKoreanName}에서 어떤 빵을 좋아하세요?</h2>
            <div class="question-group">
                <h3>식감</h3>
                <div class="button-group">
                    <button class="btn preference-btn" data-category="texture" data-value="바삭" data-district="${districtName}">바삭</button>
                    <button class="btn preference-btn" data-category="texture" data-value="촉촉" data-district="${districtName}">촉촉</button>
                </div>
            </div>
            <div class="question-group">
                <h3>맛</h3>
                <div class="button-group">
                    <button class="btn preference-btn" data-category="taste" data-value="자극" data-district="${districtName}">자극</button>
                    <button class="btn preference-btn" data-category="taste" data-value="슴슴" data-district="${districtName}">슴슴</button>
                </div>
            </div>
            <div class="question-group">
                <h3>토핑</h3>
                <div class="button-group">
                    <button class="btn preference-btn" data-category="topping" data-value="가득" data-district="${districtName}">가득</button>
                    <button class="btn preference-btn" data-category="topping" data-value="기본에 충실" data-district="${districtName}">기본에 충실</button>
                </div>
            </div>
            <div class="button-group" style="margin-top: 20px;">
                <button class="btn next-btn" onclick="showResultFromSelections('${districtName}')" disabled>다음</button>
                <button class="btn close-btn" onclick="closeQuestionModal()">닫기</button>
            </div>
        </div>
    `;
    
    // 질문 창 보여주기
    questionModal.classList.remove('hidden');
    
    // 선택 상태 초기화
    resetSelections();
    
    // 버튼 이벤트 리스너 추가
    const preferenceButtons = questionModal.querySelectorAll('.preference-btn');
    preferenceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const value = this.getAttribute('data-value');
            
            // 같은 카테고리의 다른 버튼들 비활성화
            const sameCategoryButtons = questionModal.querySelectorAll(`[data-category="${category}"]`);
            sameCategoryButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // 선택된 버튼 활성화
            this.classList.add('selected');
            
            // 선택 저장
            saveSelection(category, value);
            
            // 다음 버튼 활성화 확인
            checkNextButton();
        });
    });
}

// 선택 상태 저장
let selections = {};

function resetSelections() {
    selections = {};
}

function saveSelection(category, value) {
    selections[category] = value;
}

function checkNextButton() {
    const nextBtn = questionModal.querySelector('.next-btn');
    if (selections.texture && selections.taste && selections.topping) {
        nextBtn.disabled = false;
        nextBtn.classList.add('active');
    } else {
        nextBtn.disabled = true;
        nextBtn.classList.remove('active');
    }
}

// 선택된 값들로 결과 보여주기
function showResultFromSelections(districtName) {
    if (selections.texture && selections.taste && selections.topping) {
        const route = `${selections.texture}/${selections.taste}/${selections.topping}`;
        showResult(districtName, route);
    }
}


// 추천 결과 보여주기 함수
function showResult(district, type) {
    // district가 이미 한국어 구 이름인지 확인
    const districtKoreanName = districtNames[district] || district;
    
    // 질문 창 숨기기
    questionModal.classList.add('hidden');
    
    // 해당 구와 취향에 맞는 추천 멘트 찾기
    const districtRecommendations = recommendations[districtKoreanName];
    if (!districtRecommendations || !districtRecommendations[type]) {
        // 해당 조합이 없는 경우 기본 메시지
        resultModal.innerHTML = `
            <div class="result-content">
                <h2>${districtKoreanName} 추천 빵집</h2>
                <p>선택하신 취향: <strong>${type}</strong></p>
                <div class="recommendation">
                    <h3>🍞 추천 빵집</h3>
                    <p>곧 ${districtKoreanName}의 맛있는 빵집들을 만나보세요!</p>
                    <p>취향에 맞는 빵집을 찾아드릴게요.</p>
                </div>
                <button class="btn" onclick="closeResultModal()">확인</button>
            </div>
        `;
    } else {
        // 추천 멘트 배열에서 랜덤으로 하나 선택
        const recommendationMessages = districtRecommendations[type];
        const randomIndex = Math.floor(Math.random() * recommendationMessages.length);
        const selectedMessage = recommendationMessages[randomIndex];
        
        // 추천 결과 내용 생성
        resultModal.innerHTML = `
            <div class="result-content">
                <h2>${districtKoreanName} 추천 빵집</h2>
                <p>선택하신 취향: <strong>${type}</strong></p>
                <div class="recommendation">
                    <h3>🍞 추천 빵집</h3>
                    <p>${selectedMessage}</p>
                </div>
                <button class="btn" onclick="closeResultModal()">확인</button>
            </div>
        `;
    }
    
    // 결과 창 보여주기
    resultModal.classList.remove('hidden');
}

// 질문 창 닫기 함수
function closeQuestionModal() {
    questionModal.classList.add('hidden');
}

// 결과 창 닫기 함수
function closeResultModal() {
    resultModal.classList.add('hidden');
}


// 구별 빵집 모달 닫기 함수
function closeDistrictModal() {
    districtModal.classList.add('hidden');
}

// 구별 빵집 모달 닫기 버튼 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const districtModalCloseBtn = document.getElementById('district-modal-close');
    if (districtModalCloseBtn) {
        districtModalCloseBtn.addEventListener('click', function() {
            console.log('구별 빵집 모달 닫기 버튼 클릭됨'); // 디버깅용
            closeDistrictModal();
        });
    }
});

// 범례 관련 로직 제거됨

// 선택된 카테고리( popular | new | special )
let selectedCategoryType = null;

// 카테고리 버튼 클릭 → 구 선택 창 표시
document.addEventListener('DOMContentLoaded', function () {
  const categoryButtons = document.querySelectorAll('.cat-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      selectedCategoryType = this.getAttribute('data-category');
      showDistrictSelection();
    });
  });
});

// 구 선택 창 표시 함수
function showDistrictSelection() {
    console.log('showDistrictSelection 함수 호출됨'); // 디버깅용
    
    const districtSelectionModal = document.createElement('div');
    districtSelectionModal.className = 'district-selection-modal';
    districtSelectionModal.innerHTML = `
        <div class="district-selection-content">
            <h2>구를 선택하세요</h2>
            <div class="district-buttons">
                <button class="btn district-btn" data-district="yuseong">유성구</button>
                <button class="btn district-btn" data-district="daedeok">대덕구</button>
                <button class="btn district-btn" data-district="dong">동구</button>
                <button class="btn district-btn" data-district="jung">중구</button>
                <button class="btn district-btn" data-district="seo">서구</button>
            </div>
            <button class="btn close-btn">닫기</button>
        </div>
    `;
    
    document.body.appendChild(districtSelectionModal);
    console.log('구 선택 모달이 DOM에 추가됨'); // 디버깅용
    
    // 구 버튼들에 이벤트 리스너 추가
    const districtButtons = districtSelectionModal.querySelectorAll('.district-btn');
    districtButtons.forEach(button => {
        button.addEventListener('click', function() {
            const districtName = this.getAttribute('data-district');
            console.log('구 버튼 클릭됨:', districtName); // 디버깅용
            showDistrictModal(districtName);
        });
    });
    
    // 닫기 버튼에 이벤트 리스너 추가
    const closeButton = districtSelectionModal.querySelector('.close-btn');
    closeButton.addEventListener('click', function() {
        console.log('닫기 버튼 클릭됨'); // 디버깅용
        closeDistrictSelection();
    });
}

// 구 선택 창 닫기 함수
function closeDistrictSelection() {
    const modal = document.querySelector('.district-selection-modal');
    if (modal) {
        modal.remove();
    }
}

// 구별 빵집 모달을 열 때 구 선택 창 닫기
function showDistrictModal(districtName) {
    // 구 선택 창 닫기
    closeDistrictSelection();
    
    const districtKoreanName = districtNames[districtName];
    const bakeries = districtBakeries[districtKoreanName];
    
    // 카테고리 한글 매핑
    const categoryMap = { popular: '인기', new: '새로운', special: '특별한' };
    const categoryKo = categoryMap[selectedCategoryType] || '';
    
    // 제목 설정: "ㅇㅇ구의 ㅇㅇ 빵집"
    const titleEl = document.getElementById('district-title');
    titleEl.textContent = categoryKo ? `${districtKoreanName}의 ${categoryKo} 빵집` : `${districtKoreanName} 빵집`;
    
    // 빵집 리스트 채우기
    const popularList = document.getElementById('popular-bakeries');
    const newList = document.getElementById('new-bakeries');
    const specialList = document.getElementById('special-bakeries');
    
    // 기존 리스트 비우기
    popularList.innerHTML = '';
    newList.innerHTML = '';
    specialList.innerHTML = '';
    
    // 카테고리 컨테이너(부모) 요소
    const popularWrap = popularList.closest('.bakery-category');
    const newWrap = newList.closest('.bakery-category');
    const specialWrap = specialList.closest('.bakery-category');
    
    // 모두 숨김 후 선택된 카테고리만 보여줌
    popularWrap.style.display = 'none';
    newWrap.style.display = 'none';
    specialWrap.style.display = 'none';
    
    const fillList = (ulEl, items) => {
      items.forEach(bakery => {
        const li = document.createElement('li');
        li.textContent = bakery;
        ulEl.appendChild(li);
      });
    };
    
    if (selectedCategoryType === 'popular') {
      fillList(popularList, bakeries.popular || []);
      popularWrap.style.display = '';
    } else if (selectedCategoryType === 'new') {
      fillList(newList, bakeries.new || []);
      newWrap.style.display = '';
    } else if (selectedCategoryType === 'special') {
      fillList(specialList, bakeries.special || []);
      specialWrap.style.display = '';
    } else {
      // fallback: 세 카테고리 모두 노출
      fillList(popularList, bakeries.popular || []);
      fillList(newList, bakeries.new || []);
      fillList(specialList, bakeries.special || []);
      popularWrap.style.display = '';
      newWrap.style.display = '';
      specialWrap.style.display = '';
    }
    
    // 모달 보여주기
    districtModal.classList.remove('hidden');
}
