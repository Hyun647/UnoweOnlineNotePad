const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// HTML 파일을 서빙하기 위한 설정
app.use(express.static(path.join(__dirname, 'public')));

// 메모리를 사용하여 작성된 글 저장
let posts = [];

// 클라이언트가 접속하면 실행되는 부분
io.on('connection', (socket) => {
    console.log('New client connected'); // 클라이언트 접속 확인

    // 클라이언트에게 기존 글을 전송
    socket.emit('loadPosts', posts);

    // 클라이언트가 새로운 글을 작성하면 실행되는 부분
    socket.on('newPost', (post) => {
        console.log('New post received:', post); // 서버에서 새로운 글 확인
        posts.push(post);
        io.emit('updatePosts', posts); // 모든 클라이언트에게 업데이트된 글을 전송
    });

    // 클라이언트가 연결 해제될 때
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// 서버 시작
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});