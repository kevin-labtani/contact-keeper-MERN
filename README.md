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

#### Setup

- We're using MongoDB Atlas as a cloud NoSQL db, so we need to set it up, add a new user for this specific app and whitelist our ip (or 0.0.0.0/0 to whitelist all ips)
- We're using Postman to test our API while developing it
- create a folder and do a `npm init -y`
- add our dependencies and write a basic express server in a `server.js` file sending `res.json({msg: "Hello World"})` to the `'/'` route, test it with Postman

#### Backend Routes

- create routes folder and one file for each resource, contacts, users and auth here, import the routes into our server.js, we want each back-end route to start with `/api` so we use eg. for users routes: `app.use("/api/users", require("./routes/users"));`
- code our users, auth and contacts routes (no functionality right now, all routes just `res.send('some text')`), nb: we're using `express.Router()` so the routes are eg. for post: `router.post()`. don't forget to export at the end of the file `module.exports = router;`
- test routes with Postman

#### Connect App to MongoDB

- `git init`, add `.gitignore` if not done before
- make config folder in the root, add `default.json` (part of config npm package) for global variables
- create `db.js` file in config folder for the code to connect to db, nb: we're using async/await, requite `db.js` in our `server.js` and connect to db


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

#### Contact & ContactItem components

- now that we have access to our state we can start coding our contact components
- we want to pull in the contacts from the state into the Contacts component and then loop through them create a list and output a ContactItem component for each one
- so we create the Contacts component first, import contactContext and consume the context, right now we just have our hadcoded contact array with 3 objects in our context value, we map through them and output a simple `<h3>{contact.name}</h3>` for each one
- we embed the Contacts components in our Home page
- create the ContactItem component, import it into the Contacts component, and output a ContactItem for each contact in the map instead of the h3.
- nb: email and phone aren't required, so we need to make sure they exist in the ContactItem component before outputting them `{phone && (<li>....</li>)}`
