import { h, createContext } from 'https://cdn.skypack.dev/preact';
import { useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { checkSavedToken, saveToken, authenticateUser, logoutUser, uploadFileToGithub, downloadFileFromGithub } from './utils.js';


// Assets Context
export const AssetsContext = createContext();
export const AssetsProvider = ({ children }) => {
    const uploadFile = async (file) => {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const base64Content = event.target.result.split(',')[1]; // Get Base64 string
            try {
                const result = await uploadFileToGithub(`contents/${file.name}`, base64Content, `Upload at ${new Date().toISOString()}`);
                console.log('File uploaded successfully:', result);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };
        reader.readAsDataURL(file);
    };

    const deleteFile = async (path) => {
        // Implement delete functionality
    };

    return html`
        <${AssetsContext.Provider} value=${{ uploadFile, deleteFile }}>
            ${children}
        <//>
    `;
};