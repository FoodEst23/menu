// github.js

import { GITHUB_CONFIG } from './config.js';

const GITHUB_API_URL = 'https://api.github.com';


export async function deleteFileFromGithub(token, path) {
    const url = `${GITHUB_API_URL}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${path}`;

    const sha = await getFileSha(token, path);

    if (!sha) {
        throw new Error('File not found');
    }

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: 'Delete file',
            sha: sha
        })
    });

    if (response.status !== 200) {
        throw new Error('Failed to delete file');
    }
}

export async function getFilesListFromGithub(token, directoryPath) {
    const url = `${GITHUB_API_URL}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${directoryPath}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (response.status !== 200) {
        throw new Error('Failed to get files list');
    }

    const data = await response.json();
    return data.map(file => file.name);
}

export async function getFileSha(token, path) {
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

export async function uploadFileToGithub(token, path, content, message, encodeBase64 = true) {
    if (!token) {
        throw new Error('GitHub token is not available');
    }

    const sha = await getFileSha(token,path);

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

export async function downloadFileFromGithub(token,path) {
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
