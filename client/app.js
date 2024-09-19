const socket = new WebSocket('ws://110.15.29.199:6521');

const toggleButton = document.getElementById('toggle-input');
const memo = document.getElementById('memo');
const contentContainer = document.getElementById('content-container');
const addCodeBlockButton = document.getElementById('add-code-block');

// 메모가 변경될 때 서버로 전송 (단어가 입력 완료된 후에 전송)
let typingTimer; // 타이머 변수
const doneTypingInterval = 1000; // 단어 입력 후 대기 시간 (500ms)

// 토글 버튼 클릭 시 입력창 숨기기/보이기
toggleButton.addEventListener('click', () => {
    memo.classList.toggle('hidden');
    if (memo.classList.contains('hidden')) {
        contentContainer.style.flex = '1'; // 입력창이 숨겨졌을 때
        addCodeBlockButton.style.display = 'none'; // 코드 블록 추가 버튼 숨기기
    } else {
        contentContainer.style.flex = '0.5'; // 입력창이 보일 때
        memo.style.flex = '0.5'; // 입력창이 보일 때
        addCodeBlockButton.style.display = 'block'; // 코드 블록 추가 버튼 보이기
    }
});

memo.addEventListener('input', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const message = memo.value;
        socket.send(message);
    }, doneTypingInterval);
});

// 서버에서 받은 메모를 표시
socket.onmessage = (event) => {
    const data = event.data;
    memo.value = data;  // 메모에 직접 반영
    renderContent(data);  // 마크다운 변환 및 표시
};

// 코드 블록 추가 버튼 클릭 시 새로운 코드 블록 생성
addCodeBlockButton.addEventListener('click', () => {
    // 현재 텍스트 영역의 커서 위치를 얻어옴
    const cursorPosition = memo.selectionStart;

    // 커서 위치를 기준으로 텍스트를 두 부분으로 나눔
    const beforeText = memo.value.substring(0, cursorPosition);
    const afterText = memo.value.substring(cursorPosition);

    // 새로운 코드 블록을 정의 (마크다운 코드 블록 구문)
    const newCodeBlock = '\n```\n\n```\n';

    // 코드 블록을 삽입할 위치를 계산
    const newCursorPosition = beforeText.length + newCodeBlock.length;

    // 기존 텍스트와 새로운 코드 블록을 결합
    memo.value = beforeText + newCodeBlock + afterText;

    // 커서를 새로운 코드 블록의 시작 위치로 이동
    memo.selectionStart = memo.selectionEnd = newCursorPosition;

    // 텍스트 영역에 포커스를 설정
    memo.focus();
});

// 마크다운 렌더러 정의
const renderer = new marked.Renderer();

renderer.code = (code, language) => {
    // 언어 이름을 표시할 span 추가
    const languageLabel = language ? `<span class="language">${language}</span>` : '';
    return `<pre class="code-block">${languageLabel}<code>${code}</code></pre>`;
};

// 메모 내용에 코드 블록이 포함되어 있으면 코드 박스 생성
function renderContent(content) {
    // 마크다운을 HTML로 변환
    const html = marked.parse(content, { renderer: renderer });

    // 변환된 HTML을 content-container에 삽입
    contentContainer.innerHTML = html;
}