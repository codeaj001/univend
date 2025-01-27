// auth.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const messageBox = document.getElementById('messageBox');
    const signupMessageBox = document.getElementById('signupMessageBox');

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

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        function displayMessage(message, color) {
            messageBox.textContent = message; // Set the message
            messageBox.style.color = color; // Set the text color
            messageBox.style.display = 'block'; // Show the messageBox
        }
        // console.log('Login submitted');

        if (email && password) {
            // Simulate successful login
            displayMessage('Login successful! Redirecting...', 'green');
    
            // Redirect to homepage.html after a short delay
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 1000);
        } else {
            displayMessage('Please fill in both email and password.', 'red');
        }
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const campus = document.getElementById('campusSelect').value;

        // Function to display a message in the signupMessageBox
        function displayMessage(message, color) {
            signupMessageBox.textContent = message; // Set the message
            signupMessageBox.style.color = color; // Set the text color
            signupMessageBox.style.display = 'block'; // Show the messageBox
        }

        // Validate inputs
        if (!name || !email || !password || campus === 'Select your campus') {
            displayMessage('Please fill in all fields.', 'red');
            return;
        }

        // Simulate successful signup
        displayMessage('Signup successful! Redirecting to KYC...', 'green');

        // Redirect to kyc.html after a short delay
        setTimeout(() => {
            window.location.href = 'kyc.html';
        }, 1000);
        });
});