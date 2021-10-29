import { doc, DocumentData, Firestore, getDoc, setDoc, } from "@firebase/firestore";
import { https } from "firebase-functions/v1";
import { addDoc, updateDoc } from "firebase/firestore";
import { DataModel } from "./models/DataModel";
import { DataModelConverter } from "./models/DataModelConverter";
import { getCollectionFromPath, getDocIDFromPath } from "./utils";

/** Singleton helper class for standard GET, POST, PUT requests using custom DataModel object converters. */
export class StandardRequests {
    
    private static instance:StandardRequests = new StandardRequests();
    private db:Firestore | undefined;

    public static get Instance() {
        return this.instance;
    }

    private constructor() {}

    /** Sends a response containing the requested document fields in a JSON format, or an error message if one occurs.
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    public async get(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}...`);

        var responseMsg:DocumentData|string = `Error getting ${fullPath}`;

        const collection = getCollectionFromPath(this.db!, fullPath, true).withConverter(converter);
        const docId = getDocIDFromPath(fullPath);

        try {
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

    /** Creates a document in the collection with the fields in the body of the request with a random id. 
     * Responds with the path to the newly created document if successful or with an error message.
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    async post(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}...`);

        var responseMsg: string = `Error creating document at ${fullPath}.`;

        const dataModel = converter.fromHTTPRequest(request);
        const collection = getCollectionFromPath(this.db!, fullPath, false).withConverter(converter);
        try {
            const document = await addDoc(collection, dataModel);
            responseMsg = `Successfully created item document ${fullPath}/${document.id}`;
            console.log(responseMsg);
        } catch (error) {
            console.log(error);
        } finally {
            response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
        }
    }

        /** Creates a document in the collection with the fields in the body of the request with a random id. 
     * Responds with the path to the newly created document if successful or with an error message.
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>/<id>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
         async postWithID(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
            const fullPath = `/${rootCollName}${request.path}`;
            const docId = getDocIDFromPath(fullPath);

            console.log(`Processing ${request.method} request to ${fullPath}`);
    
            var responseMsg: string = `Error creating document at ${fullPath}.`;
    
            const dataModel = converter.fromHTTPRequest(request);

            const collection = getCollectionFromPath(this.db!, fullPath, true).withConverter(converter);
            const docRef = doc(collection, docId);

            try {
                await setDoc(docRef, dataModel);
                responseMsg = `Successfully created item document ${fullPath}`;
                console.log(responseMsg);
            } catch (error) {
                console.log(error);
            } finally {
                response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
            }
        }

    /** Updates a document in the collection with the fields in the body of the request with a random id. 
     * Responds with the path to the updated document if successful or with an error message.
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    async put(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}...`);

        var responseMsg:DocumentData|string = `Error updating ${fullPath}`;

        const collection = getCollectionFromPath(this.db!, fullPath, true).withConverter(converter);
        const docRef = doc(collection, getDocIDFromPath(fullPath));

        try {
            const itemDoc = await getDoc(docRef);
            const item = converter.fromFirestoreDoc(itemDoc);
            item.updateFromData(request.body);
            const updatedItem = converter.toFirestore(item);

            await updateDoc(docRef, updatedItem);

            responseMsg = `Successfully updated item document ${fullPath}`;
            console.log(responseMsg);
        } catch (error) {
            console.log(error);
        } finally {
            response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
        }
    }

    /** Registers the DB to pull data from. */
    public registerDB(db: Firestore) {
        this.db = db;
    }

}