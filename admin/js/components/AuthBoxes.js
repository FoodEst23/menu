import { useContext } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { AuthContext, AuthProvider } from '../contexts/Auth.js';
// import { AssetsContext, AssetsProvider } from '../contexts/Assets.js';
 

export const LoginBox = () => {
    const {  login } = useContext(AuthContext);

    return html`
        <div id="login-container">
                <h2>Login</h2>
                <form  onSubmit=${(e) => {
                    console.log('LoginBox onSubmit', e.target.token.value, e.target['remember-me'].checked);
                    e.preventDefault(); login(e.target.token.value, e.target['remember-me'].checked);
                     }}>
                    <label for="token">Personal Access Token:</label>
                    <input type="text" id="token" name="token" required/>
                    <label>
                        <input type="checkbox" id="remember-me"/> Remember Me
                    </label>
                    <button type="submit">Login</button>
                </form>
        </div>
    `

};