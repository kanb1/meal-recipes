# Meal Recipes

Et lille frontend-projekt bygget med **HTML, CSS og Vanilla JavaScript**.  
Jeg har udvidet projektet med en simpel login-funktionalitet via **json-server**, så man kan logge ind med mock-brugere og gemme favoritter i localStorage.

---

## Features

- **Login & Signup** med mock-database (`json-server`)
- **Favoritter** gemmes pr. bruger i localStorage
- Flere statiske sider (recipes, about, signup osv.)
- **Formvalidering** med feedback (email, password, match)
- **JSON API** som fake backend

---

## Teknologier

- HTML5 / CSS3
- Vanilla JavaScript
- json-server (mock API)
- LocalStorage + SessionStorage

---

## Sådan kører du projektet

### 1. Klon repo

git clone https://github.com/kanb1/meal-recipes.git
cd meal-recipes

### 2. Start mock-API

npm install
npm run dev:api

### 3. Start Frontend

Åbn projektet med en statisk server, fx Live Server i VS Code:
html/index.html → forside (efter login)

### 4. Demo-login

Brug en af brugerne fra data/users.json:

Email: user@mail.com
Password: Password.1

(Flere brugere findes i users.json)

### BEMÆRK!

! Passwords ligger i klartekst, fordi det er en demo med json-server.
! I en rigtig applikation ville man bruge hashing (fx bcrypt) og tokens (JWT/session).
! Demoen er lavet for at vise frontend-flowet og hvordan man arbejder med data → UI

### Hvad jeg lærte

- At forbinde frontend med et simpelt API (json-server)
- At bygge login-flow med Vanilla JS og localStorage
- At validere input og give brugeren feedback
- At strukturere kode og sider på en måde, der er nem at udvide
