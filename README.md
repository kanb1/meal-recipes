# Meal Recipes

A small frontend project built with **HTML, CSS, and Vanilla JavaScript**.  
The project has been extended with a simple login functionality via **json-server**, allowing users to log in with mock accounts and save favorites in localStorage.

---

## Features

- **Login & Signup** with a mock database (`json-server`)
- **Favorites** saved per user in localStorage
- Multiple static pages (recipes, about, signup, etc.)
- **Form validation** with feedback (email, password, match)
- **JSON API** as a fake backend

---

## Tech Stack

- HTML5 / CSS3
- Vanilla JavaScript
- json-server (mock API)
- LocalStorage + SessionStorage

---

## How to Run the Project

### 1. Clone the repo

git clone https://github.com/kanb1/meal-recipes.git
cd meal-recipes

### 2. Start the mock API

npm install
npm run dev:api

### 3. Start Frontend

Open the project with a static server, e.g. Live Server in VS Code:
html/index.html → homepage (after login)

### 4. Demo-login

Use one of the users from data/users.json:

Email: user@mail.com

Password: Password.1

(More users can be found in users.json)

### NOTE!

- Passwords are stored in plain text, since this is a demo using json-server.
- In a real application, passwords would be hashed (e.g. bcrypt) and tokens (JWT/session) would be used.
- This demo is designed to showcase the frontend flow and how data → UI works.

### What I learned

- Connecting a frontend to a simple API (json-server)
- Building a login flow with Vanilla JS and localStorage
- Validating input and providing user feedback
- Structuring code and pages in a way that is easy to extend
