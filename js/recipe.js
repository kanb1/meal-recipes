'use strict';
const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";
 
// This function retrieves the value of a specified parameter from the URL's query string.
function getUrlParameter(name) {
    // Escapes square brackets in the parameter name to ensure it works correctly in the regular expression
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    // Creates a regular expression to match the parameter in the query string
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    // Executes the regular expression on the URL's query string to find the parameter.
    const results = regex.exec(location.search);
    // Returns the decoded parameter value if found; otherwise, returns an empty string.
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
 
async function fetchData(url) {
    try {
        const response = await fetch(BASE_URL + url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
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
    const template = document.querySelector('template');
    // Selects the section where the meal details will be displayed.
    const section = document.querySelector('#meal-details');
    section.innerHTML = ''; // Clear previous content
    
    //  Creates a deep clone of the template's content.
    // The reason for using a deep clone (true as the second argument to document.importNode) is to ensure that the entire structure and content defined within the <template> element, including all its child elements and text nodes, are copied when we create a new instance
    const clone = document.importNode(template.content, true);
 
    clone.querySelector('.title').textContent = meal.strMeal;
    clone.querySelector('.img').src = meal.strMealThumb;
    clone.querySelector('.category').textContent = `Category: ${meal.strCategory}`;
    clone.querySelector('.cuisine').textContent = `Area: ${meal.strArea}`;
    
    // Splits the meal's instructions into steps and filters out empty steps.
    const steps = meal.strInstructions.split('\n').filter(step => step.trim() !== '');
    // Selects the steps list element in the cloned template.
    const stepsList = clone.querySelector('.steps');
    // Iterates over each instruction step.
    steps.forEach(step => {
        //  Creates a new list item element.
        const li = document.createElement('li');
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
    const breadcrumbs = document.getElementById('breadcrumbs');
    breadcrumbs.innerHTML = ''; // Clear previous breadcrumbs
    // This line creates a new <a> (anchor) element using document.createElement. This element will be used to create a clickable link to the home page or 'All Recipes' page.
    const homeLink = document.createElement('a');
    // This sets the href attribute of the anchor element to 'allrecipes.html', which is the URL the link will navigate to when clicked.
    homeLink.href = 'allrecipes.html'; 
    // This sets the text content of the anchor element to 'Meals'. This text will be visible to the user as the link label.
    homeLink.textContent = 'Meals';
    breadcrumbs.appendChild(homeLink);
    // This line creates a text node containing the separator ' > '. A text node is a part of the DOM that contains text but does not have any HTML elements. This separator visually divides breadcrumb links.
    const separator1 = document.createTextNode(' > ');
    // This line appends the separator text node to the breadcrumbs container, placing it after the 'Meals' link.
    breadcrumbs.appendChild(separator1);
    
    // This line creates a new <a> (anchor) element for the category link. This will represent the category of the current recipe.
    const categoryLink = document.createElement('a');
    // This sets the href` attribute of the anchor element to a URL that includes the recipe's category. This link will navigate to a page displaying all recipes in the specified category.
    categoryLink.href = `meals.html?category=${meal.strCategory}`; // Link to category page
    // This sets the text content of the anchor element to the recipe's category name. This text will be visible as the link label.
    categoryLink.textContent = meal.strCategory;
    breadcrumbs.appendChild(categoryLink);
 
    const separator2 = document.createTextNode(' > ');
    breadcrumbs.appendChild(separator2);
    // This line creates a new <span> element. Unlike an anchor element, a <span> is typically used to contain text without making it clickable. This span will display the current recipe's name.
    const mealLink = document.createElement('span');
    mealLink.textContent = meal.strMeal;
    breadcrumbs.appendChild(mealLink);
}
// *********************************
 
// This function is designed to automatically fetch and display the details of a meal when the recipe.html page loads, using the mealId parameter from the URL.
// t fetches the mealId from the URL and uses it to call fetchAndDisplayMealDetails, which retrieves and displays the meal details on the page.
document.addEventListener('DOMContentLoaded', () => {
    // This line calls the getUrlParameter function, passing 'mealId' as the parameter name we want to retrieve from the URL.
    // To extract the mealId parameter from the query string of the current URL. For example, if the URL is recipe.html?mealId=52772, this function will extract 52772.
    const mealId = getUrlParameter('mealId');
    // If the URL is recipe.html?mealId=52772, this function will fetch and display the meal with ID 52772.
    if (mealId) {
        fetchAndDisplayMealDetails(mealId);
    }
});
 
// This function is meant to dynamically fetch and display meal details when a user clicks on any element with the meal-link class. - But we don't have any meal-link class
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('meal-link')) {
        const mealId = event.target.dataset.mealId;
        await fetchAndDisplayMealDetails(mealId);
    }
});
 