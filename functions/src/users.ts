import {https} from "firebase-functions";
import { USERS_COLL_NAME } from "./utils";
import { Firestore } from "@firebase/firestore";
import { OrderModel } from "./models/OrderModel";
import { UserModel } from "./models/UserModel";
import { StandardRequests } from "./StandardRequests";

/** Functions used for HTTPS requests on the /users collection. */

////////////////////////////////// DATA /////////////////////////////////////

const USER_ID_PARAM = 'uid';
const ORDER_ID_PARAM = 'oid';

////////////////////////////////// END DATA /////////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Sends a response to containing the JSON document in the users collection
 *  with the given ID=request.params.uid */
async function getUser(request: https.Request, response: any) {
    StandardRequests.Instance.get(request, response, USERS_COLL_NAME, UserModel.Converter);
}

/** Updates all user fields passed into the body of the Request.  */
async function updateUser(request: https.Request, response: any) {
    StandardRequests.Instance.put(request, response, USERS_COLL_NAME, UserModel.Converter);
}

/** Creates a user with the given fields in the body of the request, and sets any fields not occurring in the Request.body to a default value. */
async function createUser(request: https.Request, response: any) {
    StandardRequests.Instance.postWithID(request, response, USERS_COLL_NAME, UserModel.Converter);
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
async function createUserOrder(request: https.Request, response: any){
    StandardRequests.Instance.post(request, response, USERS_COLL_NAME, OrderModel.Converter);
}

async function updateUserOrder(request: https.Request, response: any){
    StandardRequests.Instance.put(request, response, USERS_COLL_NAME, OrderModel.Converter);
}

/** Sends a response to containing the JSON document in the users order collection
 *  with the given ID=request.params.uid */
async function getUserOrder(request: https.Request, response: any) {
    StandardRequests.Instance.get(request, response, USERS_COLL_NAME, OrderModel.Converter);
}

export function applyRouting(expressApps: Map<string, any>) {
    const app = expressApps.get(USERS_COLL_NAME);
    app.get(`/:${USER_ID_PARAM}`, getUser); // /users/ collection
    app.put(`/:${USER_ID_PARAM}`, updateUser);
    app.post(`/:${USER_ID_PARAM}`, createUser);

    app.get(`/:${USER_ID_PARAM}/orders/:${ORDER_ID_PARAM}`, getUserOrder); // /users/<uid>/orders/ collection
    app.post(`/:${USER_ID_PARAM}/orders/`, createUserOrder);
    app.put(`/:${USER_ID_PARAM}/orders/:${ORDER_ID_PARAM}`, updateUserOrder)
}

export function registerDB(app: Firestore) {
    //USERS_COLL_REF = collection(app, USERS_COLL_NAME).withConverter(UserModel.Converter);

}

///////////////////////////////// END FUNCTIONS ///////////////////////////////////