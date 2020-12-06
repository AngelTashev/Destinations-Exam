import { destinationsPage } from "./controllers/destinations.js";
import { setUserData, getUserData, showLoadingBox, hideLoadingBox, getUserId, objectToArray, getFormattedDate } from "./util.js";

const apiKey = 'AIzaSyCSCTi78h8WPwr4KyO-i90Fa_ihSEecTJo';
const databaseUrl = 'https://destinations-exam-18c51-default-rtdb.firebaseio.com/';

const endpoints = {
    LOGIN: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    REGISTER: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
    DESTINATIONS: 'destinations',
    DESTINATION_BY_ID: 'destinations/',
}

function host(url) {
    let result = `${databaseUrl}${url}.json`;
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}`;
    }
    return result;
}

async function request(url, method, body) {
    let options = {
        method,
    };

    if (body) {
        Object.assign(options, {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body),
        });
    }

    showLoadingBox();

    let response = await fetch(url, options);

    let data = await response.json();

    hideLoadingBox();

    if (data && data.hasOwnProperty('error')) {
        let message = data.error.message;
        if (message === 'INVALID_EMAIL' || message === 'EMAIL_NOT_FOUND' || message === 'INVALID_PASSWORD') {
            message = 'Invalid credentials. Please retry your request with correct credentials';
        }
        throw new Error(message);
    }
    return data;
}

async function get(url) {
    return request(url, 'GET');
}

async function post(url, body) {
    return request(url, 'POST', body);
}

async function patch(url, body) {
    return request(url, 'PATCH', body);
}

async function del(url) {
    return request(url, 'DELETE');
}

export async function login(email, password) {
    let data = await post(endpoints.LOGIN + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(data);

    return data;
}

export async function register(email, password) {
    let data = await post(endpoints.REGISTER + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(data);

    return data;
}

export async function logout() {
    return sessionStorage.clear();
}

export async function getAll() {

    let result = await get(host(endpoints.DESTINATIONS));
    let data = objectToArray(result);

    return data;
    
}

export async function getUserDestinations() {

    let result = await getAll();

    let data = result.filter(destination => destination._ownerId === getUserId());

    return data;

}

export async function getById(id) {

    let result = await get(host(endpoints.DESTINATION_BY_ID + id));

    let data = Object.assign(result, {
        _id: id,
        _isOwner: getUserId() === result._ownerId,
        formattedDepartureDate: getFormattedDate(result.departureDate),
    });

    return data;
}

export async function createDestination(destination, city, duration, departureDate, imgUrl) {
    let data = await post(host(endpoints.DESTINATIONS), {
        destination,
        city,
        duration,
        departureDate,
        imgUrl,
        _ownerId: getUserId(),
    });

    return data;
}

export async function editDestination(id, destination, city, duration, departureDate, imgUrl) {
    let data = await patch(host(endpoints.DESTINATION_BY_ID + id), {
        destination,
        city,
        duration,
        departureDate,
        imgUrl,
    });

    return data;
}

export async function deleteById(id) {
    return await del(host(endpoints.DESTINATION_BY_ID + id));
}