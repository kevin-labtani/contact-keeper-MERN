# Contact Keeper

## Présentation du Projet

Projet créé le 12/03/2020 par [**Kevin Labtani**](https://github.com/kevin-labtani) dans le but d'améliorer ma connaissance du MERN stack.  
Le projet se base sur le cours [React Front to Back](https://www.udemy.com/course/modern-react-front-to-back/) de [Brad Traversy](https://www.traversymedia.com/)

## Langages

- Javascript

## Technologies

- MongoDB
- Express
- React
- Node.js

autres outils: MongoDB Compass, Postman

## Notes

### Back-End Node.js/Express API

### Front-End React App

#### Setup

- run `npx create-react-app client` to install the front-end app in the client folder
- use concurrently to run both front and back simultaneously and add the following script to the root `package.json`

```json
"client": "npm start --prefix client",
"clientinstall": "npm install --prefix client",
"dev": "concurrently \"npm run server\" \"npm run client\""
```

- add a proxy to the client `package.json` so we can make a request to the backend directly to `/api` rather than `http://localhost:5000/api`

```json
"proxy": "http://localhost:5000"
```

- remove the `.gitignore` in the client directory as there's already one in the root and remove the git repo by running `rm -rf .git` in the client directory

#### Navbar & Router setup

- cleanup the create-react-app basic app by removing what we don't need
- setup fontawesome, css, font
- setup app folder structure
- make a basic navbar and set up the Home and About page

#### Context and State for contacts

- first we code the context and state so we have our single-source-of-thruth for our contacts
- create contactContext, it's just to initialise our context
- types are variables that we use to decide the actions we do in our reducer
- ContactState import context, reducer and types. We put some hard coded contacts in the initialState for now before we deal with our backend. We'll wrap our entire app with this context provider
- contactReducer is empty for now

#### Contact components

- now that we have access to our state we can start coding our contact components
- we want to pull in the contacts from the state into the Contacts component and then loop through them create a list and output a ContactItem component for each one
- so we create the Contacts component first, import contactContext and consume the context, right now we just have our hadcoded contact array with 3 objects in our context value, we map through them and output a simple `<h3>{contact.name}</h3>` for each one
- we embed the Contacts components in our Home page
- create the ContactItem component, import it into the Contacts component, and output a ContactItem for each contact in the map instead of the h3.
- nb: email and phone aren't required, so we need to make sure they exist in the ContactItem component before outputting them `{phone && (<li>....</li>)}`
