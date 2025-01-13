function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function login() {
    // const email = document.getElementById('email').value;
    // const password = document.getElementById('password').value;
    window.location.href = "../pages/dashboard.html";
}

function signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const campus = document.getElementById('campus').value;
    alert(`Signed up as: ${name}, Email: ${email}, Campus: ${campus}`);
}