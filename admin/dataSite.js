// dataSite.js

import { uploadFileToGithub, downloadFileFromGithub } from './github.js';

import { DATA_FILE_PATH } from './config.js';

export const dataSite = {};
export const dataSiteSaved = {};

export async function dataSiteLoad() {
    try {
        const content = await downloadFileFromGithub(DATA_FILE_PATH);
        const data = JSON.parse(content);
        Object.assign(dataSite, data);
        Object.assign(dataSiteSaved, data);
        console.log('Data loaded successfully:', dataSite);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

export async function dataSiteUpdate() {
    try {

        // Convert dataSite to JSON string
        const content = JSON.stringify(dataSite, null, 2);

        // Get current date and time for the commit message
        const currentDateTime = new Date().toISOString().replace('T', ' ').replace('Z', '');

        // Upload updated data to GitHub
        const result = await uploadFileToGithub(DATA_FILE_PATH, content, `Update site data: ${currentDateTime}`, false);
        console.log('Data updated successfully:', result);

        // Save the updated data in dataSiteSaved
        Object.assign(dataSiteSaved, dataSite);
    } catch (error) {
        console.error('Error updating data:', error);
    }
}
