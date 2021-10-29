import { doc, DocumentData, Firestore, getDoc, } from "@firebase/firestore";
import { https } from "firebase-functions/v1";
import { DataModel } from "./models/DataModel";
import { DataModelConverter } from "./models/DataModelConverter";
import { getCollectionFromPath, getDocIDFromPath } from "./utils";

export class StandardRequests {
    
    private static instance:StandardRequests = new StandardRequests();
    private db:Firestore | undefined;

    public static get Instance() {
        return this.instance;
    }

    private constructor() {}

        /** Sends a response containing the JSON document in the inventory collection
     *  with the given ID = request.params[ITEM_ID_PARAM], or an error message if an error occurs. */
    async get(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}}...`);

        var responseMsg:DocumentData|string = `Error getting ${fullPath}`;
        try {
            const collection = getCollectionFromPath(this.db!, fullPath).withConverter(converter);
            const docId = getDocIDFromPath(fullPath);

            const document = await getDoc(doc(collection, docId));
            if (document.exists()) { 
                responseMsg = document.data();
                console.log(`Successfully sent ${fullPath}.`);
            } else {
                responseMsg = `${fullPath} not found`;
                console.log(responseMsg);
            }
        } catch (error) {
            console.log(error);
            //Response already has an error message
        } finally {
            response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
        }
    }

    // /** Updates all user fields passed into the body of the Request.  */
    // async post(request: https.Request, response: any) {
    //     console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}...`);
    //     var responseMsg: string = `Error creating item.`;

    //     const item = ItemModel.Converter.fromHTTPRequest(request);
    //     try {
    //         const itemDoc = await addDoc(INVENTORY_COLL_REF, item);
    //         responseMsg = `Successfully created item document /${INVENTORY_COLL_NAME}/${itemDoc.id}`;
    //         console.log(responseMsg);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    //     }
    // }

    // /** Updates all user fields passed into the body of the Request.  */
    // async put(request: https.Request, response: any) {
    //     const itemId = request.params[ITEM_ID_PARAM];
    //     console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}/${itemId}`);
    //     var responseMsg:string = `Error updating item.`;

    //     try {
    //         const itemDoc = await getDoc(doc(INVENTORY_COLL_REF, itemId));
    //         const item = ItemModel.Converter.fromFirestoreDoc(itemDoc);
    //         item.updateFromHTTPRequest(request);
    //         const updatedItem = ItemModel.Converter.toFirestore(item);

    //         await updateDoc(doc(INVENTORY_COLL_REF, itemId), updatedItem);

    //         responseMsg = `Successfully updated item document /${INVENTORY_COLL_NAME}/${itemId}`;
    //         console.log(responseMsg);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    //     }
    // }

    public registerDB(db: Firestore) {
        this.db = db;
    }

}