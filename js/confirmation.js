'use strict';
document.addEventListener("DOMContentLoaded", function () {
    //checks if the user came from the signup page, by getting teh fromSigmup in session storage
    //this prevents the user from accesing the confirmation page (accidently or forcidly) - check signup.js
    //unless they were actually redirected from a successful signup!
    const fromSignup = sessionStorage.getItem('fromSignup');
 
    if (fromSignup !== 'true') {
        //if the user is not redirected from signup (after signing up), redirects to the signup page instead
        window.location.href = "signup.html";
    } else {
 
        document.getElementById('confirmation').classList.remove('hidden');
        //clears the sessionstorage after confirmed access
        sessionStorage.removeItem('fromSignup');
    }
});
