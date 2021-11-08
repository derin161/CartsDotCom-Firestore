import { INVENTORY_COLL_NAME } from "../utils";
import { https } from "firebase-functions";
import { StandardRequests } from "../StandardRequests";
import { ServerApp } from "./ServerApp";
import { ItemModel } from "../models/ItemModel";

/** Application used for accessing the /foods root collection and all subcollections. */
export class InventoryApp extends ServerApp {

    private static readonly ITEM_ID_PARAM = 'iid';

    /** Sends a response containing the JSON document in the /inventory collection. 
     * 
     * @param request the incoming http request, with path param ITEM_ID_PARAM being the id of the requested item doc
     * @param response the outgoing response, which will be sent back item data, or an error if one occurs
    */
    private static getItem(request: https.Request, response: any) {
        StandardRequests.Instance.readDoc(request, response, INVENTORY_COLL_NAME, ItemModel.Converter);
    }
    
    /** Updates all item fields passed into the body of the Request.  
     * 
     * @param request the incoming http request, with path param ITEM_ID_PARAM being the id of the requested item doc to update
     * @param response the outgoing response, which will be sent back item data, or an error if one occurs
    */
    private static updateItem(request: https.Request, response: any) {
        StandardRequests.Instance.updateDoc(request, response, INVENTORY_COLL_NAME, ItemModel.Converter);
    }
    
    /** Creates a document in the /inventory collection using the
     * fields in the body of the request with a random id the path to which will be sent back to the client. 
     * 
     * @param request the incoming http request, with path param ITEM_ID_PARAM being the id of the requested item doc
     * @param response the outgoing response, which will be sent back item data, or an error if one occurs
    */
    private static createItem(request: https.Request, response: any) {
        StandardRequests.Instance.createDoc(request, response, INVENTORY_COLL_NAME, ItemModel.Converter);
    }
    
    /** Sends a response containing all JSON documents in the /inventory collection. 
     * 
     * @param request the incoming http request, with no path params
     * @param response the outgoing response, which will be sent back an array of item data, or an error if one occurs
    */
    private static getInventoryCollection(request: https.Request, response: any) {
        StandardRequests.Instance.readCollec(request, response, INVENTORY_COLL_NAME, ItemModel.Converter);
    }

    /** Creates an instance of a Inventory Application with all routing applied. */
    public constructor() {
        super(INVENTORY_COLL_NAME);
    }

    public applyRouting(app: any): void {
        app.get(`/:${InventoryApp.ITEM_ID_PARAM}`, InventoryApp.getItem); // inventory collection
        app.put(`/:${InventoryApp.ITEM_ID_PARAM}`, InventoryApp.updateItem);
        app.post(`/:${InventoryApp.ITEM_ID_PARAM}`, InventoryApp.createItem);
    
        app.get(``, InventoryApp.getInventoryCollection); // inventory collection
    
    }
}
