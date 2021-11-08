import { doc, DocumentData,  getDoc, setDoc, } from "@firebase/firestore";
import { https } from "firebase-functions/v1";
import { addDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { DBSingleton } from "./DBSingleton";
import { DataModel } from "./models/DataModel";
import { DataModelConverter } from "./models/DataModelConverter";
import { getCollectionFromPath, getDocIDFromPath } from "./utils";

/** Singleton helper class for standard GET, POST, PUT requests using custom DataModel object converters. */
export class StandardRequests {
    
    private static instance:StandardRequests = new StandardRequests();

    public static get Instance() {
        return this.instance;
    }

    private constructor() {}

    /** Sends a response containing the requested document fields in a JSON format, or an error message if one occurs.
     * 
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    public async readDoc(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}...`);

        var responseMsg:DocumentData|string = `Error getting ${fullPath}`;

        const collection = getCollectionFromPath(DBSingleton.Instance.DB!, fullPath, true).withConverter(converter);
        const docId = getDocIDFromPath(fullPath);

        try {
            const document = await getDoc(doc(collection, docId));
            if (document.exists()) { 
                responseMsg = document.data().toResponseJSON();
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
     * 
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    async createDoc(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}...`);

        var responseMsg: string = `Error creating document at ${fullPath}.`;

        const dataModel = converter.fromHTTPRequest(request);
        const collection = getCollectionFromPath(DBSingleton.Instance.DB!, fullPath, false).withConverter(converter);
        try {
            const document = await addDoc(collection, await dataModel);
            responseMsg = `Successfully created item document ${fullPath}${document.id}`;
            console.log(responseMsg);
        } catch (error) {
            console.log(error);
        } finally {
            response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
        }
    }

    /** Creates a document in the collection with the fields in the body of the request with a given id. 
     * Responds with the path to the newly created document if successful or with an error message.
     * 
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>/<id>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    async createWithID(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        const docId = getDocIDFromPath(fullPath);

        console.log(`Processing ${request.method} request to ${fullPath}`);

        var responseMsg: string = `Error creating document at ${fullPath}.`;

        const dataModel = converter.fromHTTPRequest(request);

        const collection = getCollectionFromPath(DBSingleton.Instance.DB!, fullPath, true).withConverter(converter);
        const docRef = doc(collection, docId);

        try {
            await setDoc(docRef, await dataModel);
            responseMsg = `Successfully created item document ${fullPath}`;
            console.log(responseMsg);
        } catch (error) {
            console.log(error);
        } finally {
            response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
        }
    }

    /** Updates a document in the collection with the fields in the body of the request with a given id. 
     * Responds with the path to the updated document if successful or with an error message.
     * 
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    async updateDoc(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}...`);

        var responseMsg:DocumentData|string = `Error updating ${fullPath}`;

        const collection = getCollectionFromPath(DBSingleton.Instance.DB!, fullPath, true).withConverter(converter);
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

    /** Sends a response containing an array of the requested documents in the collection in a JSON format, 
     * or an error message if one occurs.
     * 
     * @param request the incoming HTTPS request with the path to a document within /<rootCollName>
     * @param response the response to send
     * @param rootCollName the root collection (e.g. users) to search in
     * @param converter the adapter to use when transferring data to/from the database
     * 
     */
    public async readCollec(request: https.Request, response: any, rootCollName:string, converter:DataModelConverter<DataModel>) {
        const fullPath = `/${rootCollName}${request.path}`;
        console.log(`Processing ${request.method} request to ${fullPath}...`);

        var responseMsg:DocumentData[]|string = `Error getting ${fullPath}`;

        try {
            const collection = getCollectionFromPath(DBSingleton.Instance.DB!, fullPath, false).withConverter(converter);
            const docsQuery = (await getDocs(query(collection))).docs;

            const docs:DocumentData[] = [];

            docsQuery.forEach(doc => docs.push(doc.data().toResponseJSON()));
            responseMsg = docs;
        } catch (error) {
            console.log(error);
            //Response already has an error message
        } finally {
            response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
        }
    }

}
