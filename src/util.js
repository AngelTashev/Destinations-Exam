export function setUserData(data) {
    sessionStorage.setItem('auth', JSON.stringify(data));
}

export function getUserData() {
    let auth = sessionStorage.getItem('auth');
    if (auth !== null) {
        return JSON.parse(auth);
    }
    return null;
}

export function getUserId() {
    let auth = sessionStorage.getItem('auth');
    if (auth !== null) {
        return JSON.parse(auth).localId;
    }
    return null;
}

export function removeUserData() {
    sessionStorage.clear();
}

export function objectToArray(data) {
    if (data === null) {
        return [];
    }
    return Object.entries(data).map(([k, v]) => Object.assign({_id:k}, v));
}

export async function addPartials(ctx) {
    const partials = await Promise.all([
        ctx.load('/src/templates/common/header.hbs'),
        ctx.load('/src/templates/common/footer.hbs')
    ]);
    ctx.partials = {
        header: partials[0],
        footer: partials[1],
    };
}

export function setErrorBox(message) {
    const errorBox = document.querySelector('.errorBox');
    errorBox.innerHTML = 'Error: ' + message;
    errorBox.style.display = 'block';
    window.addEventListener('click', function() {
        errorBox.style.display = 'none';
        errorBox.innerHTML = 'Defaul Error Message';
    });
}

export function setSuccessBox(message) {
    const successBox = document.querySelector('.infoBox');
        successBox.innerHTML = message;
        successBox.style.display = 'block';
        setTimeout(function(){
            successBox.style.display = 'none';
            successBox.innerHTML = 'Default Success Message';
        }, 3000);
}

export function showLoadingBox() {
    document.querySelector('.loadingBox').style.display = 'block';
}

export function hideLoadingBox() {
    document.querySelector('.loadingBox').style.display = 'none';
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function getFormattedDate(date) {

    const [ year, month, day ] = date.split('-');

    const formattedMonth = months[Number(month) - 1];
    return `${day} ${formattedMonth} ${year}`;
}

export function checkDestinationDetails(destination, city, duration, departureDate, imgUrl) {
    if (!destination) {
        throw new Error('Destination name cannot be empty!');
    }
    if (!city) {
        throw new Error('City cannot be empty!');
    }

    if (!duration) {
        throw new Error('Duration cannot be empty!');
    }

    const durationNumber = Number(duration);

    if(durationNumber < 1 || durationNumber > 100) {
        throw new Error('Duration must be a valid number between 1 and 100!');
    }

    if (!departureDate) {
        throw new Error('Departure date cannot be empty!');
    }

    if (!imgUrl) {
        throw new Error('Image cannot be empty!');
    }
}