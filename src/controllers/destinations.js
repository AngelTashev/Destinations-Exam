import { createDestination, editDestination, getAll, getById, deleteById, getUserDestinations } from "../data.js";
import { addPartials, checkDestinationDetails, setErrorBox, setSuccessBox } from "../util.js";

export async function homePage() {

    await addPartials(this);
    const destinationPartial = await this.load('/src/templates/destinations/destinationHomePartial.hbs');
    this.partials.destination = destinationPartial;

    let context = {
        user: this.app.userData,
        destinations: await getAll(),
    };

    this.partial('/src/templates/destinations/homePage.hbs', context);
}

export async function createPage() {

    if(!checkLogin(this)) return this.redirect('/login');

    await addPartials(this);
    let context = {
        user: this.app.userData,
    };

    this.partial('/src/templates/destinations/createPage.hbs', context);
}

export async function postCreate(ctx) {

    if(!checkLogin(ctx)) return this.redirect('/login');

    try {
        const { destination, city, duration, departureDate, imgUrl } = ctx.params;

        checkDestinationDetails(destination, city, duration, departureDate, imgUrl);
        await createDestination(destination, city, Number(duration), departureDate, imgUrl);

        setSuccessBox('Successfully added destination.');
        ctx.redirect('/home');
    } catch (err) {
        setErrorBox(err.message);
        console.clear();
    }
}

export async function detailsPage() {

    if(!checkLogin(this)) return this.redirect('/login');

    await addPartials(this);

    let context = {
        user: this.app.userData,
        destination: await getById(this.params.id),
    };

    this.partial('/src/templates/destinations/detailsPage.hbs', context);

}

export async function editPage() {

    if(!checkLogin(this)) return this.redirect('/login');

    await addPartials(this);

    let context = {
        user: this.app.userData,
        destination: await getById(this.params.id),
    };

    this.partial('/src/templates/destinations/editPage.hbs', context);

}

export async function postEdit(ctx) {

    if(!checkLogin(ctx)) return this.redirect('/login');

    try {
        const { id, destination, city, duration, departureDate, imgUrl } = ctx.params;

        checkDestinationDetails(destination, city, duration, departureDate, imgUrl);
        await editDestination(id, destination, city, Number(duration), departureDate, imgUrl);

        setSuccessBox('Successfully edited destination.');
        ctx.redirect('/details/' + id);
    } catch (err) {
        setErrorBox(err.message);
        console.clear();
    }
}

export async function destinationsPage() {

    if(!checkLogin(this)) return this.redirect('/login');

    await addPartials(this);
    const destinationPartial = await this.load('/src/templates/destinations/destinationTicketPartial.hbs');
    this.partials.destination = destinationPartial;

    let context = {
        user: this.app.userData,
        destinations: await getUserDestinations(),
    };

    this.partial('/src/templates/destinations/destinationsPage.hbs', context);
}

export async function deleteDestination() {

    if(!checkLogin(this)) return this.redirect('/login');

    await deleteById(this.params.id);
    setSuccessBox('Destination deleted.');
    this.redirect('/destinations');
}

function checkLogin(ctx) {
    return !!ctx.app.userData;
}