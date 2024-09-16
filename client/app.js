// app.js

const socket = new WebSocket('ws://localhost:3000');

const memo = document.getElementById('memo');

// 메모가 변경될 때 서버로 전송
memo.addEventListener('input', () => {
    const message = memo.value;
    socket.send(message);
});

// 서버에서 받은 메모를 표시
socket.onmessage = (event) => {
    memo.value = event.data;
};