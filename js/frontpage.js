'use strict';

import { getUserFavorites, toggleUserFavorite } from './utility.js';

/****************************************  FETCH DATA FROM API TO BROWSE BY CATEGORY CARDS ************************************************/

const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

// fetch the data from an API
// This is an asynchronous function that takes an endpoint URL, fetches data from the API, and returns the parsed JSON data. The await keyword is used to pause the function execution until the fetch request completes.
async function fetchData(url) {
    try {
        const response = await fetch(BASE_URL + url);
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error:', error);
    }
}

// function to fetch a random meal
// by calling fetchData with the 'random.php' endpoint. It returns the first meal from the resulting array.
// is a more general-purpose function specifically to get a random meal. It can be reused elsewhere in your application where you need a random meal.
async function fetchRandomMeal() {
    const meals = await fetchData('random.php');
    // Return the first meal found in the array
    return meals[0];  
}

// on the other hand, is designed for a specific purpose: to fetch a random meal for the front page. This allows for future modifications specific to the front page without altering the fetchRandomMeal function. 
// For example I can make different catching errors specifically for the frontpage one
// Function to fetch random meal for the frontpage, meals for the front page
async function fetchMealFrontpage() {
    try {
        const meal = await fetchRandomMeal();
        return meal;
    } catch (error) {
        console.error('Error:', error);
    }
}




// Fetch multiple meals and display them
// This line creates an array of six promises, each fetching a meal for the front page.
const promises = Array.from({ length: 6 }, () => fetchMealFrontpage());

// Use Promise.all to fetch all the meals using more API calls
// This waits for all promises to resolve, then processes the array of meal data.
Promise.all(promises)
    .then(meals => {
        // This selects the container in the HTML where meal cards will be appended.
        const mealContainer = document.querySelector('#meal_container');
        // This selects the HTML template for a meal card.
        const templateCard = document.querySelector('#template_card');

        if (!mealContainer || !templateCard) {
            console.error('meal_container or template_card not found');
            return;
        }

        // This loop iterates over each meal in the array.
        meals.forEach(meal => {

            // This clones the template card for each meal.
            const cardClone = templateCard.content.cloneNode(true);

            // This selects elements within the cloned card to populate with meal data. (the template in our html)
            const cardImg = cardClone.querySelector('.card_img');
            const cardTitle = cardClone.querySelector('.card_title');
            const cardCategory = cardClone.querySelector('.card_category');
            const cardArea = cardClone.querySelector('.card_area');
            const youtubeLink = cardClone.querySelector('.card_youtube');
            const categoryIcon = cardClone.querySelector('.card_category_icon span');
            const favIcon = cardClone.querySelector('.btn_fav');

            // Ensure all elements were found in the cloned card
            if (!cardImg || !cardTitle || !cardCategory || !cardArea || !youtubeLink || !categoryIcon || !favIcon) {
                console.error('One or more elements not found in the cloned template card');
                return;
            }

            // Populate the cloned card with meal data
            cardImg.src = meal.strMealThumb;
            cardTitle.textContent = meal.strMeal;
            cardCategory.textContent = meal.strCategory;
            cardArea.textContent = "Cuisine: " + meal.strArea;
            youtubeLink.href = meal.strYoutube;
            youtubeLink.textContent = 'Watch on YouTube';
            categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
            favIcon.setAttribute('data-id', meal.idMeal);

            // For each meal, it checks if the meal ID is in the list of user favorites (using getUserFavorites).
            const favourites = getUserFavorites();
            if (favourites.includes(meal.idMeal)) {
                favIcon.classList.add('fas');
                favIcon.classList.remove('far');
            } else {
                favIcon.classList.add('far');
                favIcon.classList.remove('fas');
            }

            //This appends the fully populated card to the meal container in the HTML.
            mealContainer.appendChild(cardClone);
        });
        //Add event listeners to the favorite icons
        addFavouriteListeners();
    })
    .catch(error => console.error('Error:', error));

/****************************************  SEARCH BAR FUNCTIONALITY (fetching a meal by name lamb etc) ************************************************/
// This selects the search input field.
const searchInput = document.querySelector('#search_input');
// This selects the search button.
const searchButton = document.querySelector('#search_button');
// This selects the container for displaying the "Meal of the Day".
const section = document.querySelector('#meal_of_the_day_container');
// This selects the template for meal cards.
const cardContainer = document.querySelector('#section_1_card');
// This selects the heading element for "Meal of the Day".
const heading = document.querySelector('#meal_of_th_day');

// Add event listener to the search button
// When clicked, it prevents the default form submission and proceeds to fetch meals based on the search term.
searchButton.addEventListener('click', async function (e) {
    e.preventDefault();
    //This retrieves the user's search term.
    const searchTerm = searchInput.value;
    //  This fetches meal data based on the search term.
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    // This parses the response into JSON.
    const data = await response.json();

    // This checks if no meals were found and displays a message
    if (data.meals === null) {
        section.textContent = 'No meals found. Try to search for a name of the meal or a meal ingredient.';
        return;
    }

    //Clear previous search results
    section.innerHTML = '';
    // // Update heading
    heading.textContent = 'Meals you can try:';

    // This processes the first six meals from the search results.
    data.meals.slice(0, 6).forEach(meal => {
        // This clones the card template for each meal.
        const card = cardContainer.content.cloneNode(true);
        //These lines populate the card with meal data.
        const img = card.querySelector('.card_img');
        const title = card.querySelector('.card_title');
        const description = card.querySelector('.card_description');
        const categoryIcon = card.querySelector('.card_category_icon span');
        const category = card.querySelector('.card_category');
        const favIcon = card.querySelector('.btn_fav i');

        if (!img || !title || !description || !categoryIcon || !category || !favIcon) {
            console.error('One or more elements not found in the cloned search card template');
            return;
        }

        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;
        title.textContent = meal.strMeal;
        description.textContent = meal.strInstructions;
        // // First letter of the category
        categoryIcon.textContent = meal.strCategory.charAt(0);
        category.textContent = meal.strCategory;
        favIcon.setAttribute('data-id', meal.idMeal);

        //This condition checks if the current meal is in the user's favorites and updates the favorite icon accordingly.
        const favourites = getUserFavorites();
        if (favourites.includes(meal.idMeal)) {
            favIcon.classList.add('fas');
            favIcon.classList.remove('far');
        } else {
            favIcon.classList.add('far');
            favIcon.classList.remove('fas');
        }
        
        // Get the image in the cloned template
        const card_img = card.querySelector('.card_img');
        
        // If img exists, add an event listener and send the id with
        if (card_img) {
            card_img.addEventListener('click', function() {
                window.location.href = `recipe.html?id=${meal.idMeal}`;
            });
        }
        // This appends the populated card to the container.
            section.appendChild(card);
        });
    // This function adds event listeners to the favorite icons for toggling favorites.
    addFavouriteListeners();
});

/****************************************  FETCH RANDOM MEAL FOR MEAL OF THE DAY CARD ************************************************/
// This function fetches a random meal and displays it as the "Meal of the Day".
async function mealOfTheDay() {
    // This fetches a random meal.
    const meal = await fetchRandomMeal();

    // This selects the card template.
    const cardTemplate = document.querySelector('#section_1_card');
    if (!cardTemplate) {
        console.error('section_1_card template not found');
        return;
    }
    // This clones the template for the meal card.
    const card = cardTemplate.content.cloneNode(true);
    
    // These lines populate the card with meal data.
    const img = card.querySelector('.card_img');
    const title = card.querySelector('.card_title');
    const description = card.querySelector('.card_description');
    const favIcon = card.querySelector('.btn_fav i');
    const categoryIcon = card.querySelector('.card_category_icon span');
    const category = card.querySelector('.card_category');
    
    if (!img || !title || !description || !favIcon || !categoryIcon || !category) {
        console.error('One or more elements not found in the cloned card template');
        return;
    }
    
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    title.textContent = meal.strMeal;
    description.textContent = meal.strInstructions;
    favIcon.setAttribute('data-id', meal.idMeal);
    categoryIcon.textContent = meal.strCategory.charAt(0);
    category.textContent = meal.strCategory;
    
    const favourites = getUserFavorites();
    if (favourites.includes(meal.idMeal)) {
        favIcon.classList.add('fas');
        favIcon.classList.remove('far');
    } else {
        favIcon.classList.add('far');
        favIcon.classList.remove('fas');
    }

    const mealOfTheDayContainer = document.querySelector('#meal_of_the_day_container');
    if (!mealOfTheDayContainer) {
        console.error('meal_of_the_day_container not found');
        return;
    }

    // Get the image in the cloned template
    const card_img = card.querySelector('.card_img');
    
    // This if statement checks if the card_img element exists in the cloned template. It ensures that we only add an event listener to the image if it is actually present in the template. This prevents errors in case the element is not found.
    if (card_img) {
        // This line attaches a click event listener to the card_img element. When the user clicks on the meal's image:
        card_img.addEventListener('click', function() {
            // The function changes the current page to recipe.html and passes the id of the meal in the URL query string (?id=meal.idMeal).
            // This effectively redirects the user to a detailed view page for the specific meal, identified by meal.idMeal. The new page (recipe.html) can use the id from the URL to fetch and display detailed information about the clicked meal.
            window.location.href = `recipe.html?id=${meal.idMeal}`;
        });
    }
    
    addFavouriteListeners();
    mealOfTheDayContainer.appendChild(card);
}

mealOfTheDay();

/* ------------- CAROUSEL CODE ---------------- */
// This initializes an empty array to store carousel meal data
let carouselMeals = [];
// This selects the carousel card template.
const carouselTemplate = document.getElementById('carousel_card_template');
// This selects the container where carousel cards will be displayed.
const destination = document.querySelector(".recipes_carousel");
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
// This initializes the current index for carousel navigation.
let currentIndex = 0;

// This function fetches a random meal and adds it to the carouselMeals array.
async function fetchMealCarousel() {
    try {
        const meal = await fetchRandomMeal();
        carouselMeals.push(meal);
    } catch (error) {
        console.error('Error:', error);
    }
}

// This creates an array of eight promises, each fetching a meal for the carousel.
const mypromises = Array.from({ length: 8 }, () => fetchMealCarousel());

// This waits for all promises to resolve, then calls updateCards to update the carousel.
Promise.all(mypromises)
    .then(() => {
        updateCards();
    });

// This function updates the carousel with the current set of meals.
function updateCards() {
    // This clears previous carousel content.
    destination.innerHTML = '';
    // This determines the number of cards to display based on screen size.
    const amountOfCards = responsiveCardAmount();

    // This loop populates the carousel with the appropriate number of cards.
    for (let i = currentIndex; i < currentIndex + amountOfCards; i++) {
        // This calculates the correct index in the carouselMeals array.
        const dataIndex = i >= carouselMeals.length ? i - carouselMeals.length : i;

        // This clones the carousel card template.
        const cardClone = carouselTemplate.content.cloneNode(true);
        // These lines populate the cloned card with meal data.
        const cardImg = cardClone.querySelector('.carousel_card_img');
        const cardCategory = cardClone.querySelector('.card_category');
        const cardCategoryIcon = cardClone.querySelector('.card_category_icon span');
        const cardTitle = cardClone.querySelector('.card_title');
        const cardArea = cardClone.querySelector('.card_area');
        const favIcon = cardClone.querySelector('.btn_fav i');


        if (!cardImg) console.error('cardImg not found');
        if (!cardCategory) console.error('cardCategory not found');
        if (!cardCategoryIcon) console.error('cardCategoryIcon not found');
        if (!cardTitle) console.error('cardTitle not found');
        if (!cardArea) console.error('cardArea not found');
        if (!favIcon) console.error('favIcon not found');

        if (!cardImg || !cardCategory || !cardCategoryIcon || !cardTitle || !cardArea || !favIcon) {
            console.error('One or more elements not found in the cloned carousel card template');
        }

        
        cardImg.src = carouselMeals[dataIndex].strMealThumb;
        cardTitle.textContent = carouselMeals[dataIndex].strMeal;
        cardCategory.textContent = carouselMeals[dataIndex].strCategory;
        cardArea.textContent = `Cuisine: ${carouselMeals[dataIndex].strArea}`;
        cardCategoryIcon.textContent = carouselMeals[dataIndex].strCategory.charAt(0);
        favIcon.setAttribute('data-id', carouselMeals[dataIndex].idMeal);
        const favourites = getUserFavorites();
        if (favourites.includes(carouselMeals[dataIndex].idMeal)) {
            favIcon.classList.add('fas');
            favIcon.classList.remove('far');
        } else {
            favIcon.classList.add('far');
            favIcon.classList.remove('fas');
        }

        // Get the image in the cloned template
        const image_carousel_card = cardClone.querySelector('.carousel_card_img');
        
        // If cardImg exists, add an event listener and send the id with
        if (image_carousel_card) {
            image_carousel_card.addEventListener('click', function() {
                window.location.href = `recipe.html?id=${carouselMeals[dataIndex].idMeal}`;
            });
        }

        // This appends the populated card to the carousel container.
        destination.appendChild(cardClone);
    }
    addFavouriteListeners();
}

// This function determines the number of cards to display in the carousel based on the screen size.
function responsiveCardAmount() {
    let amountOfCards;
    if (window.innerWidth >= 1440) {
        amountOfCards = 4;
    } else if (window.innerWidth >= 1024) {
        amountOfCards = 3;
    } else if (window.innerWidth >= 768) {
        amountOfCards = 2;
    } else {
        amountOfCards = 1;
    }
    return amountOfCards;
}

// These lines create media query listeners for different screen sizes.
const bigLaptop = window.matchMedia("(min-width: 1440px)");
const laptop = window.matchMedia("(min-width: 1024px)");
const tablet = window.matchMedia("(min-width: 768px)");
const mobile = window.matchMedia("(max-width: 767px)");

// These lines attach the updateCards function to the media query listeners to update the carousel when the screen size changes.
bigLaptop.onchange = updateCards;
laptop.onchange = updateCards;
tablet.onchange = updateCards;
mobile.onchange = updateCards;

// This adds an event listener to the previous button to show the previous set of carousel cards.
prevButton.addEventListener('click', previousCard);
nextButton.addEventListener('click', nextCard);

// This function updates the carousel to show the previous set of cards.
function previousCard() {
    const lastIndex = carouselMeals.length - 1;
    currentIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    updateCards();
}

function nextCard() {
    const lastIndex = carouselMeals.length - 1;
    currentIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
    updateCards();
}

// This function adds click event listeners to all the favorite icons. When clicked, they toggle the meal's favorite status using the toggleUserFavorite function.
function addFavouriteListeners() {
    // This selects all favorite icons on the page.
    const hearts = document.querySelectorAll('.btn_fav i');
    // This loops through each heart icon.
    hearts.forEach(heart => {
        heart.addEventListener('click', () => {
            // This gets the meal ID from the data attribute.
            const recipeId = heart.getAttribute('data-id');
            // This toggles the favorite status for the meal.
            if(sessionStorage.getItem("userLogged")){
                toggleUserFavorite(recipeId, heart);
            } else{
                alert("u have to login");
                window.location.href = ("../html/login.html");
            }
        });
    });
}
