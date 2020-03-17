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
