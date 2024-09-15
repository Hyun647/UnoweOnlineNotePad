document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const interest = document.getElementById('interest').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, interest })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = '가입이 완료되었습니다!';
    })
    .catch(error => {
        document.getElementById('message').textContent = '오류가 발생했습니다.';
    });
});