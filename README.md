# pTracker

pTracker is a user friendly web application which allows users to keep track of their crypto portfolio.

*PS: In VSCode if you write a markdown(.md) file like this one, you can press (Ctrl+Shift+V) to preview it.*
## Screenshots

You can see screenshots of the application in the screenshots folder.

## Technologies Used
For the Back-end : Node.js 

Testing for the Back-end : Jest Framework 

For the Front-end : React.js

## Installation

First you need to clone the project

Then you navigate to the backend folder and create a config folder which should contain a dev.env file plus a test.env file.

The dev.end file should look like this : 

```bash
PORT=Your-port-number
BASE_URL=/p-tracker-api
SENDGRID_API_KEY=Your-API-key
JWT_SECRET=Your-secret-phrease
MONGODB_URL=Your-mongodb-url
```

test.env file is the same as dev.env file except the mongodb url.

After you created those files inside the folder go back to backend folder and install npm packages with the command 
```bash
$npm i
```
Then go to the frontend folder and install the npm packages using the same command
## Usage

```bash
# run backend in the backend folder
$npm run dev
```
```bash
# run frontend
$npm start
```
## Testing
```bash
# run tests in backend, a in the end is to run all tests 
$npm run test a
```

## Authors and acknowledgment

https://github.com/arisk1


https://github.com/errikosg


