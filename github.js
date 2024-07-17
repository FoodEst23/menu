// github.js

import { getToken } from './user.js';
import { GITHUB_CONFIG } from './config.js';

const GITHUB_API_URL = 'https://api.github.com';

export async function uploadFileToGithub(path, content, message) {
    const token = getToken();
    if (!token) {
        throw new Error('GitHub token is not available');
    }

    const url = `${GITHUB_API_URL}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    const base64Content = btoa(content); // Encode content to Base64

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            content: base64Content,
            branch: GITHUB_CONFIG.branch
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to upload file: ${error.message}`);
    }

    return await response.json();
}

export async function downloadFileFromGithub(path) {
    const token = getToken();
    if (!token) {
        throw new Error('GitHub token is not available');
    }

    const url = `${GITHUB_API_URL}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}?ref=${GITHUB_CONFIG.branch}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3.raw'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to download file: ${error.message}`);
    }

    return await response.text(); // Return the raw content of the file
}
