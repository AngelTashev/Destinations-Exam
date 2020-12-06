import { register, login, logout } from "../data.js";
import { addPartials, removeUserData, setErrorBox, setSuccessBox } from "../util.js";

const emailPattern = RegExp('.+@.+\..+');

export async function registerPage() {
    await addPartials(this);
    this.partial('/src/templates/user/registerPage.hbs');
}

export async function postRegister(ctx) {
    try {
        const { email, password, rePassword } = ctx.params;
        if (!email || !password || !rePassword) {
            throw new Error('All fields are required!');
        }
        if (!emailPattern.test(email)) {
            throw new Error('Email is not valid!');
        }
        if (password !== rePassword) {
            throw new Error('Passwords don\'t match!');
        }

        const result = await register(email, password);
        ctx.app.userData = result;
        setSuccessBox('User registration successful.');
        ctx.redirect('/home');
    } catch (err) {
        if (err.message == 'EMAIL_EXISTS') {
            setErrorBox("Email address is already registered!");
        } else {
            setErrorBox(err.message);
        }
        console.clear();
        removeUserData();
    }
}

export async function loginPage() {
    await addPartials(this);
    this.partial('/src/templates/user/loginPage.hbs');
}

export async function postLogin(ctx) {
    try {
        const { email, password } = ctx.params;
        if (!email || !password) {
            throw new Error('All fields are required!');
        }
        const result = await login(email, password);
        ctx.app.userData = result;
        setSuccessBox('Login successful.');
        ctx.redirect('/home');
    } catch (err) {
        setErrorBox(err.message);
        console.clear();
        removeUserData();
    }
}

export async function logoutUser() {
    await logout();
    this.app.userData = null;
    setSuccessBox('Logout successful.');
    this.redirect('/login');
}