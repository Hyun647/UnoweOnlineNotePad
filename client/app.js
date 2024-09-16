// app.js

const socket = new WebSocket('ws://110.15.29.199:3000');

const memo = document.getElementById('memo');

// 메모가 변경될 때 서버로 전송
memo.addEventListener('input', () => {
    const message = memo.value;
    socket.send(message);
});

// 서버에서 받은 메모를 문자열로 표시
socket.onmessage = (event) => {
    const reader = new FileReader();
    
    reader.onload = () => {
        memo.value = reader.result;  // 텍스트로 표시
    };
    
    reader.readAsText(event.data);  // Blob 데이터를 텍스트로 변환
};