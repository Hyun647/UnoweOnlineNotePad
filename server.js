const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: '110.15.29.199',
  user: 'root',
  password: '1590',
  database: 'notepad_db',
  port: 9876
});

// 데이터베이스 연결 테스트 및 로깅
pool.getConnection()
  .then(connection => {
    console.log('데이터베이스 연결 성공');
    connection.release();
  })
  .catch(err => {
    console.error('데이터베이스 연결 오류:', err);
  });

app.post('/save', async (req, res) => {
  console.log('메모 저장 요청 받음');
  try {
    const { content } = req.body;
    console.log('저장할 메모 내용:', content);
    const [result] = await pool.query('INSERT INTO notes (content) VALUES (?)', [content]);
    console.log('메모 저장 결과:', result);
    res.json({ success: true, id: result.insertId });
    console.log(`메모 저장 성공. ID: ${result.insertId}`);
  } catch (error) {
    console.error('메모 저장 중 오류:', error);
    res.status(500).json({ success: false, message: '메모 저장 중 오류가 발생했습니다.', error: error.message });
  }
});

app.get('/load/:id', async (req, res) => {
  console.log('메모 로드 요청 받음');
  try {
    const { id } = req.params;
    console.log('로드할 메모 ID:', id);
    const [rows] = await pool.query('SELECT content FROM notes WHERE id = ?', [id]);
    console.log('메모 로드 결과:', rows);
    if (rows.length > 0) {
      res.json({ success: true, content: rows[0].content });
      console.log('메모 로드 성공');
    } else {
      res.status(404).json({ success: false, message: '메모를 찾을 수 없습니다.' });
      console.log('메모를 찾을 수 없음');
    }
  } catch (error) {
    console.error('메모 로드 중 오류:', error);
    res.status(500).json({ success: false, message: '메모 로드 중 오류가 발생했습니다.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

// 주기적으로 데이터베이스 연결 상태 확인
setInterval(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('데이터베이스 연결 상태 확인: 연결됨');
    connection.release();
  } catch (err) {
    console.error('데이터베이스 연결 상태 확인: 오류', err);
  }
}, 60000); // 1분마다 확인