import { DocumentData } from "@firebase/firestore";
import { https } from "firebase-functions/v1";

export abstract class DataModel {

    protected constructor(
        private id:string = 'Empty Id',
    ) {

    }

    public abstract getFirebaseObject() : DocumentData;
    public abstract updateFromHTTPRequest(request:https.Request) : void;

    public get Id(): string {
        return this.id;
    }
    public set Id(value: string) {
        this.id = value;
    }
}