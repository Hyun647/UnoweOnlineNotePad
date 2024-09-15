const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));  // 클라이언트 파일을 제공할 폴더

app.post('/register', (req, res) => {
    const { name, email, interest } = req.body;
    
    // 여기서 데이터베이스에 저장하거나 다른 처리
    console.log(`Name: ${name}, Email: ${email}, Interest: ${interest}`);
    
    res.json({ message: '가입 완료' });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중`);
});