// user.js

export function checkSavedToken() {
    return localStorage.getItem('githubToken');
}

export function saveToken(token) {
    localStorage.setItem('githubToken', token);
}

export function authenticateUser(token) {
    // Here you would normally verify the token with GitHub API
    // For this example, we'll assume the token is valid if it's not empty
    if (token) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-container').style.display = 'block';
    } else {
        alert('Invalid token. Please try again.');
    }
}

export function logoutUser() {
    localStorage.removeItem('githubToken');
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('admin-container').style.display = 'none';
}

export function getToken() {
    return localStorage.getItem('githubToken');
}