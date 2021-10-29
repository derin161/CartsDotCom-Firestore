import {https} from "firebase-functions";
import { INVENTORY_COLL_NAME } from "./utils";
import { addDoc, collection, CollectionReference, doc, DocumentData, Firestore, getDocs, updateDoc } from "@firebase/firestore";
import { getDoc } from "firebase/firestore";
import { ItemModel } from "./models/ItemModel";

/** Functions used for HTTPS requests on the /inventory collection. */

const ITEM_ID_PARAM = 'itemId';

var INVENTORY_COLL_REF:CollectionReference<DocumentData>;

////////////////////////////////// END DATA /////////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Sends a response containing the JSON document in the inventory collection
 *  with the given ID = request.params[ITEM_ID_PARAM], or an error message if an error occurs. */
async function getItem(request: https.Request, response: any) {
    const itemId = request.params[ITEM_ID_PARAM];
    console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}/${itemId}...`);

    var responseMsg:DocumentData|string = `Error getting /${INVENTORY_COLL_NAME}/${itemId}`;
    try {
        const itemDoc = await getDoc(doc(INVENTORY_COLL_REF, itemId));
        if (itemDoc.exists()) { 
            responseMsg = itemDoc.data();
            console.log(`Successfully sent /${INVENTORY_COLL_NAME}/${itemId}.`);
        } else {
            responseMsg = `/${INVENTORY_COLL_NAME}/${itemId} not found`;
            console.log(responseMsg);
        }
    } catch (error) {
        console.log(error);
        //Response already has an error message
    } finally {
        response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
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
    console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}...`);
    var responseMsg: string = `Error creating item.`;

    const item = ItemModel.Converter.fromHTTPRequest(request);
    try {
        const itemDoc = await addDoc(INVENTORY_COLL_REF, item);
        responseMsg = `Successfully created item document /${INVENTORY_COLL_NAME}/${itemDoc.id}`;
        console.log(responseMsg);
    } catch (error) {
        console.log(error);
    } finally {
        response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

/** Updates all user fields passed into the body of the Request.  */
async function updateItem(request: https.Request, response: any) {
    console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}/${itemId}`);
    var responseMsg:string = `Error updating item.`;

    const itemId = request.params[ITEM_ID_PARAM];
    try {
        const itemDoc = await getDoc(doc(INVENTORY_COLL_REF, itemId));
        const item = ItemModel.Converter.fromFirestoreDoc(itemDoc);
        item.updateFromHTTPRequest(request);
        const updatedItem = ItemModel.Converter.toFirestore(item);

        await updateDoc(doc(INVENTORY_COLL_REF, itemId), updatedItem);

        responseMsg = `Successfully updated item document /${INVENTORY_COLL_NAME}/${itemId}`;
        console.log(responseMsg);
    } catch (error) {
        console.log(error);
    } finally {
        response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
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