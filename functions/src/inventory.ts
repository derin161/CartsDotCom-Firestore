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

/** Sends a response to containing the JSON document in the users collection
 *  with the given ID = request.params[ITEM_ID_PARAM] */
function getItem(request: https.Request, response: any) {
    const itemId = request.params[ITEM_ID_PARAM];
    console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}/${itemId}...`);
    var responseMsg:DocumentData|string = `Error getting /${INVENTORY_COLL_NAME}/${itemId}`;
    try {
        getDoc(doc(INVENTORY_COLL_REF, itemId)).then(value => {
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

async function getAllItems(request: https.Request, response: any) {
    const itemDocs = await getDocs(INVENTORY_COLL_REF);
    response.send(itemDocs.docs.map(doc => doc.data()));
}

/** Updates all user fields passed into the body of the Request.  */
async function createItem(request: https.Request, response: any) {

    const item = ItemModel.dbConverter.fromHTTPRequest(request);
        
        addDoc(INVENTORY_COLL_REF, item).then(value => {
            const msg = `Successfully created item document /${INVENTORY_COLL_NAME}/${value.id}`;
            console.log(msg);
            response.send(msg);
          }, reason => {
            // rejection
            console.log(reason);
            response.send(`Error creating item.`);
          })
          .catch(error => {
            console.log(error);
            response.send(`Error creating item.`);
          });
}

/** Updates all user fields passed into the body of the Request.  */
async function updateItem(request: https.Request, response: any) {
    const itemId = request.params[ITEM_ID_PARAM];
        const itemDoc = await getDoc(doc(INVENTORY_COLL_REF, itemId));
        const item = ItemModel.dbConverter.fromFirestoreDoc(itemDoc);

        item.updateFromHTTPRequest(request);
        const updatedItem = ItemModel.dbConverter.toFirestore(item);
        updateDoc(doc(INVENTORY_COLL_REF, itemId), updatedItem).then(() => {
            const msg = `Successfully updated item document /${INVENTORY_COLL_NAME}/${itemId}`;
            console.log(msg);
            response.send(msg);
          }, reason => {
            // rejection
            console.log(reason);
            response.send(`Error updating item.`);
          })
          .catch(error => {
            console.log(error);
            response.send(`Error updating item.`);
          });
}

export function applyRouting(expressApps: Map<string, any>) {
    const app = expressApps.get(INVENTORY_COLL_NAME);
    app.get(`/:${ITEM_ID_PARAM}`, getItem);
    app.put(`/:${ITEM_ID_PARAM}`, updateItem);
    app.post(`/`, createItem);
    app.get('/functions/getAllItems', getAllItems);
}

export function registerDB(app: Firestore) {
    INVENTORY_COLL_REF = collection(app, INVENTORY_COLL_NAME).withConverter(ItemModel.dbConverter);
}

///////////////////////////////// END FUNCTIONS ///////////////////////////////////