# 📝 Unowe Online NotePad

## 프로젝트 소개
Unowe Online NotePad는 **실시간 메모 공유**와 **코드 블록 삽입** 기능을 제공하는 웹 애플리케이션입니다. WebSocket을 통해 클라이언트와 서버 간의 메모 내용을 실시간으로 동기화하며, 메모에는 **Markdown** 문법을 활용해 코드 블록을 추가할 수 있습니다.

### 주요 기능
- 🔄 **실시간 메모 동기화**: 작성한 메모를 서버와 클라이언트 간에 실시간으로 동기화.
- 🖥 **입력창 토글**: 필요에 따라 입력창을 숨기거나 표시할 수 있음.
- 📦 **코드 블록 추가**: 마크다운 문법으로 코드 블록을 쉽게 추가.
- 🎨 **다크 모드 지원**: 어두운 배경의 사용자 인터페이스 제공.

## 🛠 기술 스택
- **Frontend**: HTML, CSS, JavaScript, Marked.js
- **Backend**: Node.js, Express, WebSocket
- **UI/UX**: 다크 테마 기반의 간결한 인터페이스 제공

---

## 📂 프로젝트 구조

```bash
project6520/
│
├── public/               # 정적 파일 (HTML, CSS, JS)
│   ├── app.js            # 클라이언트 측 JavaScript
│   ├── index.html        # 웹 페이지 구조
│   └── style.css         # 스타일링
│
├── server.js             # 서버 및 WebSocket 처리
├── package.json          # npm 패키지 정보
└── README.md             # 프로젝트 설명 파일
```

## 🚀 사용 방법

### 1. 프로젝트 클론

```bash
git clone https://github.com/Hyun647/project6520.git
cd project6520
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 서버 실행

```bash
node server.js
```

서버는 `http://localhost:3001`에서 실행됩니다.

---

## 💡 주요 코드 설명

### WebSocket 연결 처리

```javascript
const socket = new WebSocket('ws://localhost:3001');

// 서버로 메모 전송
memo.addEventListener('input', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.send(memo.value);
    }, 500); // 500ms 후 서버로 전송
});

// 서버에서 받은 메모 표시
socket.onmessage = (event) => {
    memo.value = event.data;
    renderContent(event.data); // 마크다운 변환
};
```

### 입력창 토글 및 코드 블록 추가

```javascript
// 입력창 토글
toggleButton.addEventListener('click', () => {
    memo.classList.toggle('hidden');
    contentContainer.style.flex = memo.classList.contains('hidden') ? '1' : '0.5';
});

// 코드 블록 추가
addCodeBlockButton.addEventListener('click', () => {
    const cursorPosition = memo.selectionStart;
    const newCodeBlock = '\n```\n\n```\n';
    memo.value = memo.value.substring(0, cursorPosition) + newCodeBlock + memo.value.substring(cursorPosition);
});
```

## 문의
궁금한 점이나 제안 사항이 있다면 [이슈](https://github.com/Hyun647/project6520.git/issues)에 남겨주세요! 💬
