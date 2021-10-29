import {https} from "firebase-functions";
import { INVENTORY_COLL_NAME } from "./utils";
import { collection, CollectionReference, DocumentData, Firestore, getDocs } from "@firebase/firestore";
import { ItemModel } from "./models/ItemModel";
import { StandardRequests } from "./StandardRequests";

/** Functions used for HTTPS requests on the /inventory collection. */

////////////////////////////////// DATA /////////////////////////////////////


const ITEM_ID_PARAM = 'itemId';

var INVENTORY_COLL_REF:CollectionReference<DocumentData>;

////////////////////////////////// END DATA /////////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Sends a response containing the JSON document in the inventory collection
 *  with the given ID = request.params[ITEM_ID_PARAM], or an error message if an error occurs. */
async function getItem(request: https.Request, response: any) {
    StandardRequests.Instance.get(request, response, INVENTORY_COLL_NAME, ItemModel.Converter);
}

async function getAllItems(request: https.Request, response: any) {
    console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}/functions/getAllItems...`);

    var responseMsg: string | DocumentData[] = `No items found in ${INVENTORY_COLL_NAME}.`;

    try {
        const itemDocs = await getDocs(INVENTORY_COLL_REF);
        if (!itemDocs.empty) {
            responseMsg = itemDocs.docs.map(doc => doc.data());
        }
    } catch (error) {
        console.log(error);
        responseMsg = `Error processing ${request.method} request to /${INVENTORY_COLL_NAME}/functions/getAllItems.`;
    } finally {
        response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

/** Updates all user fields passed into the body of the Request.  */
async function createItem(request: https.Request, response: any) {
    StandardRequests.Instance.post(request, response, INVENTORY_COLL_NAME, ItemModel.Converter);
}

/** Updates all user fields passed into the body of the Request.  */
async function updateItem(request: https.Request, response: any) {
    StandardRequests.Instance.put(request, response, INVENTORY_COLL_NAME, ItemModel.Converter);
}

export function applyRouting(expressApps: Map<string, any>) {
    const app = expressApps.get(INVENTORY_COLL_NAME);
    app.get(`/:${ITEM_ID_PARAM}`, getItem);
    app.put(`/:${ITEM_ID_PARAM}`, updateItem);
    app.post(`/`, createItem);
    app.get('/functions/getAllItems', getAllItems);
}

export function registerDB(app: Firestore) {
    INVENTORY_COLL_REF = collection(app, INVENTORY_COLL_NAME).withConverter(ItemModel.Converter);
}

///////////////////////////////// END FUNCTIONS ///////////////////////////////////