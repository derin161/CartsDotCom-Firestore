import { DocumentData } from "@firebase/firestore";

/** A model object for data that is stored in the Database. */
export abstract class DataModel {

    protected static DEFAULT_ID_ARG:string = "Empty Id";

    protected constructor(
        private id:string = DataModel.DEFAULT_ID_ARG,
    ) {

    }

    /** Returns a DocumentData object ready to be placed into the Firestore DB. */
    public abstract getFirebaseObject() : DocumentData;

    /** Performs an update on a DataModel object, updating all fields in the DataModel from the properties of the object passed in. */
    public abstract updateFromData(data:any) : void;

    public get Id(): string {
        return this.id;
    }
    public set Id(value: string) {
        this.id = value;
    }
}