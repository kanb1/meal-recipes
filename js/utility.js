"use strict";
// Each function in utility.js has a specific role in handling form validation, user management, and error handling.

// getUserFavorites: Retrieves the current user's list of favorite recipes from localStorage.
function getUserFavorites() {
  const userData = sessionStorage.getItem("userLogged");

  const favorites = localStorage.getItem(userData + "_favorites");

  return favorites ? JSON.parse(favorites) : [];
}

// toggleUserFavorite: Adds or removes a recipe from the user's list of favorites and updates the icon's visual state to reflect the change.

function toggleUserFavorite(recipeId, heartIcon) {
  let favorites = getUserFavorites();
  if (favorites.includes(recipeId)) {
    favorites = favorites.filter((fav) => fav !== recipeId);
    heartIcon.classList.remove("fas");
    heartIcon.classList.add("far");
  } else {
    favorites.push(recipeId);
    heartIcon.classList.remove("far");
    heartIcon.classList.add("fas");
  }
  const userData = sessionStorage.getItem("userLogged");
  localStorage.setItem(userData + "_favorites", JSON.stringify(favorites));
}

// Existing functions
const user_db = "http://localhost:3001/users";

// This function is used to apply or remove error styles to form inputs based on their validity. --> Used in signup
function setErrorStyles(input, message, icon, messageText, isValid) {
  if (!isValid) {
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
function validateEmail(emailInput) {
  const emailErrorIcon = document.querySelector("#error_icon_email");
  const emailErrorMssg = document.querySelector("#error_message_email");

  const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
  const emailValue = emailInput.value;

  // Tests the email input against the regex to check its validity.
  const isValid = emailRegex.test(emailValue);
  setErrorStyles(
    emailInput,
    emailErrorMssg,
    emailErrorIcon,
    "Please enter a valid email",
    isValid
  );

  return isValid;
}

function validatePassword(passwordInput) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,20}$/;

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
  setErrorStyles(
    passwordInput,
    passwordErrorMssg,
    passwordErrorIcon,
    message,
    isValid
  );

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

  setErrorStyles(
    passwordInputConfirm,
    passwordErrorMssg,
    passwordErrorIcon,
    "Passwords do not match",
    isValid
  );

  return isValid;
}

// Checks if the email already exist in the database
async function checkExistingEmail(email) {
  try {
    const response = await fetch(user_db);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    // Parses the response to JSON format to get the list of users.
    const users = await response.json();
    // Uses the some method to check if any user in the list has the same email.
    return users.some((user) => user.email === email);
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

// This function checks if a combination of email and password matches an existing user in the database.
async function checkUserCredentials(email, password) {
  try {
    const response = await fetch(user_db);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    // Parses the response to JSON format to get the list of users.
    const users = await response.json();
    // Uses the some method to check if any user in the list has the same email and password.
    return users.some(
      (user) => user.email === email && user.password === password
    );
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Adding the new user failed");
  }
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
  toggleUserFavorite,
};
