function saveMemo() {
  const content = document.getElementById('memo').value;
  fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`메모가 저장되었습니다. ID: ${data.id}`);
      } else {
        alert('메모 저장에 실패했습니다.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('메모 저장 중 오류가 발생했습니다.');
    });
}

function loadMemo() {
  const id = prompt('불러올 메모의 ID를 입력하세요:');
  if (id) {
    fetch(`http://localhost:3000/load/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById('memo').value = data.content;
        } else {
          alert('메모를 찾을 수 없습니다.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('메모 로드 중 오류가 발생했습니다.');
      });
  }
}