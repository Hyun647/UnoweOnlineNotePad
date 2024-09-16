const socket = new WebSocket('ws://110.15.29.199:3001');

const memo = document.getElementById('memo');
const contentContainer = document.getElementById('content-container');
const addCodeBlockButton = document.getElementById('add-code-block');

// 메모가 변경될 때 서버로 전송 (단어가 입력 완료된 후에 전송)
let typingTimer; // 타이머 변수
const doneTypingInterval = 500; // 단어 입력 후 대기 시간 (500ms)

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
    renderContent(data);
};

// 코드 블록 추가 버튼 클릭 시 새로운 코드 블록 생성
addCodeBlockButton.addEventListener('click', () => {
    // 현재 텍스트 영역의 커서 위치를 얻어옴
    const cursorPosition = memo.selectionStart;

    // 커서 위치를 기준으로 텍스트를 두 부분으로 나눔
    const beforeText = memo.value.substring(0, cursorPosition);
    const afterText = memo.value.substring(cursorPosition);

    // 새로운 코드 블록을 정의 (비어 있음)
    const newCodeBlock = '\n<code>\n\n</code>\n';

    // 코드 블록을 삽입할 위치를 계산
    const newCursorPosition = beforeText.length + newCodeBlock.indexOf('') + 8;

    // 기존 텍스트와 새로운 코드 블록을 결합
    memo.value = beforeText + newCodeBlock + afterText;

    // 커서를 새로운 코드 블록의 시작 위치로 이동
    memo.selectionStart = memo.selectionEnd = newCursorPosition;

    // 텍스트 영역에 포커스를 설정
    memo.focus();
});

// 메모 내용에 코드 블록이 포함되어 있으면 코드 박스 생성
function renderContent(content) {
    const lines = content.split('\n');
    let html = '';
    let inCodeBlock = false;

    lines.forEach(line => {
        if (line.startsWith('<code>')) {
            if (inCodeBlock) {
                html += '</div>'; // 코드 블록 종료
            }
            inCodeBlock = true;
            html += '<div class="code-block">';
        } else if (line === '</code>') {
            if (inCodeBlock) {
                html += '</div>'; // 코드 블록 종료
                inCodeBlock = false;
            }
        } else {
            if (inCodeBlock) {
                html += line + '\n'; // 코드 블록 내 텍스트 추가
            } else {
                html += line + '<br>'; // 일반 텍스트
            }
        }
    });

    if (inCodeBlock) {
        html += '</div>'; // 코드 블록 종료
    }

    contentContainer.innerHTML = html;
}