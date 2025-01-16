function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function login() {
    window.location.href = "../pages/dashboard.html";
}

function signup() {
    window.location.href = "../pages/edit_profile.html";
}