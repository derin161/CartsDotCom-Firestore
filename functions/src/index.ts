import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";
import * as cors from "cors";
import { initializeApp } from "firebase/app";
import { getUser, updateUser, createUser } from "./users";

const app = express();


admin.initializeApp();
//TODO load from file
initializeApp({
    apiKey: "AIzaSyBwgrf6zn_-T03NHA8iHywlRRCwnmfkLDg",
    authDomain: "cartsdotcom.firebaseapp.com",
    projectId: "cartsdotcom",
    storageBucket: "cartsdotcom.appspot.com",
    messagingSenderId: "412301250384",
    appId: "1:412301250384:web:5de64f52cb211891816655",
    measurementId: "G-B1DQRGWYM6"
});

/////////////// APP ROUTING /////////////////////////////

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


//User routes
app.get('/users/:uid', getUser);
app.put('/users/:uid', updateUser);
app.post('/users/:uid', createUser);


///////////////////////////////////////////////////////////////

exports.api = functions.https.onRequest(app);


