const socket = new WebSocket('ws://110.15.29.199:6521');
const statusIndicator = document.getElementById('status-indicator');

socket.onopen = () => {
    statusIndicator.classList.add('connected'); // 초록색으로 설정
    console.log('서버에 연결됨');
};

socket.onclose = () => {
    statusIndicator.classList.remove('connected'); // 빨간색으로 설정
    console.log('서버와의 연결이 종료됨');
};

const toggleButton = document.getElementById('toggle-input');
const memo = document.getElementById('memo');
const contentContainer = document.getElementById('content-container');
const addCodeBlockButton = document.getElementById('add-code-block');

let typingTimer;
const doneTypingInterval = 1000; // 단어 입력 후 대기 시간
let isTyping = false; // 타이핑 중인지 여부
let typingStarted = false; // 타이핑 시작 여부를 추적

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

    if (!isTyping) {
        isTyping = true; // 타이핑 중임을 표시
        console.log('타이핑 시작'); // 타이핑 시작 시 로그 출력
    }

    typingTimer = setTimeout(() => {
        const message = memo.value;
        socket.send(message);
        console.log('서버로 메모 전송: ', message);

        isTyping = false; // 타이핑 완료 후 표시 해제
        console.log('타이핑 완료'); // 타이핑 완료 시 로그 출력
    }, doneTypingInterval);
});

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

const renderer = new marked.Renderer();

renderer.code = (code, language) => {
    const languageLabel = language ? `<span class="language">${language}</span>` : '';
    return `<pre class="code-block">${languageLabel}<code>${code}</code></pre>`;
};

function renderContent(content) {
    const html = marked.parse(content, { renderer: renderer });
    contentContainer.innerHTML = html;
    // 상태 표시기 유지
    statusIndicator.classList.toggle('connected', socket.readyState === WebSocket.OPEN);
}