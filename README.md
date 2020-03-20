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

#### Contact Model and Routes

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
- we create contactContext, it's just to initialise our context
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

#### ContactForm Component & Add Contact

- now we make the ContactForm component, it'll be used to add and update contacts, we'll add the update fucntionality later, first we focus on displaying the form. We're using an object as a single piece of state `contact` with all the form fields rather than having a useState per field, so our onChange will destructure the state object and update the relevant field: `setContact({ ...contact, [e.target.name]: e.target.value });`.
- bring in the ContactForm in our `Home.js` page to display it
- we now import our ContactContext and implement an onSubmit handler that'll add our contact by calling the addContact function from ContactState and then clear the form.
- we implement `addContact()` in `ContactState.js`, for now we're just adding the contact to the ui, later on we'll add it to the db. We're using uuid to add an id to the contact, when we add our back-end MongoDB will add an id by itself; then we're dispatching to our reducer with type: ADD_CONTACT and payload: contact. We'll also need to pass addContact to the `ContactContext.Provider` as value
- we now implement our `contactReducer.js`, import the types and create the switch case for ADD_CONTACT that'll update the state. nb: state being a immutable data structure, we use the spread operator to create a new state object from the incoming state and the part we want to change

#### Delete Contact

- delete button is in the ContactItem component, so that's where we'll write the code
- first we'll import our ContactContext in the component and initialize it, then we add an `onCLick` to the delete button, we'll create an `onDelete` method rather than use an inline function as there's several things we'll need to do later, the method will call `deleteContact()` from the context
- we implement `deleteContact()` in `ContactState.js`, we're dispatching to our reducer with type: DELETE_CONTACT and payload: id. We'll also need to pass deleteContact to the Provider
- we now implement the reducer case for DELETE_CONTACT, it returns the state and filter out the contact we're deleting

#### Edit Contact - Set and Clear Current

- we want to pass the contact we want to edit to the form for editing, to do that we'll store the `current` contact in our state in ContactState, and when we click one of the edit buttons the contact we want to edit is set to `current`
- we create the set current contact and the clear current contact methods in ContactState; both will dispatch to the Reducer. Add both setCurrent and clearCurrent, as well as the new `current` piece of state to the Povider
- we implement both SET_CURRENT and CLEAR_CURRENT cases in `contactReducer.js`
- edit button is in ContactItem, that's where we'll implement an onClick method on the Edit button, we pass in an inline function calling `setCurrent()` on `contact`, contact comes from the props passed in to the ContactItem component; check in React Dev Tools that when we click edit on one of the contacts, the Context.Provider `current` value gets updated
- we also want to call `clearCurrent()` in our `onDelete()` in `ContactItem.js`

#### Edit Contact - ContactForm

- we now want to work on the ContactForm, we want to fill the form based on wether there's something in the `current` value when the component is mounted, so we're using useEffect, now when we click on an edit button, the contact gets put into the form
- we modify the main button and title based on `current` value and add a Clear button when we're editing a contact that'll call a `clearAll()` method that'll call `clearCurrent()` and do more later on
- we need to update our `onSubmit()` so it behaves differently based on wether we're adding a new user or updating a current user, we now call `updateContact()` if there's a `current` value
- we create the `updateContact()` method in ContactState, it'll dispatch to the Reducer, the payload is the entire contact. We also add the method to our Context Provider.
- we implement the UPDATE_CONTACT case in `contactReducer.js`, we map over our contacts and return the contact as is, or the new updated contact for the contact that was updated (we check by comparing ids)

#### Contact Filtering

- we want a filter input right above the contacts we can use to filter them based on contact name or email
- need a piece of state `filtered` in `ContactState.js` to hold the filtered contacts, we can now create our `filterContacts()` method that'll dispatch to the reducer and send the text we filter on as payload, as well as our `clearFilter()` method that'll also dispatch to the reducer and set `filtered` back to null. We also add both methods as well as the new `filtered` piece of state to our Context Provider.
- we now write switch cases for both of those dispatches in our reducer, for the FILTER_CONTACTS case we construct a regex from the text passed in and return the contacts where either the name or email match
- we create a new component `ContactFilter.js`. it has a form we'll use to input the text we want to filter on. Embed in on the `Home.js` page
- update the `Contacts.js` component to output the filtered contacts if there's a value in `filtered` instead of outputting all of the contacts

#### Add, Delete & Filter Animation

- we're using react-transition-group to animate contacts when they come in or out of the DOM, code is in `Contacts.js`
- copy paste the css from [the doc](https://reactcommunity.org/react-transition-group/transition-group) into our `App.css` from item-enter and item-exit
- back in `Contacts.js` we add a TransitionGroup wrapping everything and a CssTranstion wrapping individual ContactItems.

### React/Express Auth

#### Context and State for Auth

- we want to start integrating our Express Backend, starting with Auth. We create a new folder for auth context, `AuthState.js`, `authContext.js` and `authReducer.js` files. That's basically what we do each time wa add a new resource to our state/app.
- add auth types to our `types.js` file
- write the `authContext.js` file
- in `AuthState.js`, import the needed types, context and the other basic imports. Write the initialState; the token will be stored in localStorage, we also init the variables isAuthenticated,loading, user and error. Init the `useReducer()`. Add comments for every single method we want to implement. Write our `AuthContext.Provider`; And finally export our `AuthState` component
- import our Authstate in our `App.js` and wrap the entire app with our AuthState component

#### Register & Login Forms

- create a new folder auth in components and `Login.js` and `Register.js` files
- start with `Register.js`, we set user in the state, return a form allowing user to register, code `onChange()` and basic `onSubmit()` methods; then bring in the Register component into `App.js` and add a new route for it to "/register"
- we code `Login.js` next, pretty much the same as the Register component
- update the Navbar component with links to the 2 new routes

#### Context, State & Component for Alert

- we'll create the alerts context, state, reducer and component now. We create a 3rd folder in context for alert context along with `AlertState.js`, `alertContext.js` and `alertReducer.js` files.
- create `alertContext.js` first
- work on `AlertState.js` next, import the needed types, context and the other basic imports. Write the initialState, as an array of alert objects (starts empty). Init the `useReducer()`. Write the `setAlert()` method, it'll dispatch to our alertReducer, since we have an array of alerts we need an id for each alerts, we use uuid for that. The alert will disappear after a set amount of type, so we write a setTimeout that'll dispatch to our alertReducer to remoe the alert after the timeout. Write our `AlertContext.Provider`; And finally export our `AlertState` component.
- import our Alertstate component in our `App.js` and wrap the router with it
- implement `alertReducer`, there are 2 cases for the switch: SET_ALERT and REMOVE_ALERT
- we create an Alert component in the layout folder, it'll consume the alertContext and display the alerts, if there are any, with a style dynamic to the alert `type`
- import our Alert component in our `App.js` and display it right above the Switch
- bring in the AlertContext in our Register component to display an alert if pwd don't match or if a field is missing

#### User Registration

- we want to make register form work, we're going to do that by calling a register action in AuthState that'll hit the server, put the user in the db and return a token that we have to handle
- in `AuthState.js` we're creating a register method that's using Axios to make a POST request to our backend at "/api/users" (remember we set up a proxy value in `package.json`), so we're hitting the route in `routes/users.js`; we'll get back an error if the user already exists that'll trigger the catch in the register method in `AuthState.js`, otherwise the pwd will be hashed and the new user will be saved to the db. we'll dispatch to the reducer REGISTER_SUCCESS if it goes well and REGISTER_FAIL if there's an error. We also add the register method to our Context Provider.
- in our `authReducer.js`, we import all the types, and write switch cases for REGISTER_SUCCESS & REGISTER_FAIL, in case of success we store the token in local storage and we return the old state, the token (it's in `action.payload`) and set `isAuthenticated` to true and `loading` to false; in case of failure, we remove any token from local storage, and in the return we reset everything, and also send the error (our `action.payload`)
- we'll call the register method we just wrote in the `Register.js` component. We import and init the AuthContext and call the register method in the `onSubmit()` and pass to it the formData, an object with the name, email and pwd.
- we can now try to register a user; it works and the new user is writen to db and if we check the dev tools for the auth context provider we can see that `isAuthenticated` is true and the `token` is there, `user` is null, we're going to have to load the user as if we reload the page `isAuthenticated` is now null, we'll do that later. Now we're going to display an alert on register error if the user already exists (email already in db).
- in the Register component we add a useEffect hook to display the errors, we'll just check the actual error message here, if it was a larger app we'd send an error id from the back-end and use that instead. After it's sent, we want to clear the error from the state, so in `AuthState.js` we write the clearErrors method that'll dispatch to the reducer, where we write the case for CLEAR_ERRORS; then back in AuthState we call clearErrors in the useEffect hook
- nb: right now we're not holding on our login even though we get a token back from registering. We want to hit the backend route for _Get logged in user_ to see if the user is logged in.

#### Load User & Set Token

- we want to load the user data from the backend and put it into our state to validate our authentification
- We want to set the jwt into a global header within Axios so we don't have to put it in headers in every method when we fetch contacts etc; we do that in a new file `utils/setAuthToken.js` that'll set or remove a default header for _x-auth-token_
- in `AuthState.js` we write the loadUser method, we make a get request to "/api/auth" to get the logged in user and dispatch to our dispatcher USER_LOADED if it works, or AUTH_ERROR if it doesn't. "/api/Auth" is a protected route so we'll need a jwt to access it so we import setAuthToken an call it before our try/catch block with the get request
- in `authReducer.js` we write both switch cases.
- we'll also run`setAuthToken()` in `App.js` so it runs every single time our main component loads
- we add a call to `loadUser()` in the `register()` method in `AuthState.js` after the dispatch to REGISTER_SUCCESS, so now once we register a new user they get logged in
- we want our Register component to redirect if we're authenticated, so we bring in `isAuthenticated` from our authContext and use it in the useEffect rigth before we check for errors where we redirect to homepage with react router if the user is authenticated
- test in the browser tat it works, when we register a new user, the page redirects us to home and, the user data get put under `user` in the state, `isAuthenticated` is set to true, and the `token` get its value, (and the token get added to localstorage). If we reload the page though, `user` and `isAuthenticated` get set back to null and e don't want that, so we need to call load user when this home page loads
- in `Home.js` we bring in and init our AuthContext and add a useEffect and call `loadUser()` within. If we reload the page in the navigator, we now see the `user` is there in the state; nb: the token was still in localstorage, loadUser was called with it, it hit the back-end at "/api/auth" and authenticated the user, so we didn't need to register a new user to test.

#### User Login

- in `AuthState.js` we write our login methon, it's quite similar to the register method bu tit hits a different endpoint of our backend, "/api/auth"; We'll dispatch LOGIN_SUCCESS or LOGIN_FAIL to our reducer
- in the authReducer we handle both cases
- in our `Login.js` component, we do what we did for the Register component, bring in and init the contexts, add a useEffect to redirect if we're authenticated and check for invalid credentials error; and on onSubmit we check if the fields are filled in and call `login()` with the email and password if they are.
- to test first get rid of the jwt in localstorage and then login with one of the registered user. We now will want to add log out functionality, and hide the register and login links in the navbar if the user is already logged in
