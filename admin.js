// admin.js

import { checkSavedToken, saveToken, authenticateUser, logoutUser } from './user.js';
import { uploadFileToGithub, downloadFileFromGithub } from './github.js';

function initLogin(){
    const loginForm = document.getElementById('login-form');
    const tokenInput = document.getElementById('token');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const logoutButton = document.getElementById('logout-button');
    const loginContainer = document.getElementById('login-container');
    const adminContainer = document.getElementById('admin-container');

    // Check if a token is saved in localStorage
    const savedToken = checkSavedToken();
    if (savedToken) {
        console.log("initLogin savedToken",savedToken)
        authenticateUser(savedToken);
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const token = tokenInput.value;
        
        if (rememberMeCheckbox.checked) {
            saveToken(token);
        }
        authenticateUser(token);
    });

    logoutButton.addEventListener('click', () => {
        logoutUser();
    });
    
}

document.getElementById('upload-button').addEventListener('click', async () => {
    try {
        const result = await uploadFileToGithub('owner', 'repo', 'path/to/file.txt', 'File content', 'Commit message');
        console.log('File uploaded successfully:', result);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
});

document.getElementById('download-button').addEventListener('click', async () => {
    try {
        const content = await downloadFileFromGithub('owner', 'repo', 'path/to/file.txt');
        console.log('File downloaded successfully:', content);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
});

initLogin()
