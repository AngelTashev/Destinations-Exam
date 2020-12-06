import { createPage, deleteDestination, destinationsPage, detailsPage, editPage, homePage, postCreate, postEdit } from './controllers/destinations.js';
import { postRegister, postLogin, registerPage, loginPage, logoutUser } from './controllers/user.js';
import { getUserData } from './util.js';

const app = Sammy('#container', function (context) {

    this.use('Handlebars', 'hbs');

    this.userData = getUserData();

    this.get('/', homePage);
    this.get('/home', homePage);
    this.get('/create', createPage);
    this.get('/destinations', destinationsPage);
    this.get('/details/:id', detailsPage);
    this.get('/edit/:id', editPage);
    this.get('/delete/:id', deleteDestination);

    this.post('/create', (ctx) => { postCreate(ctx); });
    this.post('/edit/:id', (ctx) => { postEdit(ctx); });

    this.get('/register', registerPage);
    this.get('/login', loginPage);
    this.get('/logout', logoutUser);

    this.post('/register', (ctx) => { postRegister(ctx); });
    this.post('/login', (ctx) => { postLogin(ctx); });

});

app.run();