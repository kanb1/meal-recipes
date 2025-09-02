"use strict";
 
//importing the neccesary functions from utility.js
// which will be used to verify the user's email and password against stored data
import {
    validateEmail,
    validatePassword,
    checkUserCredentials
} from './utility.js';
 
//const for the form and the input fields
const form = document.getElementById("login_form")
const emailInput = form.elements.email;
const passwordInput = form.elements.password;
 
 
 
//clearing the inputfield for email
emailInput.value = "";
 
 
  
// async means that it can pause it's execution while waiitng for a timeconsuimg operation to complete, like fetching data from the server
// event parameter is associated with the form submission, provides information about the event and methods to manipulate with it
form.addEventListener("submit", async function (event) {
        // Prevents the default form submission action to handle it with JavaScript instead.
    event.preventDefault();
 
    //for accessing the general error messages and icons (from login html)
    const generalErrorIcon = document.querySelector("#error_icon_general");
    const generalErrorMssg = document.querySelector("#error_message_general");
 
    try {
        //making sure to confirm validity of email and password upon submission as well
        //validation in backend is important to prevent "hacking" of the html form, eg. removing the required or patterns
        //this prevents the user from login in anyways, if their inputs are forcidly invalid
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
 
        // using await keyword, it checks if the provided email and password mathches the ones in our system by fetching data from our server
        //this prevents the user from login in with email or password that doesn't match the ones in our system
        // network request        
        const userValid = await checkUserCredentials(emailValue, passwordValue);
        
        // if user is valid, the user's email is stored in sessionStorage, and the page is redirected to the homepage (index.html).

        if (userValid) {
            console.log("Login successful");
 
            //removing the general error message
            generalErrorIcon.classList.add("hidden");
            generalErrorMssg.classList.add("hidden");
            // This line sets the email of the logged-in user in session storage under the key 'userLogged'. This helps in identifying the logged-in user across the application during the session.
            sessionStorage.setItem('userLogged', emailValue);
 
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
// The blur event is triggered when an element loses focus. Focus, in this context, refers to the element that is currently selected or active and is ready to receive input from the user. The blur event is a part of the HTML DOM (Document Object Model) events
// Form Validation: The blur event is commonly used for form validation. When a user finishes entering data into a field and moves to the next one, you can validate the input immediately and provide feedback without waiting for the form to be submitted

// Notice there is TWO eventlisteners for checking validity
// First I let the users finish typing and only check valdity on blur
// Thereafter I check validty on input so the error message dissapears AS SOON as the input is valid
// The goal is to provide immediate feedback to the user about the validity of their input.

// This variable will be used to track whether the blur event has occurred on the email input field. Initially, it is set to false because the user has not yet interacted with the input field.
let emailBlurOccurred = false;

//********* */ This event is triggered when the input field loses focus (i.e., when the user clicks outside of the input field or tabs to another element).
// Adds an event listener to the emailInput element that listens for the blur event. 
emailInput.addEventListener("blur", function () {
    // This check ensures that the email validation (validateEmail) only occurs the first time the blur event happens. This prevents repeated validation every time the field loses focus if it has already been validated once.
    //  If emailBlurOccurred is false, calls the validateEmail function, passing the emailInput element as an argument. This line is where the validation logic is invoked. validateEmail(emailInput) is the function call that actually performs the validation of the email input.
    if (!emailBlurOccurred) {
        validateEmail(emailInput);
        // Sets emailBlurOccurred to true to indicate that the blur event has occurred once, and subsequent blur events won't trigger the validateEmail function again.
        emailBlurOccurred = true;
    }
});

//******** */ The input event listener triggers every time the user types or modifies the content in the email input field. 
// After the initial validation triggered by the blur event, users may need real-time feedback on their changes. This listener continuously validates the input as the user types.
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
