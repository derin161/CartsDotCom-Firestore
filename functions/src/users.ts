import {https} from "firebase-functions";
import { firestore } from "firebase-admin";
import { getFirestore, doc, setDoc, } from "firebase/firestore";
import {  updateDocSimpleField, USERS_COLL_NAME } from "./utils";

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
async function getUser(request: https.Request, response: any) {
    try {
        console.log("User get request with uid = " + request.params.uid);
        var userData = await firestore().collection(USERS_COLL_NAME).doc(request.params.uid).get();

        var msg;
        if (!!!userData) {
            msg = 'User with uid = ' + request.params.uid + ' not found'; //fix
        } else {
            msg = userData.data();

        }

        response.send(msg);
        console.log("Successfully sent user data.");
    } catch (error) {
        console.log(error);
        response.send("Error getting user data with uid = " + request.params.uid); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

/** Updates all user fields passed into the body of the Request.  */
async function updateUser(request: https.Request, response: any) {

    try {
        console.log("User update request with uid = " + request.params.uid + ' from ' + request.ip);
        console.log(JSON.stringify(request.body), request.body)
        var userDoc = firestore().collection(USERS_COLL_NAME).doc(request.params.uid);
        
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
async function createUser(request: https.Request, response: any) {

    try {
        console.log("User create req with uid = " + request.params.uid + ' from ' + request.ip);
        var userDoc = doc(getFirestore(), USERS_COLL_NAME, request.params.uid); //need to use getFirestore() instead of db because of some typing issue
        await setDoc(userDoc, userDefaultData).then(() => {updateUser(request, response)});
    } catch (error) {
        console.log(error);
        response.send("Error creating user."); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

/*
    Method: POST
    Adds an order to order subcollection stored in a specific user document
    Format of new entry in db:
        -food_id
        -location_id
        -timestamp

    Param request must contain: 
        -uid: User ID
        -food_id: food ID
        -location_id: location ID
*/
async function updateUserHistory(request: https.Request, response: any){

    const uid = request.params.uid;
    const food_id = request.body.food_id;

    try{
        //Add a new order to the orders subcollection in a specific user document. Order ID autogenerated.
        await firestore().collection('users').doc(uid).collection('orders').add({
            time: Date.now(),
            food_id,
        });
        console.log("Updated order history successfully.")
        response.send(`Order history updated successfully.`)
    }catch(error){
        console.log(`Error updating order history: ${error}`);
        response.end(); 
    }


}

export function applyRouting(expressApps: Map<string, any>) {
    const app = expressApps.get(USERS_COLL_NAME);
    app.post('/:uid/orders', updateUserHistory);
    app.get('/:uid', getUser);
    app.put('/:uid', updateUser);
    app.post('/:uid', createUser);
}

///////////////////////////////// END FUNCTIONS ///////////////////////////////////