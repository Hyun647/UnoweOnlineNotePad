// app.js

const socket = new WebSocket('ws://110.15.29.199:3001');

const memo = document.getElementById('memo');

// 서버에서 받은 메모를 표시
socket.onmessage = (event) => {
    // 서버에서 받은 데이터를 텍스트로 처리
    memo.value = event.data;
};

// 메모가 변경될 때 서버로 전송
memo.addEventListener('input', () => {
    const message = memo.value;
    socket.send(message);
});