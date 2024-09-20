const statusIndicator = document.getElementById('status-indicator');
const toggleButton = document.getElementById('toggle-input');
const memo = document.getElementById('memo');
const contentContainer = document.getElementById('content-container');
const addCodeBlockButton = document.getElementById('add-code-block');

let socket;
let reconnectInterval;
let typingTimer;
const doneTypingInterval = 1000; // 단어 입력 후 대기 시간
let isTyping = false; // 타이핑 중인지 여부

const socketConnect = () => {
    socket = new WebSocket('ws://110.15.29.199:6521');

    socket.onopen = () => {
        statusIndicator.classList.add('connected'); // 초록색으로 설정
        console.log('서버에 연결됨');

        // 재연결 시도 중이면 중지
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
    };

    socket.onclose = () => {
        statusIndicator.classList.remove('connected'); // 빨간색으로 설정
        console.log('서버와의 연결이 종료됨');
        attemptReconnect(); // 재연결 시도
    };

    socket.onmessage = (event) => {
        if (!isTyping) { // 타이핑 중이 아닐 때만 수신된 메모를 표시
            const data = event.data;
            console.log('서버에서 메모 다운받음');
            memo.value = data;  // 메모에 직접 반영
            renderContent(data);  // 마크다운 변환 및 표시
        } else {
            console.log('타이핑 중이라 메모를 업데이트하지 않음');
        }
    };

    socket.onerror = (error) => {
        console.error('웹소켓 오류 발생: ', error);
    };
};

// 5초마다 재연결 시도
const attemptReconnect = () => {
    if (!reconnectInterval) {
        reconnectInterval = setInterval(() => {
            console.log('서버 재연결 시도 중...');
            socketConnect();
        }, 3000); // 3초마다 재연결 시도
    }
};

// 타이핑 감지 및 서버로 메모 전송
memo.addEventListener('input', () => {
    clearTimeout(typingTimer);

    if (!isTyping) {
        isTyping = true; // 타이핑 중임을 표시
        console.log('타이핑 시작'); // 타이핑 시작 시 로그 출력
    }

    typingTimer = setTimeout(() => {
        const message = memo.value;
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            console.log('서버로 메모 업로드됨.');
        } else {
            console.error('서버에 연결되지 않음. 메모 전송 실패');
        }

        isTyping = false; // 타이핑 완료 후 표시 해제
        console.log('타이핑 완료'); // 타이핑 완료 시 로그 출력
    }, doneTypingInterval);
});

// 코드 블록 추가
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

// 마크다운 렌더링 설정
const renderer = new marked.Renderer();

renderer.code = (code, language) => {
    const languageLabel = language ? `<span class="language">${language}</span>` : '';
    return `<pre class="code-block">${languageLabel}<code>${code}</code></pre>`;
};

// 메모 내용 렌더링
function renderContent(content) {
    const html = marked.parse(content, { renderer: renderer });
    contentContainer.innerHTML = html;

    // 상태 표시기 유지
    statusIndicator.classList.toggle('connected', socket.readyState === WebSocket.OPEN);
}

// 입력창 토글 기능
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

// 처음 연결 시도
socketConnect();