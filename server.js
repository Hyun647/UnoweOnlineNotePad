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

// 서버 시작 전에 데이터베이스 연결 테스트
pool.getConnection()
  .then(connection => {
    console.log('데이터베이스 연결 성공');
    connection.release();
  })
  .catch(err => {
    console.error('데이터베이스 연결 오류:', err);
  });

app.post('/save', async (req, res) => {
  try {
    const { content } = req.body;
    const [result] = await pool.query('INSERT INTO notes (content) VALUES (?)', [content]);
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('메모 저장 중 오류:', error);
    res.status(500).json({ success: false, message: '메모 저장 중 오류가 발생했습니다.', error: error.message });
  }
});

app.get('/load/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT content FROM notes WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json({ success: true, content: rows[0].content });
    } else {
      res.status(404).json({ success: false, message: '메모를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '메모 로드 중 오류가 발생했습니다.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});