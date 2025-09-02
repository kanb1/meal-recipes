"use strict";
// Each function in utility.js has a specific role in handling form validation, user management, and error handling. The combination of these functions allows your application to effectively manage user input validation, interact with a backend user database, and maintain a seamless user experience.




// getUserFavorites: Retrieves the current user's list of favorite recipes from localStorage.
function getUserFavorites() {
    // Retrieves the current user's identifier from sessionStorage. This identifier is used to differentiate between different users' data.
    const userData = sessionStorage.getItem("userLogged");
    // Fetches the user's favorites from localStorage, using a key that combines the user identifier with '_favorites'
    const favorites = localStorage.getItem(userData+'_favorites');
    // Parses the stored favorites (if any) from JSON format. If no favorites are found, it returns an empty array
    return favorites ? JSON.parse(favorites) : [];
}

// toggleUserFavorite: Adds or removes a recipe from the user's list of favorites and updates the icon's visual state to reflect the change.
// This function adds or removes a recipe from the user’s favorites. It updates the local storage to reflect the new state of the favorites list for the logged-in user.
function toggleUserFavorite(recipeId, heartIcon) {
    // the favourites of the user
    let favorites = getUserFavorites();
    // Checks if the recipeId is already in the favorites list. If it is, remove it. If not, add it.
    if (favorites.includes(recipeId)) {
        // Removes the recipeId from the favorites array.
        favorites = favorites.filter(fav => fav !== recipeId);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    } else {
        // Adds the recipeId to the favorites array.
        favorites.push(recipeId);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
    }
    // Retrieves the current user's identifier from sessionStorage.
    const userData = sessionStorage.getItem("userLogged");
    // Stores the updated favorites array in localStorage
    // _favourites
    localStorage.setItem(userData+'_favorites', JSON.stringify(favorites));
}




// Existing functions
const user_db = "http://localhost:3000/users";

// This function is used to apply or remove error styles to form inputs based on their validity. --> Used in signup
// the parameters are the input being validated, the element displaying the error message, the element displaying the error icon, the errormessage text to display, isValid a boolean to indicate if it's valid or not
function setErrorStyles(input, message, icon, messageText, isValid) {
    if (!isValid) {
        // styling of these in our login_singup.css
        input.classList.add("input_error");
        input.classList.remove("input_correct");
        message.classList.remove("hidden");
        icon.classList.remove("hidden");
        message.textContent = messageText;
    } else {
        input.classList.remove("input_error");
        input.classList.add("input_correct");
        message.classList.add("hidden");
        icon.classList.add("hidden");
    }
}

// This function validates an email input using a regular expression.
// wherever u use this, the emailinput is needed (for example getting it from a form) 
function validateEmail(emailInput) {
    // erroricon and erorrmessage used in login and signup
    const emailErrorIcon = document.querySelector("#error_icon_email");
    const emailErrorMssg = document.querySelector("#error_message_email");

    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
    const emailValue = emailInput.value;

    // Tests the email input against the regex to check its validity.
    const isValid = emailRegex.test(emailValue);
    setErrorStyles(emailInput, emailErrorMssg, emailErrorIcon, "Please enter a valid email", isValid);

    return isValid;
}

function validatePassword(passwordInput) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,20}$/;

    const passwordErrorIcon = document.querySelector("#error_icon_password");
    const passwordErrorMssg = document.querySelector("#error_message_password");
    
    // retrieves the value of the password input
    const passwordValue = passwordInput.value;

    // default errormessage
    let message = "Please enter valid password";

    // changing the errormessage based on password fails
    if (!/[a-z]/.test(passwordValue)) {
        message = "Must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(passwordValue)) {
        message = "Must contain at least one uppercase letter";
    } else if (!/\d/.test(passwordValue)) {
        message = "Must contain at least one number";
    } else if (!/[@$!%*?&#.]/.test(passwordValue)) {
        message = "Must contain at least one special character";
    } else if (passwordValue.length < 8) {
        message = "Must be at least 8 characters";
    } else if (passwordValue.length > 20) {
        message = "Must be less than 20 characters";
    }

    // test the password's validity
    const isValid = passwordRegex.test(passwordValue);
    // uses setErrorStyles to update the input stlying based on its validity
    setErrorStyles(passwordInput, passwordErrorMssg, passwordErrorIcon, message, isValid);

    // return if it's valid or not
    return isValid;
}

// Testing if the password matches
function validatePasswordMatch(passwordInput, passwordInputConfirm) {
    const passwordErrorIcon = document.querySelector("#error_icon_password2");
    const passwordErrorMssg = document.querySelector("#error_message_password2");

    const passwordValue1 = passwordInput.value;
    const passwordValue2 = passwordInputConfirm.value;
    const isValid = passwordValue1 === passwordValue2;

    setErrorStyles(passwordInputConfirm, passwordErrorMssg, passwordErrorIcon, "Passwords do not match", isValid);

    return isValid;
}

// Checks if the email already exist in the database
async function checkExistingEmail(email) {
    try {
        // Fetches the user database (user_db) to get the list of users.
        const response = await fetch(user_db);
        // Checks if the HTTP request was successful (response.ok).
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        // Parses the response to JSON format to get the list of users.
        const users = await response.json();
        // Uses the some method to check if any user in the list has the same email.
        // returns true if the email exists
        return users.some(user => user.email === email);
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// This function checks if a combination of email and password matches an existing user in the database.
async function checkUserCredentials(email, password) {
    try {
        // Fetches the user database (user_db) to get the list of users.
        const response = await fetch(user_db);
        // Checks if the HTTP request was successful (response.ok).
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        // Parses the response to JSON format to get the list of users.
        const users = await response.json();
        // Uses the some method to check if any user in the list has the same email and password.
        return users.some(user => user.email === email && user.password === password);
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

async function addUserToDatabase(email, password) {
    // Creates a new user object with the provided email and password.
    const user = {
        email: email,
        password: password,
    };

    // Sends a POST request to the user database (user_db) to add the new user.
    // Sets the request's headers to indicate that the request body is in JSON format.
    // Converts the user object to a JSON string and includes it in the request body.
    const response = await fetch(user_db, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("Adding the new user failed");
    }
    // Parses the response to JSON format, which could be used for further processing or logging.
    const data = await response.json();
}

export {
    setErrorStyles,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    checkExistingEmail,
    checkUserCredentials,
    addUserToDatabase,
    getUserFavorites,
    toggleUserFavorite
};
