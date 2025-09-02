"use strict";
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

// This function retrieves the value of a specified parameter from the URL's query string.
function getUrlParameter(name) {
  // Escapes square brackets in the parameter name to ensure it works correctly in the regular expression
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  // Creates a regular expression to match the parameter in the query string
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  // Executes the regular expression on the URL's query string to find the parameter.
  const results = regex.exec(location.search);
  // Returns the decoded parameter value if found; otherwise, returns an empty string.
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

async function fetchData(url) {
  try {
    const response = await fetch(BASE_URL + url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// An asynchronous function that fetches details for a specific meal and displays them.
async function fetchAndDisplayMealDetails(mealId) {
  // Calls fetchData to get the meal data for the specified meal ID.
  const data = await fetchData(`lookup.php?i=${mealId}`);
  // Extracts the first (and usually only) meal from the returned data.
  const meal = data.meals[0];
  // IF MEAL exists, then display mealdetails
  if (meal) {
    displayMealDetails(meal);
    // doens't work
    updateBreadcrumbs(meal);
  }
}

function displayMealDetails(meal) {
  // Selects the template element for meal details.
  const template = document.querySelector("template");
  // Selects the section where the meal details will be displayed.
  const section = document.querySelector("#meal-details");
  section.innerHTML = ""; // Clear previous content

  const clone = document.importNode(template.content, true);

  clone.querySelector(".title").textContent = meal.strMeal;
  clone.querySelector(".img").src = meal.strMealThumb;
  clone.querySelector(
    ".category"
  ).textContent = `Category: ${meal.strCategory}`;
  clone.querySelector(".cuisine").textContent = `Area: ${meal.strArea}`;

  // Splits the meal's instructions into steps and filters out empty steps.
  const steps = meal.strInstructions
    .split("\n")
    .filter((step) => step.trim() !== "");
  // Selects the steps list element in the cloned template.
  const stepsList = clone.querySelector(".steps");
  // Iterates over each instruction step.
  steps.forEach((step) => {
    //  Creates a new list item element.
    const li = document.createElement("li");
    // Sets the list item's text to the current step.
    li.textContent = step;
    // Appends the list item to the steps list.
    stepsList.appendChild(li);
  });

  section.appendChild(clone);
}

// ********************************* DOESN'T WORK
// The meal parameter represents an object containing details of the current recipe.
function updateBreadcrumbs(meal) {
  const breadcrumbs = document.getElementById("breadcrumbs");
  breadcrumbs.innerHTML = "";

  const homeLink = document.createElement("a");

  homeLink.href = "allrecipes.html";

  homeLink.textContent = "Meals";
  breadcrumbs.appendChild(homeLink);

  const separator1 = document.createTextNode(" > ");

  breadcrumbs.appendChild(separator1);

  const categoryLink = document.createElement("a");

  categoryLink.href = `meals.html?category=${meal.strCategory}`; // Link to category page

  categoryLink.textContent = meal.strCategory;
  breadcrumbs.appendChild(categoryLink);

  const separator2 = document.createTextNode(" > ");
  breadcrumbs.appendChild(separator2);

  const mealLink = document.createElement("span");
  mealLink.textContent = meal.strMeal;
  breadcrumbs.appendChild(mealLink);
}
// *********************************

// This function is designed to automatically fetch and display the details of a meal when the recipe.html page loads, using the mealId parameter from the URL.
document.addEventListener("DOMContentLoaded", () => {
  const mealId = getUrlParameter("mealId");

  if (mealId) {
    fetchAndDisplayMealDetails(mealId);
  }
});

// This function is meant to dynamically fetch and display meal details when a user clicks on any element with the meal-link class. - But we don't have any meal-link class
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("meal-link")) {
    const mealId = event.target.dataset.mealId;
    await fetchAndDisplayMealDetails(mealId);
  }
});
