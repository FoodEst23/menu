
import { useContext } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { AuthContext, AuthProvider } from '../contexts/Auth.js';
import { DataContext, DataProvider } from '../contexts/Data.js';
import { LoginBox } from './AuthBoxes.js';
import { FilesUpload,FilesList } from './DataBoxes.js';
// import { AssetsContext, AssetsProvider } from '../contexts/Assets.js';
 

export const App = () => {
    const { isLogged, logout, login, token } = useContext(AuthContext);
    return html`
     <div id="app">
        ${!isLogged ? html`
            <${LoginBox}/> 
            ` : html`
        <main>
            <header>
                <h1>Admin Panel</h1>
                <button id="logout-button" onClick=${logout}>Logout</button>
                <button id="upload-button">Upload File</button>
                <button id="download-button">Download File</button>
            </header>

            <section id="filesUpload">
                <${FilesList}/> 
                <${FilesUpload} multiple=${true}/> 
            </section>
        </main>
        `}
    </div>
    `

};