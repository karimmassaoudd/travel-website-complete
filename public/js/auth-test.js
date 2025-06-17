// Test script for authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Authentication test script loaded');
    
    // Test user registration
    function testRegistration() {
        console.log('Testing user registration...');
        
        const testUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };
        
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Registration response:', data);
            if (data.token) {
                console.log('Registration successful!');
                localStorage.setItem('testAuthToken', data.token);
                localStorage.setItem('testUser', JSON.stringify(data.user));
                testLogin();
            } else {
                console.error('Registration failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error during registration test:', error);
        });
    }
    
    // Test user login
    function testLogin() {
        console.log('Testing user login...');
        
        const loginCredentials = {
            email: 'test@example.com',
            password: 'password123'
        };
        
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginCredentials)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Login response:', data);
            if (data.token) {
                console.log('Login successful!');
                localStorage.setItem('testAuthToken', data.token);
                localStorage.setItem('testUser', JSON.stringify(data.user));
                testGetUser();
            } else {
                console.error('Login failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error during login test:', error);
        });
    }
    
    // Test getting user data
    function testGetUser() {
        console.log('Testing get user data...');
        
        const token = localStorage.getItem('testAuthToken');
        
        if (!token) {
            console.error('No token available for user data test');
            return;
        }
        
        fetch('/api/users/user', {
            method: 'GET',
            headers: {
                'x-auth-token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('User data response:', data);
            if (data._id) {
                console.log('Get user data successful!');
            } else {
                console.error('Get user data failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error during get user data test:', error);
        });
    }
    
    // Run tests
    const runTestsBtn = document.getElementById('run-auth-tests');
    if (runTestsBtn) {
        runTestsBtn.addEventListener('click', function() {
            testRegistration();
        });
    }
});
