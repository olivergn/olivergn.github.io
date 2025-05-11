/* Global constants */
const statuses = ["Not Threatened", "Naturally Uncommon", "Relict", "Recovering", "Declining", "Nationally Increasing", "Nationally Vulnerable", "Nationally Endangered", "Nationally Critical", "Extinct", "Data Deficient"];
const fave = "Favourite";
const faveMsg = "Add this bird to favourites in local storage"
const unfave = "Unfavourite";
const unfaveMsg = "Remove this bird from favourites in local storage"

/* Global variables */
let blue = true; // True if theme is set to blue, false if set to red
let textVal, statusVal, orderVal; // Variables to represent parameters for the search form

/* Miscellaneous helper functions */

/**
 * Checks all name fields of a bird's JSON object and returns true if they contain the currently searched string.
 * @param {*} bird The bird we are checking contains textVal
 * @returns True if a bird's names include the text value, false otherwise
 */
function isNameSearched(bird) {
    // Create normalised and lowercase versions of strings for comparison
    const commonName = bird.common_name.normalize("NFC").toLowerCase();
    const originalName = bird.original_name.normalize("NFC").toLowerCase();
    const scientificName = bird.scientific_name.normalize("NFC").toLowerCase();
    const query = textVal.normalize("NFC").toLowerCase();

    if (commonName.includes(query)) return true;
    if (originalName.includes(query)) return true;
    if (scientificName.includes(query)) return true;
    for (birdName of bird.other_name) {
        if (birdName.normalize("NFC").toLowerCase().includes(query)) return true;
    }
    return false;
}

/**
 * Checks the conservation status of a bird's JSON object and returns true if it matches statusVal, or if statusVal is set to All.
 * @param {*} bird The bird we are checking matches statusVal
 * @returns True if a bird's status matches the searched status
 */
function isStatusSearched(bird) {
    if (statusVal === "All") return true;
    if (bird.status === statusVal) return true;
    return false;
}

/**
 * Clears the container of infoboxes, to allow for refilling, and returns the empty container.
 * @returns Container to allow for new things to be added.
 */
function clearReturnContainer() {
    let container = document.getElementById('infobox-container'); // Container to put the birds in

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    return container;
}

/**
 * Takes the data from a bird, builds an infobox from it, and inserts it into the DOM.
 * @param {*} container DOM element containing the infoboxes.
 * @param {*} bird JSON data on this specific bird.
 */
function buildInfobox(container, bird) {
    let infobox = document.createElement('div');

    if (blue) {
        infobox.className = 'infobox blue-3';
    } else {
        infobox.className = 'infobox red-3';
    }
    
    // Button to favourite or unfavourite bird
    let faveBirdButton = document.createElement('input');
    faveBirdButton.setAttribute('type', 'button');
    faveBirdButton.setAttribute('id', 'fave-bird-button');
    if (getFaveKeys().includes(bird.common_name)) { // Determine what the button says by whether the bird is already favourited
        faveBirdButton.setAttribute('value', unfave);
        faveBirdButton.setAttribute('title', unfaveMsg);
    } else {
        faveBirdButton.setAttribute('value', fave);
        faveBirdButton.setAttribute('title', faveMsg);
    }
    faveBirdButton.addEventListener('click', faveBirdEventHandler);

    // Image panel containing the photo of the bird
    let infoImage = document.createElement('img');
    infoImage.src = bird.photo.source;

    // Paragraph containing the author's name
    let infoCredit = document.createElement('p');
    infoCredit.setAttribute('class', 'credit');
    infoCredit.textContent = "Credit: " + bird.photo.credit;

    // Coloured circle representing endangered status
    let infoCircle = document.createElement('div');

    switch (bird.status) {
        case "Not Threatened":
            infoCircle.setAttribute('class', "circle-big col-nt");
            break;
        case "Naturally Uncommon":
            infoCircle.setAttribute('class', "circle-big col-nu");
            break;
        case "Relict":
            infoCircle.setAttribute('class', "circle-big col-rl");
            break;
        case "Recovering":
            infoCircle.setAttribute('class', "circle-big col-rc");
            break;
        case "Declining":
            infoCircle.setAttribute('class', "circle-big col-dc");
            break;
        case "Nationally Increasing":
            infoCircle.setAttribute('class', "circle-big col-ni");
            break;
        case "Nationally Vulnerable":
            infoCircle.setAttribute('class', "circle-big col-nv");
            break;
        case "Nationally Endangered":
            infoCircle.setAttribute('class', "circle-big col-ne");
            break;
        case "Nationally Critical":
            infoCircle.setAttribute('class', "circle-big col-nc");
            break;
        case "Extinct":
            infoCircle.setAttribute('class', "circle-big col-black");
            break;
        case "Data Deficient":
            infoCircle.setAttribute('class', "circle-big col-black");
            break;
        default:
            infoCircle.setAttribute('class', "circle-big col-error");
    }
    infoCircle.setAttribute('title', bird.status);

    // H2 containing common name
    let infoHeader = document.createElement('h2');
    infoHeader.setAttribute('id', 'info-header'); // For the favoriting event listener
    infoHeader.textContent = bird.common_name;

    // Table containing other attributes of birds
    let infoTable = document.createElement('table');

    let originalNameRow = document.createElement('tr');
    let originalNameHeading = document.createElement('th');
    originalNameHeading.textContent = "Original name";
    let originalNameValue = document.createElement('td');
    originalNameValue.textContent = bird.original_name;

    let scientificNameRow = document.createElement('tr');
    let scientificNameHeading = document.createElement('th');
    scientificNameHeading.textContent = "Scientific name";
    let scientificNameValue = document.createElement('td');
    scientificNameValue.textContent = bird.scientific_name;

    let otherNameRow = document.createElement('tr');
    let otherNameHeading = document.createElement('th');
    otherNameHeading.textContent = "Other names";
    let otherNameValue = document.createElement('td');
    let otherNameText = "";
    for (let name of bird.other_name) { // Iterate through each other name and separate with commas
        otherNameText += name + ", ";
    }
    otherNameText = otherNameText.substring(0, otherNameText.length - 2); // Remove the trailing comma
    otherNameValue.textContent = otherNameText;

    let orderRow = document.createElement('tr');
    let orderHeading = document.createElement('th');
    orderHeading.textContent = "Order";
    let orderValue = document.createElement('td');
    orderValue.textContent = bird.order;

    let familyRow = document.createElement('tr');
    let familyHeading = document.createElement('th');
    familyHeading.textContent = "Family";
    let familyValue = document.createElement('td');
    familyValue.textContent = bird.family;

    let statusRow = document.createElement('tr');
    let statusHeading = document.createElement('th');
    statusHeading.textContent = "Status";
    let statusValue = document.createElement('td');
    statusValue.textContent = bird.status;

    let lengthRow = document.createElement('tr');
    let lengthHeading = document.createElement('th');
    lengthHeading.textContent = "Length";
    let lengthValue = document.createElement('td');
    lengthValue.textContent = bird.length;

    let weightRow = document.createElement('tr');
    let weightHeading = document.createElement('th');
    weightHeading.textContent = "Weight";
    let weightValue = document.createElement('td');
    weightValue.textContent = bird.weight;

    container.appendChild(infobox);

    infobox.appendChild(faveBirdButton);
    infobox.appendChild(infoImage);
    infobox.appendChild(infoCredit);
    infobox.appendChild(infoCircle);
    infobox.appendChild(infoHeader);
    infobox.appendChild(infoTable);

    // Only add row if value has text content
    if (originalNameValue.textContent !== "") {
        infoTable.appendChild(originalNameRow);
        originalNameRow.appendChild(originalNameHeading);
        originalNameRow.appendChild(originalNameValue);
    }

    if (scientificNameValue.textContent !== "") {
        infoTable.appendChild(scientificNameRow);
        scientificNameRow.appendChild(scientificNameHeading);
        scientificNameRow.appendChild(scientificNameValue);
    }

    if (otherNameValue.textContent !== "") {
        infoTable.appendChild(otherNameRow);
        otherNameRow.appendChild(otherNameHeading);
        otherNameRow.appendChild(otherNameValue);
    }

    if (orderValue.textContent !== "") {
        infoTable.appendChild(orderRow);
        orderRow.appendChild(orderHeading);
        orderRow.appendChild(orderValue);
    }

    if (familyValue.textContent !== "") {
        infoTable.appendChild(familyRow);
        familyRow.appendChild(familyHeading);
        familyRow.appendChild(familyValue);
    }

    if (statusValue.textContent !== "") {
        infoTable.appendChild(statusRow);
        statusRow.appendChild(statusHeading);
        statusRow.appendChild(statusValue);
    }

    if (lengthValue.textContent !== "") {
        infoTable.appendChild(lengthRow);
        lengthRow.appendChild(lengthHeading);
        lengthRow.appendChild(lengthValue);
    }

    if (weightValue.textContent !== "") {
        infoTable.appendChild(weightRow);
        weightRow.appendChild(weightHeading);
        weightRow.appendChild(weightValue);
    }
}

/**
 * Get all keys which are favourited in local storage.
 * @returns Array of all keys which are favourited.
 */
function getFaveKeys() {
    let keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        if (value === 'favorite') keys.push(key);
    }
    return keys;
}

/* Fetch callback functions */

/**
 * Function for the first part of fetching data, parses to JSON before handing to the data callback.
 * @param {*} response Response data from fetching nzbird.json.
 * @returns nzbird.json data parsed to json.
 */
function searchResponseCallback(response) {
    return response.json();
}

/**
 * Function for processing the JSON data to display it on the webpage.
 * @param {*} data Data parsed to JSON we want to process.
 */
function searchDataCallback(data) {
    let container = clearReturnContainer();

    if (orderVal === "Conservation Status" && statusVal === "All") { // Sorting by conservation status when all conservations statuses are valid to appear.
        for (let status of statuses) { // Iterate through each status and search for applicable elements
            for (let element of data) {
                if (isNameSearched(element) && element.status === status) {
                    buildInfobox(container, element);
                }
            }
        }
    } else { // Default scenario for alphabetical sorting or if only one conservation status is valid to appear
        for (let element of data) {
            if (isNameSearched(element) && isStatusSearched(element)) {
                buildInfobox(container, element);
            }
        }
    }
}

/**
 * Function for processing the JSON data to display favourites on the webpage.
 * @param {*} data Data parsed to JSON we want to process.
 */
function faveDataCallback(data) {
    let container = clearReturnContainer();

    let keysToShow = getFaveKeys();
    keysToShow.sort(); // Sort array so favourites displayed alphabetically

    for (let element of data) { // Iterate through and show all birds included in favourites array
        if (keysToShow.includes(element.common_name)) {
            buildInfobox(container, element);
        }
    }
}

/**
 * Function for when fetching JSON data fails, displays an error message for debugging purposes.
 * @param {*} error Error data from fetching nzbird.json.
 */
function searchErrorCallback(error) {
    alert("Bird data could not be retrieved. Please try again.\nError: " + error);
}

/* Event handlers */

/**
 * Function for handling when the search button is pressed, preventing refresh, grabbing information on the parameters in the form and passing them to a querying function.
 * @param {*} eventData Data from pressing the search button.
 */
function searchEventHandler(eventData) {
    // Necessary to prevent button from refreshing the page
    eventData.preventDefault();

    // Query the other elements in the form so we have the relevant data for our search
    let textRef = document.querySelector('#search-text');
    let statusRef = document.querySelector('#search-status');
    let orderRef = document.querySelector('#search-order');

    // Update relevant variables to match new data
    textVal = textRef.value;
    statusVal = statusRef.value;
    orderVal = orderRef.value;

    fetch("nzbird.json") // fetch data from API
        .then(searchResponseCallback) // parse to JSON
        .then(searchDataCallback) // use the data
        .catch(searchErrorCallback); // error handling
}

/**
 * Function for handling when the theme button is pressed, swapping the colour scheme of the website.
 * @param {*} eventData Data from pressing the theme button.
 */
function themeEventHandler(eventData) {
    if (blue) { // Switch from blue theme to red theme
        blue = false;

        const elements1 = document.querySelectorAll('.blue-1'); // Replaces blue-1 with red-1
        for (const element of elements1) {
            element.classList.remove('blue-1');
            element.classList.add('red-1');
        }

        const elements2 = document.querySelectorAll('.blue-2'); // Replaces blue-2 with red-2
        for (const element of elements2) {
            element.classList.remove('blue-2');
            element.classList.add('red-2');
        }

        const elements3 = document.querySelectorAll('.blue-3'); // Replaces blue-3 with red-3
        for (const element of elements3) {
            element.classList.remove('blue-3');
            element.classList.add('red-3');
        }
    } else { // Switch from red theme to blue theme
        blue = true;

        const elements1 = document.querySelectorAll('.red-1'); // Replaces red-1 with blue-1
        for (const element of elements1) {
            element.classList.remove('red-1');
            element.classList.add('blue-1');
        }

        const elements2 = document.querySelectorAll('.red-2'); // Replaces red-2 with blue-2
        for (const element of elements2) {
            element.classList.remove('red-2');
            element.classList.add('blue-2');
        }

        const elements3 = document.querySelectorAll('.red-3'); // Replaces red-3 with blue-3
        for (const element of elements3) {
            element.classList.remove('red-3');
            element.classList.add('blue-3');
        }
    }
}

/**
 * Function for handling when the favourite/unfavourite button is pressed, adding or removing a bird from favourites in local storage.
 * @param {*} eventData Data from pressing the favourite/unfavourite button.
 */
function faveEventHandler(eventData) {
    // We can reuse the response and error callbacks but we must change what is done with the data
    fetch("nzbird.json") // fetch data from API
        .then(searchResponseCallback) // parse to JSON
        .then(faveDataCallback) // use the data
        .catch(searchErrorCallback); // error handling
}

/**
 * Iterates through local storage, putting every key that is a fave in an array and then removing them all.
 * @param {*} eventData Data from pressing the clear favourites button.
 */
function clearFavesEventHandler(eventData) {
    let keysToRemove = getFaveKeys();
    for (let key of keysToRemove) {
        localStorage.removeItem(key);
    }
    for (let button of document.querySelectorAll('#fave-bird-button')) { // Set all button names and hover text to now be for favouriting
        button.value = fave;
        button.target = faveMsg;
    }
}

/**
 * Adds or removes the bird corresponding with this button to or from the favourites in local storage.
 * @param {*} eventData Data from pressing the favourite button.
 */
function faveBirdEventHandler(eventData) {
    let birdName = eventData.target.parentElement.querySelector("#info-header").textContent;
    if (getFaveKeys().includes(birdName)) { // If bird favourited, remove from favourites and change button name/hover text
        localStorage.removeItem(birdName);
        eventData.target.value = fave;
        eventData.target.title = faveMsg;
    } else { // If bird not favourited, add to favourites and change button name/hover text
        localStorage.setItem(birdName, 'favorite');
        eventData.target.value = unfave;
        eventData.target.title = unfaveMsg;
    }
}

/* Event listeners */

let searchButton = document.querySelector('#search-button');
searchButton.addEventListener('click', searchEventHandler);

let themeButton = document.querySelector('#theme-button');
themeButton.addEventListener('click', themeEventHandler);

let faveButton = document.querySelector('#fave-button');
faveButton.addEventListener('click', faveEventHandler);

let clearFavesButton = document.querySelector('#clear-faves-button');
clearFavesButton.addEventListener('click', clearFavesEventHandler);