import {https} from "firebase-functions";
import { firestore } from "firebase-admin";
import { getFirestore, doc, setDoc, } from "firebase/firestore";
import { updateDocSimpleField } from "./utils";

/** Functions used for HTTPS requests on the /users collection. */

////////////////////////////////// DATA /////////////////////////////////////

/** Default user data to use if any field isn't passed into the body of a POST request. */
const userDefaultData = {
    firstName: 'John',
    lastName: 'Doe',
};

////////////////////////////////// END DATA /////////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Sends a response to containing the JSON document in the users collection
 *  with the given ID=request.params.uid */
export async function getUser(request: https.Request, response: any) {
    try {
        console.log("User get request with uid = " + request.params.uid);
        var user = await firestore().collection('users').doc(request.params.uid).get();

        var msg;
        if (!!!user) {
            msg = 'User with uid = ' + request.params.uid + ' not found';
        } else {
            msg = user.data();

        }

        response.send(msg);
        console.log("Successfully sent user data.");
    } catch (error) {
        console.log(error);
        response.send("Error getting user data with uid = " + request.params.uid); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

/** Updates all user fields passed into the body of the Request.  */
export async function updateUser(request: https.Request, response: any) {

    try {
        console.log("User update request with uid = " + request.params.uid + ' from ' + request.ip);
        console.log(JSON.stringify(request.body), request.body)
        var userDoc = firestore().collection('users').doc(request.params.uid);
        
        updateDocSimpleField(userDoc, 'firstName', request.body.firstName);
        updateDocSimpleField(userDoc, 'lastName', request.body.lastName);

        response.send("Successful write to user.");
        console.log("Successfully sent user data to " + request.ip);
    } catch (error) {
        console.log(error);
        response.send("Error writing to user.");
    }
}

/** Creates a user with the given fields in the body of the request, and sets any fields not occurring in the Request.body to a default value. */
export async function createUser(request: https.Request, response: any) {

    try {
        console.log("User create req with uid = " + request.params.uid + ' from ' + request.ip);
        var userDoc = doc(getFirestore(), 'users', request.params.uid); //need to use getFirestore() instead of db because of some typing issue
        setDoc(userDoc, userDefaultData).then( () => updateUser(request, response));
        
    } catch (error) {
        console.log(error);
        response.send("Error creating user."); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

///////////////////////////////// END FUNCTIONS ///////////////////////////////////