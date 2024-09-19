const socket = new WebSocket('ws://110.15.29.199:6521');

const toggleButton = document.getElementById('toggle-input');
const memo = document.getElementById('memo');
const contentContainer = document.getElementById('content-container');
const addCodeBlockButton = document.getElementById('add-code-block');

// 타이핑 여부를 추적하는 변수
let typingTimer;
const doneTypingInterval = 1000; // 단어 입력 후 대기 시간
let isTyping = false; // 타이핑 중인지 여부
let typingStarted = false; // 타이핑 시작 여부를 추적

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

// 메모가 변경될 때 서버로 전송 (단어가 입력 완료된 후에 전송)
memo.addEventListener('input', () => {
    clearTimeout(typingTimer);

    if (!isTyping) {
        isTyping = true; // 타이핑 중임을 표시
        console.log('타이핑 중 시작'); // 타이핑 시작 시 로그 출력
    }

    typingTimer = setTimeout(() => {
        const message = memo.value;
        socket.send(message);
        console.log('서버로 메모 전송: ', message);

        isTyping = false; // 타이핑 완료 후 표시 해제
        console.log('타이핑 중 완료'); // 타이핑 완료 시 로그 출력
    }, doneTypingInterval);
});

// 서버에서 받은 메모를 표시
socket.onmessage = (event) => {
    if (!isTyping) { // 타이핑 중이 아닐 때만 수신된 메모를 표시
        const data = event.data;
        console.log('서버에서 받은 메모: ', data);
        memo.value = data;  // 메모에 직접 반영
        renderContent(data);  // 마크다운 변환 및 표시
    } else {
        console.log('타이핑 중이라 메모를 업데이트하지 않음');
    }
};

// 코드 블록 추가 버튼 클릭 시 새로운 코드 블록 생성
addCodeBlockButton.addEventListener('click', () => {
    const cursorPosition = memo.selectionStart;
    const beforeText = memo.value.substring(0, cursorPosition);
    const afterText = memo.value.substring(cursorPosition);
    const newCodeBlock = '\n```\n\n```\n';
    const newCursorPosition = beforeText.length + newCodeBlock.length;

    memo.value = beforeText + newCodeBlock + afterText;
    memo.selectionStart = memo.selectionEnd = newCursorPosition;
    memo.focus();
});

// 마크다운 렌더러 정의
const renderer = new marked.Renderer();

renderer.code = (code, language) => {
    const languageLabel = language ? `<span class="language">${language}</span>` : '';
    return `<pre class="code-block">${languageLabel}<code>${code}</code></pre>`;
};

// 메모 내용에 코드 블록이 포함되어 있으면 코드 박스 생성
function renderContent(content) {
    const html = marked.parse(content, { renderer: renderer });
    contentContainer.innerHTML = html;
}