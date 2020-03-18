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

#### User Model & Register Route Validation

- create a models folder, a `User.js` file and make a Mongoose User Model and import it in the `users.js` route file
- we need to add a piece of middleware to our server.js `app.use(express.json());` in order to parse the json in the request body (req.body)
- in Postman make a post request to `http://localhost:5000/api/users`, add `Content-Type: application/json` in the Headers and in the body pick raw and send to test the route:

```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "azerty"
}
```

- we're using express-validator by passing as 2nd parameter to `router.post()` an array with `check()` methods and then handle the potential errors with `validationResult(req)` in the callback

#### Hash Password Register Route

- in `users.js` routes, using async/await, we add a try/catch block after validation to check from the db if the new user already exists, if he does, send an error, if not we create a new user using the Mongoose User model, hash & salt the password with bcrypt and then save the new user to the db.
- use Postman to register a new user and MongoDB Compass to check the db

#### Respond with a JSON Web Token

- we want to send a jwt after a new user successfully register
- after the new user is saved to the db, we construct the jwt payload, it's just the user id as we can use that to eg: access all the contacts a specific user has
- to generate a token we have to sign it with `jwt.sign()`, it takes 4 parameters, the payload, the jwt secret that we load from our `default.json` with the config npm module, an object of options, and a callback that'll send the token as json if there are no errors
- check route with Postman

#### Auth Route

- we now write the login route in `auth.js`, it's pretty close to the register route except we'll use `bcrypt.compare()` to check the password the user provides to login
- check route with Postman: create a Postman collection, a Users&Auth folder and create a Post request to `http://localhost:5000/api/users`, add the `Content-Type: application/json` header and in body send raw json with email and password to make sure we get a jwt back with correct credentials and our error messages with the wrong or missing credentials

#### Auth Middleware and Protecting Routes

- create middleware `auth.js`, middleware has access to the request-response cycle and the req and res object, we will want to check if there's a token in the header
- we get the jwt token from the header `req.header("x-auth-token");`, if it exists we verify it with the `jwt.verify()` method , that gets us back the payload from the jwt
- we get the user from the payload and assign him to the request object, then we move on by calling the `next()` method
- we can now protect our private routes by passing the `auth` middleware as a 2nd parameter to the routes
- we can now do the _Get logged in user_ route in `auth.js` routes, we use the id provided by our middleware in `req.user.id` to try and find the current logged in user in our db and return it, if we send the correct token.
- check the route in Postman, first use the login route to get a valid jwt and copy the token in the Headers for this route under the `x-auth-token` key

##### Contact Model and Routes

- first we create a `Contact.js` Mongoose model, we link the contacts to users with the user key in the schema
- then we work on the `contacts.js` routes
- for the _Get all users contact_ route, nothing special; test the route in Postman, will need to get a token in the Headers by first logging in a user; make a new folder in Psotman to save the contacts routes
- _Add new contact_ route need both auth and express-validator middleware, we put them one after the other between [] as 2nd parameter to the route; test the route in Postman, will need Headers for content-type and auth-token, and add a contact in raw json with at least name and email.
- _Update contact_ route, first we make an object with the fields submitted for updating then we check for the contact to be updated by id - the id is passed as url parameter so we can get it with `req.params.id` - and finally we update the contact using the object we created and send back the new contact. Check the route in postman, will need Headers for content-type and auth-token
- _Delete contact_ route, similar to update route.

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

#### Navbar & Router Setup

- cleanup the create-react-app basic app by removing what we don't need
- setup fontawesome, css, font
- setup app folder structure
- make a basic navbar and set up the Home and About page

#### Context and State for Contacts

- first we code the context and state so we have our single-source-of-thruth for our contacts
- create contactContext, it's just to initialise our context
- types are variables that we use to decide the actions we do in our reducer
- ContactState import context, reducer and types. We put some hard coded contacts in the initialState for now before we deal with our backend. We'll wrap our entire app with this context provider
- contactReducer is empty for now

#### Contact & ContactItem Components

- now that we have access to our state we can start coding our contact components
- we want to pull in the contacts from the state into the Contacts component and then loop through them create a list and output a ContactItem component for each one
- so we create the Contacts component first, import contactContext and consume the context, right now we just have our hadcoded contact array with 3 objects in our context value, we map through them and output a simple `<h3>{contact.name}</h3>` for each one
- we embed the Contacts components in our Home page
- create the ContactItem component, import it into the Contacts component, and output a ContactItem for each contact in the map instead of the h3.
- nb: email and phone aren't required, so we need to make sure they exist in the ContactItem component before outputting them `{phone && (<li>....</li>)}`
