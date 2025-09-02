"use strict";

//importing the neccesary functions from utility.js
// which will be used to verify the user's email and password against stored data
import {
  validateEmail,
  validatePassword,
  checkUserCredentials,
} from "./utility.js";

//const for the form and the input fields
const form = document.getElementById("login_form");
const emailInput = form.elements.email;
const passwordInput = form.elements.password;

//clearing the inputfield for email
emailInput.value = "";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  //for accessing the general error messages and icons (from login html)
  const generalErrorIcon = document.querySelector("#error_icon_general");
  const generalErrorMssg = document.querySelector("#error_message_general");

  try {
    const emailValid = validateEmail(emailInput);
    const passwordValid = validatePassword(passwordInput);

    if (!emailValid) {
      throw new Error("Email not valid.");
    }
    if (!passwordValid) {
      throw new Error("Password not valid.");
    }

    const emailValue = emailInput.value;
    console.log(emailValue);
    const passwordValue = passwordInput.value;

    const userValid = await checkUserCredentials(emailValue, passwordValue);

    if (userValid) {
      console.log("Login successful");

      //removing the general error message
      generalErrorIcon.classList.add("hidden");
      generalErrorMssg.classList.add("hidden");

      sessionStorage.setItem("userLogged", emailValue);

      window.location.href = "index.html";
    } else {
      //showing the general error message (abput email not matching)
      generalErrorIcon.classList.remove("hidden");
      generalErrorMssg.classList.remove("hidden");

      //throws error
      throw new Error("Invalid email or password.");
    }
  } catch (error) {
    console.error(error.message);
  }
});

// adds event listeners to the email and password input fields to validate their contents

// This variable will be used to track whether the blur event has occurred on the email input field. Initially, it is set to false because the user has not yet interacted with the input field.
let emailBlurOccurred = false;

//********* */ This event is triggered when the input field loses focus (i.e., when the user clicks outside of the input field or tabs to another element).
// Adds an event listener to the emailInput element that listens for the blur event.
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
