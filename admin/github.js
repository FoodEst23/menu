// github.js

import { getToken } from './user.js';
import { GITHUB_CONFIG } from './config.js';

const GITHUB_API_URL = 'https://api.github.com';

async function getFileSha(path) {
    const token = getToken();
    if (!token) {
        throw new Error('GitHub token is not available');
    }

    const url = `${GITHUB_API_URL}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (response.status === 404) {
        return null; // File does not exist
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get file SHA: ${error.message}`);
    }

    const data = await response.json();
    return data.sha;
}

export async function uploadFileToGithub(path, content, message, encodeBase64 = true) {
    const token = getToken();
    if (!token) {
        throw new Error('GitHub token is not available');
    }

    const sha = await getFileSha(path);

    const url = `${GITHUB_API_URL}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;
    
    // Encode content to Base64 if it's binary
    const base64Content = encodeBase64 ? btoa(content) : content;

    const body = {
        message: message,
        content: base64Content,
        branch: GITHUB_CONFIG.branch
    };

    if (sha) {
        body.sha = sha; // Include the SHA if the file already exists
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
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
