import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";
import * as cors from "cors";
import { initializeApp } from "firebase/app";
import * as users from "./users";
import * as tests from "./tests"
import * as inventory from './inventory'
import { INVENTORY_COLL_NAME, TESTS_APP_NAME, USERS_COLL_NAME } from "./utils";
import { getFirestore } from "@firebase/firestore";

//require('dotenv').config()

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

const expressApps:Map<string, any> = new Map([
    [TESTS_APP_NAME, express()],
    [USERS_COLL_NAME, express()],
    [INVENTORY_COLL_NAME, express()],
]);

expressApps.forEach((val, key) => {
    // Automatically allow cross-origin requests
    val.use(cors({ origin: true }));
});

//Register the db for all apps
const db = getFirestore();
inventory.registerDB(db);

// Apply routing for all the apps
tests.applyRouting(expressApps);
users.applyRouting(expressApps);
inventory.applyRouting(expressApps);

// Listen for requests
expressApps.forEach((val, key) => {
    exports[key] = functions.https.onRequest(val);
});