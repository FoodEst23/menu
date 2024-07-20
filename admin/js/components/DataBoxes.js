import { useContext, useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { DataContext, DataProvider } from '../contexts/Data.js';
 

export const FilesUpload = ({multiple}) => {
    const { uploadFile } = useContext(DataContext);

    return html`
       <div class="upload-files">
                <h2>Upload Files</h2>
                <form id="image-upload-form" onSubmit=${async (e) => { 
                    e.preventDefault(); 
                    const files = e.target.fileUpload.files
                    console.log('App uploadFiles onSubmit', e.target.fileUpload.files[0]);
                    for (const file of files) {
                        console.log('App uploadFiles file', file);
                        const result = await uploadFile(`contents/${file.name}`, file);
                        console.log('App uploadFiles result', result);
                    }
                }}>
                    <label for="file-upload">Select Image:</label>
                    ${multiple ? html`<input type="file" accept="image/*" name="fileUpload" multiple  />`
                        : html`<input type="file" accept="image/*" name="fileUpload" />`
                    }
                    
                    <button type="submit">Upload Image</button>
                </form>
            </div>
    `

};

export const FilesList = ({ directoryPath = "contents" }) => {
    const { getFilesList } = useContext(DataContext);
    const [files, setFiles] = useState([]);
  
    useEffect(() => {
      const fetchFiles = async () => {
        const fileList = await getFilesList(directoryPath);
        console.log('FilesList - Files list:', fileList);
        setFiles(fileList);
      };
      fetchFiles();
    }, [directoryPath, getFilesList]);
  
    return html`
      <ul>
        ${files.map(
          (file) => html`<li>${file}</li>`
        )}
      </ul>
    `;
  };
