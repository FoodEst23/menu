import { h, createContext } from 'https://cdn.skypack.dev/preact';
import { useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';

import { getFileSha } from '../github.js';

function getLocalToken() {
    return localStorage.getItem('githubToken');
}

function setLocalToken(token) {
    localStorage.setItem('githubToken', token);
}
function unsetLocalToken() {
    localStorage.removeItem('githubToken');
}



// Auth Context
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [token, setToken] = useState(null);

    async function checkValidToken(token, rememberMe = false) {
        console.log('AuthProvider checkValidToken - token:', token, typeof token, rememberMe);
        let logout = () => { setIsLogged(false); setToken(null); unsetLocalToken(); }
        if (!token) { logout(); return; }
        try {
            let sha = await getFileSha(token, "index.html")
            if (!sha) throw new Error('GitHub token is not valid');
            setIsLogged(true)
            setToken(token)
            if (rememberMe) { setLocalToken(token); }
            console.log("checkValidToken", token, sha)
        } catch (error) {
            console.error('checkValidToken Error checking token:', error);
            logout();
        }
    }


    const login = async (token, rememberMe) => {
        checkValidToken(token, rememberMe);
    };

    const logout = () => {
        checkValidToken(null, true);
    };

    useEffect(async () => {
        const localToken = getLocalToken()
        if (localToken) {
            await checkValidToken(localToken);
        }
    }, []);


    return html`
        <${AuthContext.Provider} value=${{ isLogged, login, logout, token }}>
            ${children}
        <//>
    `;
};