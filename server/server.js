// server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket 연결 처리
wss.on('connection', (ws) => {
    console.log('클라이언트가 연결되었습니다.');

    ws.on('message', (message) => {
        // 받은 메시지를 문자열로 변환
        const text = message.toString();
    
        // 모든 클라이언트에게 메모 전송
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text);  // text를 전송
            }
        });
    });

    ws.on('close', () => {
        console.log('클라이언트 연결이 종료되었습니다.');
    });
});

// 서버 실행
server.listen(3000, () => {
    console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});