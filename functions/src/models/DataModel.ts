import { DocumentData } from "@firebase/firestore";
import { https } from "firebase-functions/v1";

/** A model object for data that is stored in the Database. */
export abstract class DataModel {

    protected constructor(
        private id:string = 'Empty Id',
    ) {

    }

    /** Returns a DocumentData object ready to be placed into the Firestore DB. */
    public abstract getFirebaseObject() : DocumentData;

    /** Performs an update on a DataModel object, updating all fields in the DataModel from the parameters in body of the http.Request that are not undefined. */
    public abstract updateFromHTTPRequest(request:https.Request) : void;

    public get Id(): string {
        return this.id;
    }
    public set Id(value: string) {
        this.id = value;
    }
}