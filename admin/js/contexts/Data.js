import { h, createContext } from 'https://cdn.skypack.dev/preact';
import { useContext, useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { AuthContext } from '../contexts/Auth.js';
import { downloadFileFromGithub, uploadFileToGithub, getFilesListFromGithub, deleteFileFromGithub } from '../github.js';


// Data Context
export const DataContext = createContext();
export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const { token } = useContext(AuthContext);
    const loadData = async () => {
        const content = await downloadFileFromGithub(token,'data/site.json');
        let newData = JSON.parse(content)
        console.log('DataProvider loadData:', newData,content);
        setData(newData);
    };
    const saveData = async () => {
        console.log('DataProvider saveData:', data);
        const content = JSON.stringify(data);
        await uploadFileToGithub(token, 'data/site.json', content, 'Update at '+new Date().toISOString(),true);
        console.log('DataProvider saveData - Data saved successfully');
    }
    const uploadFileFromForm = (path,file) =>new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const base64Content = event.target.result.split(',')[1]; // Get Base64 string
            try {
                const result = await uploadFileToGithub(token,path, base64Content, `Upload at ${new Date().toISOString()}`,true);
                console.log('DataProvider uploadFileFromForm - File uploaded successfully:', result);
                resolve(result);
            } catch (error) {
                console.error('DataProvider uploadFileFromForm - Error uploading file:', error);
                reject(error);
            }
        };
        reader.readAsDataURL(file);
    })  
    const uploadFile = async (path,content,isBase64Content) => {
        await uploadFileToGithub(token,path, content, `Upload at ${new Date().toISOString()}`,isBase64Content);
    }  

    const getFilesList = async (directoryPath) => {
        const files = await getFilesListFromGithub(token, directoryPath);
        console.log('DataProvider getFilesList - Files list:', files);        
        return files;
    };

    const deleteFile = async (path) => {
        await deleteFile(token, path);
        console.log('DataProvider deleteFile - File deleted successfully:', path);
    };

    useEffect(() => {
        if(token&&data===null)loadData();
    }, [token]);

    return html`
        <${DataContext.Provider} value=${{ data, setData, uploadFile,  uploadFileFromForm, deleteFile, getFilesList, saveData  }}>
            ${children}
        <//>
    `;
};