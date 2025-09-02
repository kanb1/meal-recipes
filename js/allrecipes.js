// Enforces strict mode, which helps catch common coding mistakes and prevents certain unsafe actions.
"use strict";

//  A constant holding the base URL for the MealDB API, which will be used to construct full URLs for API requests.
const BASE_URL2 = "https://www.themealdb.com/api/json/v1/1/";

async function fetchData(url) {
  try {
    const response = await fetch(BASE_URL2 + url);
    const data = await response.json();
    // Returns the meals array from the parsed JSON data.
    return data.meals;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Fetches random meal(s).
async function fetchRandomMeal() {
  const meals = await fetchData("random.php");
  return meals[0]; // Return the first meal found in the array
}
/****************************************  GET ALL RECIPES ************************************************/

// fetches and displays a specified number of recipes, starting from a given index.
async function fetchAllRecipes(start, numMeals) {
  // Selects the container element where the recipes will be displayed.
  const allRecipesContainer = document.querySelector("#all_recipes_container");
  // Loops from the start index up to start + numMeals to fetch the specified number of meals.
  for (let i = start; i < start + numMeals; i++) {
    // Fetch a random meal
    const meal = await fetchRandomMeal();
    console.log(meal);

    // Clone the card template
    const cardTemplate = document.querySelector("#section_1_card").content;
    const card = cardTemplate.cloneNode(true);

    // Get the elements in the card
    const img = card.querySelector(".card_img");
    const title = card.querySelector(".card_title");
    const description = card.querySelector(".card_description");
    const categoryIcon = card.querySelector(".card_category_icon span");
    const category = card.querySelector(".card_category");

    // Set the properties of the elements
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;
    title.textContent = meal.strMeal;
    description.textContent = meal.strInstructions;
    categoryIcon.textContent = meal.strCategory.charAt(0); // First letter of the category
    category.textContent = meal.strCategory;

    // Get the card container in the cloned template
    const cardContainer = card.querySelector(".card_container");

    // Adds a click event listener to the card container that logs the meal ID, redirects to a detailed recipe page, and calls loadMealById with the meal ID.
    cardContainer.addEventListener("click", function () {
      console.log("clicked", meal.idMeal);
      // Redirects to recipe.html with the meal ID as a URL parameter.
      window.location.href = `recipe.html?id=${meal.idMeal}`;
      loadMealById(meal.idMeal);
    });

    // Append the card to the all recipes container
    allRecipesContainer.appendChild(card);
    console.log("fetching all recipes");
  }
}
/********************* LOAD MORE MEALS BUTTON ALL RECIPES ****************/
let numMealsLoaded = 6; // Initializes the number of meals to load at the start to 6.

// Calls fetchAllRecipes to load the initial set of 6 meals.
fetchAllRecipes(0, numMealsLoaded);

// Get the load more button
const loadMoreBtn = document.querySelector(".more_btn");

// Add an event listener to the button
loadMoreBtn.addEventListener("click", function () {
  fetchAllRecipes(numMealsLoaded, 2); // Fetch and display 2 new meals
  numMealsLoaded += 2; // Increase the number of meals by 2 each time u click the button
});

/****************************************  FILTER FUNCTIONALITY (filter by category) ************************************************/

// Selects the category filter dropdown.
const select = document.querySelector("#filter_btn");
// Selects the template for the recipe card.
const template = document.querySelector("#section_1_card");
// Selects the container where filtered meals will be displayed.
const container = document.querySelector("#meal_container");
// Selects the button used to load more filtered meals.
const moreBtn = document.querySelector("#more_btn_category");

//  Initializes the number of loaded meals to 0.
let mealsLoaded = 0;

// Set the default selected option to "Beef"
select.value = "Beef";

// fetches and displays a specified number of meals from a given category starting at a specific index.
async function fetchMealsByCategory(category, start, count) {
  console.log(
    `Fetching ${count} meals of category ${category} starting from ${start}`
  );
  // Fetches meals by category using the MealDB API and waits for the response.
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  // Parses the response as JSON
  const data = await response.json();
  // Clears the container if fetching from the beginning to avoid duplicate content.
  if (start === 0) {
    container.innerHTML = "";
  }
  // Slices the meals array to get the specified range of meals.
  const meals = data.meals.slice(start, start + count);

  // Maps each meal to a promise that fetches detailed meal data and creates a cloned card for each meal.
  const mealPromises = meals.map(async (meal) => {
    //  Fetches detailed meal data using the meal ID and waits for the response.
    const mealResponse = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
    );
    const mealData = await mealResponse.json();
    // Gets the detailed meal object from the response.
    const detailedMeal = mealData.meals[0];
    // Clones the card template.
    const clone = template.content.cloneNode(true);

    clone.querySelector(".card_img").src = detailedMeal.strMealThumb;
    clone.querySelector(".card_title").textContent = detailedMeal.strMeal;
    clone.querySelector(".card_category").textContent = category;
    clone.querySelector(".card_category_icon span").textContent =
      category.charAt(0);
    // Selects the card area element for the cuisine.
    const cardArea = clone.querySelector(".card_cuisine");
    const youtubeLink = clone.querySelector(".card_youtube");

    // If the card area element exists, set its text to the meal's area/cuisine.
    if (cardArea) {
      cardArea.textContent = "Cuisine: " + detailedMeal.strArea;
    }

    if (youtubeLink) {
      if (detailedMeal.strYoutube) {
        youtubeLink.href = detailedMeal.strYoutube;
        youtubeLink.textContent = "Watch on YouTube";
      } else {
        youtubeLink.textContent = "No YouTube guide available";
        youtubeLink.style.color = "red";
        youtubeLink.style.fontStyle = "italic";
      }
    }

    // Selects the card container element within the cloned card.
    const mealCard = clone.querySelector(".card_container");
    mealCard.addEventListener("click", function () {
      console.log("clicked", meal.idMeal);
      // Redirects to the recipe details page with the meal ID as a parameter.
      window.location.href = `recipe.html?id=${meal.idMeal}`;
    });
    return clone;
  });
  // Waits for all meal detail promises to resolve and returns the array of cloned cards.
  const clones = await Promise.all(mealPromises);
  // Appends each cloned card to the container.
  clones.forEach((clone) => container.appendChild(clone));
  // Increments the count of loaded meals by the number of meals fetched.
  mealsLoaded += count;
}

//Fetches and displays the initial 6 meals for the 'Beef' category.
fetchMealsByCategory("Beef", 0, 6);

// Add an event listener to the load more button
moreBtn.addEventListener("click", function () {
  console.log("Load more button clicked");
  // Fetches and displays 2 additional meals for the currently selected category.
  fetchMealsByCategory(select.value, mealsLoaded, 2);
});
// Adds a change event listener to the category dropdown.
select.addEventListener("change", function () {
  // Resets the count of loaded meals.
  numMealsLoaded = 0;
  // Fetches and displays the initial 6 meals for the newly selected category.
  fetchMealsByCategory(select.value, 0, 6);
});
