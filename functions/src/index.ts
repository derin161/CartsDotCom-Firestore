import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { ServerApp } from "./apps/ServerApp";
import { UsersApp } from "./apps/UsersApp";
import { TestsApp } from "./apps/TestsApp";
import { DBSingleton } from "./DBSingleton";
import { InventoryApp } from "./apps/InventoryApp";

/* Initialize admin SDK, requires environment var GOOGLE_APPLICATION_CREDENTIALS to be
set to the path of the JSON document containing the admin SDK key. 
DO NOT EXPOSE PUBLICLY */
admin.initializeApp(); 
//TODO load from file

/** Initialize client SDK */
initializeApp({
    apiKey: "AIzaSyBwgrf6zn_-T03NHA8iHywlRRCwnmfkLDg",
    authDomain: "cartsdotcom.firebaseapp.com",
    projectId: "cartsdotcom",
    storageBucket: "cartsdotcom.appspot.com",
    messagingSenderId: "412301250384",
    appId: "1:412301250384:web:5de64f52cb211891816655",
    measurementId: "G-B1DQRGWYM6"
});

const db = getFirestore(); //initialize db
DBSingleton.Instance.registerDB(db);
const expressApps:ServerApp[] = [new InventoryApp(), new UsersApp(), new TestsApp()];

// Listen for requests
expressApps.forEach((serverApp) => {
    exports[serverApp.AppName] = functions.https.onRequest(serverApp.App);
});
