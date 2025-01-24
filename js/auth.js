// auth.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');

    showSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });

    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add login logic here
        console.log('Login submitted');
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add signup logic here
        console.log('Signup submitted');
    });
});