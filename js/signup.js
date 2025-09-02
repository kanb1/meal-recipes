"use strict";

//importing the neccesary functions from utility.js
import {
  setErrorStyles,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  checkExistingEmail,
  addUserToDatabase,
} from "./utility.js";

//accessing the form and input fields
const form = document.getElementById("signup_form");
const emailInput = form.elements.email;
const passwordInput = form.elements.password;
const passwordInputConfirm = form.elements.password_confirm;

//for accessing the error icon and message for email
const emailErrorIcon = document.querySelector("#error_icon_email");
const emailErrorMssg = document.querySelector("#error_message_email");

//clearing the inputfield for email
emailInput.value = "";

//handling form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    //validating email and passwords
    const emailValid = validateEmail(emailInput);
    const passwordValid = validatePassword(passwordInput);
    const passwordsMatch = validatePasswordMatch(
      passwordInput,
      passwordInputConfirm
    );

    if (!emailValid) {
      throw new Error("Email not valid.");
    }
    if (!passwordValid) {
      throw new Error("Password not valid.");
    }
    if (!passwordsMatch) {
      throw new Error("Passwords do not match.");
    }

    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;

    //checking if the user already exists
    const userExists = await checkExistingEmail(emailValue);

    //if user doesnt exist, add user to database, else set error styles and throw error
    if (!userExists) {
      //calling async function for adding the user to the JSON 'database'
      await addUserToDatabase(emailValue, passwordValue);

      // This line of code is used to store a flag ('fromSignup') in session storage to indicate that the user has just signed up. This can be used to confirm that the user was redirected to the confirmation page (signupconfirmation.html) directly after signing up.
      sessionStorage.setItem("fromSignup", "true");

      // Redirect to the confirmation page
      window.location.href = "signupconfirmation.html";
    } else {
      setErrorStyles(
        emailInput,
        emailErrorMssg,
        emailErrorIcon,
        "There is already an account with this email",
        false
      );
      throw new Error("There is already an account with this email.");
    }
  } catch (error) {
    console.error(error.message);
  }
});

// adds event listeners to the email and password input fields to validate their contents
let emailBlurOccurred = false;
emailInput.addEventListener("blur", function () {
  if (!emailBlurOccurred) {
    validateEmail(emailInput);
    emailBlurOccurred = true;
  }
});

emailInput.addEventListener("input", function () {
  if (emailBlurOccurred) {
    validateEmail(emailInput);
  }
});

let passwordBlurOccurred = false;
passwordInput.addEventListener("blur", function () {
  if (!passwordBlurOccurred) {
    validatePassword(passwordInput);
    passwordBlurOccurred = true;
  }
});

passwordInput.addEventListener("input", function () {
  if (passwordBlurOccurred) {
    validatePassword(passwordInput);
  }
});

passwordInputConfirm.addEventListener("input", function () {
  validatePasswordMatch(passwordInput, passwordInputConfirm);
});
passwordInputConfirm.addEventListener("focus", function () {
  validatePasswordMatch(passwordInput, passwordInputConfirm);
});
