
import { useContext } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { renderToString } from 'https://cdn.skypack.dev/preact-render-to-string';
import { AuthContext, AuthProvider } from '../contexts/Auth.js';
import { DataContext, DataProvider } from '../contexts/Data.js';
import { LoginBox } from './AuthBoxes.js';
import { FilesUpload,FilesList } from './DataBoxes.js';
import { MenuSelectBox} from './MenuBoxes.js';
import { ProductsCategoriesEditBox} from './ProductsCategoriesEditBox.js';
import { ProductsEditBox} from './ProductsEditBox.js';
import { LocationEditBox} from './LocationEditBox.js';
import { MainPage} from './MainPage.js';
// import { AssetsContext, AssetsProvider } from '../contexts/Assets.js';
 

export const App = () => {
    const { isLogged, logout, login, token } = useContext(AuthContext);
    const { data, saveData, uploadFile } = useContext(DataContext);
    const save = () => {
        saveData();
        let htmlString = renderToString(html`<${MainPage} preview=${false} data=${data} />`);
        htmlString = `<!DOCTYPE html>\n${htmlString}`
        // uploadFile('index.html', htmlString);
        console.log('App save:', htmlString);
    };
    return html`
     <div id="app">
     ${isLogged ? null : html`<${LoginBox}/>`}
     ${!isLogged ? null : html`
        <main>
            <header>
                <h1>Admin Panel</h1>
                <button id="logout-button" onClick=${logout}>Logout</button>
                <button id="save-button" onClick=${save}>Save</button>
            </header>
            <section id="filesUpload">
                <${FilesList}/> 
                <${FilesUpload} multiple=${true}/> 
            </section>
            <section id="editMenus">
                ${data ? null : html`
                    <div>Loading Data ... </div>
                `}
                ${!data ? null : html`
                    <${MenuSelectBox}/>  
                    <${ProductsCategoriesEditBox}/>  
                    <${ProductsEditBox}/>  
                    <${LocationEditBox}/>  
                    <${MainPage} preview=${true} data=${data}/>  
                `}
            </section>
        </main>
        `}
    </div>
    `

};