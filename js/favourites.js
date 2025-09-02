// This directive enables strict mode, which helps catch common coding errors and "unsafe" actions such as defining global variables
'use strict';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
// Selects the HTML element with the ID favourites and assigns it to the variable favouritesSection, where the favorite recipes will be displayed - (in the favourites.html)
const favouritesSection = document.getElementById('favourites');

// Fetch favorite recipes from localStorage and display them
async function fetchFavouriteRecipes() {
    const userData = sessionStorage.getItem("userLogged");
    const favourites = JSON.parse(localStorage.getItem(userData+'_favorites')) || [];
    // Checks if the favorites array is empty.
    if (favourites.length === 0) {
        favouritesSection.innerHTML = '<p>No favourite recipes found.</p>';
        // Exits the function early if there are no favorite recipes.
        return;
    }

    // Initializes an empty array to hold the fetched favorite recipes.
    const favouriteRecipes = [];
    // Iterates over each recipe ID in the favorites array.
    for (const recipeId of favourites) {
        // Fetches the recipe data from the API for each favorite recipe ID.
        const response = await fetch(API_BASE_URL + 'lookup.php?i=' + recipeId);
        // Parses the JSON response from the API
        const data = await response.json();
        // Adds the fetched recipe data to the favouriteRecipes array.
        favouriteRecipes.push(data.meals[0]);
    }
    //  Calls the displayRecipes function to display the fetched favorite recipes.
    // // favouriteRecipes is passed to displayRecipes here. ("recipes" in displayRecipes)
    displayRecipes(favouriteRecipes);
}



// Display recipes in the favourites section
function displayRecipes(recipes) {
    favouritesSection.innerHTML = ''; // Clear previous results
    // Checks if the recipes array is not empty
    if (recipes && recipes.length > 0) {
        // Iterates over each recipe in the recipes array.
        recipes.forEach(recipe => {
            // Creates a new div element to represent a recipe card.
            const recipeCard = document.createElement('div');
            // Adds the class recipe-card to the div
            recipeCard.classList.add('recipe-card');
            // Sets the inner HTML of the recipeCard` to include the recipe image, title, a short description, and a favorite button.
            recipeCard.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <p>${recipe.strInstructions.substring(0, 100)}...</p>
                <button class="btn_fav">
                    <i class="fas fa-heart" data-id="${recipe.idMeal}"></i>
                </button>
            `;

            recipeCard.addEventListener("click", () =>{
                window.location.href = `recipe.html?mealId=${recipe.idMeal}`;


            });

            // Appends the recipeCard to the favouritesSection.
            favouritesSection.appendChild(recipeCard);
        });
        // Calls addFavouriteListeners to add click event listeners to the favorite buttons. 
        addFavouriteListeners();
    } else {
        favouritesSection.innerHTML = '<p>No favourite recipes found.</p>';
    }
}

// Add event listeners to heart icons in the favourites section
function addFavouriteListeners() {
    // Selects all heart icons inside the favorite buttons.
    const hearts = document.querySelectorAll('.btn_fav > i');
    // Iterates over each heart icon.
    hearts.forEach(heart => {
        // Adds a click event listener to each heart icon.
        heart.addEventListener('click', () => {
            // Retrieves the data-id attribute (recipe ID) from the clicked heart icon.
            const recipeId = heart.getAttribute('data-id');
            // Calls the toggleFavourite function to toggle the favorite status of the recipe.
            toggleFavourite(recipeId, heart);
            // Checks if the heart icon no longer has the fas class (i.e., it's no longer a favorite).
            if (!heart.classList.contains('fas')) {
                // Removes the entire recipe card from the DOM if it is unfavorited.
                heart.parentElement.parentElement.remove();
                // Checks if there are no more child elements in the favouritesSection.
                if (favouritesSection.childElementCount === 0) {
                    favouritesSection.innerHTML = '<p>No favourite recipes found.</p>';
                }
            }
        });
    });
}

// Toggle favorite status and store in localStorage
function toggleFavourite(recipeId, heart) {
    // Retrieves the currently logged-in user's identifier from sessionStorage.
    const userData1 = sessionStorage.getItem("userLogged");
    // Fetches the user's favorites from localStorage and parses them into an array. If no favorites are found, it defaults to an empty array.
    let favourites = JSON.parse(localStorage.getItem(userData1+'_favorites')) || [];
    // Checks if the recipeId is already in the favorites array.
    if (favourites.includes(recipeId)) {
        // If it is, removes the recipeId from the favorites array.
        favourites = favourites.filter(id => id !== recipeId);
        heart.classList.remove('fas');
        heart.classList.add('far');
    } else {
        favourites.push(recipeId);
        heart.classList.remove('far');
        heart.classList.add('fas');
    }
    const userData = sessionStorage.getItem("userLogged");
    // Stores the updated favorites array back to localStorage under the key <user_id>_favorites.
    localStorage.setItem(userData+'_favorites', JSON.stringify(favourites));
}

// Initial fetch of favourite recipes
fetchFavouriteRecipes();
