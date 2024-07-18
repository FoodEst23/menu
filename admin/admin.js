// admin.js

import { checkSavedToken, saveToken, authenticateUser, logoutUser } from '../user.js';
import { uploadFileToGithub, downloadFileFromGithub } from '../github.js';
import { dataSiteLoad, dataSiteUpdate, dataSite, dataSiteSaved } from '../dataSite.js';

function getCurrentDateTime() { return new Date().toISOString().replace('T', ' ').replace('Z', ''); }

function initLogin() {
    const loginForm = document.getElementById('login-form');
    const tokenInput = document.getElementById('token');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const logoutButton = document.getElementById('logout-button');
    const loginContainer = document.getElementById('login-container');
    const adminContainer = document.getElementById('admin-container');

    // Check if a token is saved in localStorage
    const savedToken = checkSavedToken();
    if (savedToken) {
        console.log("initLogin savedToken", savedToken)
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
        const result = await uploadFileToGithub('contents/test.txt', 'File content', `Admin save ${getCurrentDateTime()}`);
        console.log('File uploaded successfully:', result);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
});
document.getElementById('upload-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];
    console.log('upload-btn:', file, fileInput);
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            console.log('event.target.result', event.target.result);
            const base64Content = event.target.result.split(',')[1]; // Get Base64 string
            try {
                const result = await uploadFileToGithub(`contents/${file.name}`, base64Content, `Commit message: ${getCurrentDateTime()}`, false);
                console.log('File uploaded successfully:', result);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };
        reader.readAsDataURL(file);
    } else {
        console.error('No file selected for upload');
    }
});


document.getElementById('download-button').addEventListener('click', async () => {
    try {
        const content = await downloadFileFromGithub('path/to/file.txt');
        console.log('File downloaded successfully:', content);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
});

initLogin()
dataSiteLoad()