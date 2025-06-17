// JavaScript for handling login and signup functionality
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Validate inputs
            if (!email || !password) {
                showMessage('error', 'Please fill in all fields');
                return;
            }
            
            // Send login request to API
            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // Store token in localStorage
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Show success message
                    showMessage('success', 'Login successful! Redirecting...');
                    
                    // Redirect to home page after 1 second
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showMessage('error', data.message || 'Login failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', 'An error occurred. Please try again later.');
            });
        });
    }
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                showMessage('error', 'Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('error', 'Passwords do not match');
                return;
            }
            
            // Send signup request to API
            fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // Store token in localStorage
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Show success message
                    showMessage('success', 'Registration successful! Redirecting...');
                    
                    // Redirect to home page after 1 second
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showMessage('error', data.message || 'Registration failed. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', 'An error occurred. Please try again later.');
            });
        });
    }
    
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update UI based on authentication status
    updateAuthUI(authToken, user);
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Show success message
            showMessage('success', 'Logged out successfully! Redirecting...');
            
            // Redirect to home page after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
});

// Helper function to show messages
function showMessage(type, message) {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        
        // Clear message after 5 seconds
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
    }
}

// Update UI based on authentication status
function updateAuthUI(token, user) {
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
        if (token) {
            // User is logged in
            userActions.innerHTML = `
                <div class="user-profile">
                    <span>Welcome, ${user.name || 'User'}</span>
                    <button id="logout-btn" class="btn-logout">Logout</button>
                </div>
            `;
        } else {
            // User is not logged in
            userActions.innerHTML = `
                <button class="btn-login" onclick="window.location.href='login.html'">Login</button>
                <button class="btn-signup" onclick="window.location.href='signup.html'">Sign Up</button>
            `;
        }
    }
}
