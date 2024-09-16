const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 메모 내용을 저장할 변수
let savedMemo = "";

// 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket 연결 처리
wss.on('connection', (ws) => {
    console.log('새 클라이언트가 연결되었습니다.');

    // 새로운 클라이언트에게 저장된 메모 전달
    ws.send(savedMemo);

    // 클라이언트로부터 메시지를 받았을 때 처리
    ws.on('message', (message) => {
        const text = message.toString();

        // 저장된 메모를 업데이트
        savedMemo = text;

        // 모든 클라이언트에게 메모 전송
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(savedMemo);  // 기존 메모를 덮어쓰기
            }
        });
    });

    ws.on('close', () => {
        console.log('클라이언트 연결이 종료되었습니다.');
    });
});

// 서버 실행
server.listen(3001, () => {
    console.log('서버가 http://localhost:3001 에서 실행 중입니다.');
});