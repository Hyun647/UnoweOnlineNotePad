const socket = new WebSocket('ws://110.15.29.199:3001');

const memo = document.getElementById('memo');
const contentContainer = document.getElementById('content-container');

// 메모가 변경될 때 서버로 전송
memo.addEventListener('input', () => {
    const message = memo.value;
    socket.send(message);
});

// 서버에서 받은 메모를 표시
socket.onmessage = (event) => {
    const data = event.data;
    memo.value = data;
    renderContent(data);
};

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
            html += line.substring(6); // `<code>` 태그 제거
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

// /code 입력 시 코드 블록 시작 및 끝 처리
memo.addEventListener('input', () => {
    const value = memo.value;
    if (value.includes('<code>') || value.includes('</code>')) {
        renderContent(value);
    }
});