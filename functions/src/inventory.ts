import {https} from "firebase-functions";
import { firestore } from "firebase-admin";
import { INVENTORY_COLL_NAME, updateDocMapField, updateDocSimpleField, USERS_COLL_NAME } from "./utils";
import { DocumentData } from "@firebase/firestore";

/** Functions used for HTTPS requests on the /inventory collection. */

////////////////////////////////// DATA /////////////////////////////////////

/** Default item data to use if any field isn't passed into the body of a POST request. */
// const itemDefaultData = {
//     description: 'Empty Description',
//     id: -1,
//     imageUrl: 'No image URL provided',
//     name: 'Empty Name',
//     price: -1,
//     quantity: 2000,
// };

const ITEM_ID_PARAM = 'itemId';

////////////////////////////////// END DATA /////////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Sends a response to containing the JSON document in the users collection
 *  with the given ID=request.params.uid */
function getItem(request: https.Request, response: any) {
    const itemId = request.params[ITEM_ID_PARAM];
    console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}/${itemId}...`);
    var responseMsg:DocumentData|string = `Error getting /${INVENTORY_COLL_NAME}/${itemId}`;
    try {
        firestore().collection(INVENTORY_COLL_NAME).doc(itemId).get().then(value => {
            // fulfillment
            const docData = value.data();
            if (docData != undefined) { //document exists
                responseMsg = docData;
                console.log(`Successfully sent /${INVENTORY_COLL_NAME}/${itemId}.`);
            } else {
                responseMsg = `/${INVENTORY_COLL_NAME}/${itemId} not found`;
                console.log(responseMsg);
            }
            response.send(responseMsg);
          }, reason => {
            // rejection
            console.log(reason);
            response.send(responseMsg);
          });
    } catch (error) {
        console.log(error);
        response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

/** Updates all user fields passed into the body of the Request.  */
async function setItem(request: https.Request, response: any) {

    try {
        console.log("User update request with uid = " + request.params.uid + ' from ' + request.ip);
        console.log(JSON.stringify(request.body), request.body)
        var userDoc = firestore().collection(USERS_COLL_NAME).doc(request.params.uid);
        
        updateDocSimpleField(userDoc, 'age', request.body.age);
        updateDocSimpleField(userDoc, 'buckIDCash', request.body.buckIDCash);
        updateDocSimpleField(userDoc, 'diningDollars', request.body.diningDollars);
        updateDocSimpleField(userDoc, 'dotNumber', request.body.dotNumber);
        updateDocSimpleField(userDoc, 'firstName', request.body.firstName);
        updateDocSimpleField(userDoc, 'height', request.body.height);
        updateDocSimpleField(userDoc, 'lastName', request.body.lastName);
        updateDocSimpleField(userDoc, 'swipes', request.body.swipes);
        updateDocSimpleField(userDoc, 'weight', request.body.weight);
        updateDocMapField(userDoc, 'allergies', request.body.allergies);
        updateDocMapField(userDoc, 'restrictions', request.body.restrictions);

        response.send("Successful write to user.");
        console.log("Successfully sent user data to " + request.ip);
    } catch (error) {
        console.log(error);
        response.send("Error writing to user.");
    }
}

export function applyRouting(expressApps: Map<string, any>) {
    const app = expressApps.get(INVENTORY_COLL_NAME);
    app.get(`/:${ITEM_ID_PARAM}`, getItem);
    app.put(`/:${ITEM_ID_PARAM}`, setItem);
    app.post(`/:${ITEM_ID_PARAM}`, setItem);
}

///////////////////////////////// END FUNCTIONS ///////////////////////////////////