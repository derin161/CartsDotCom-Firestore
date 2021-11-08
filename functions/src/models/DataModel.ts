import { DocumentData } from "@firebase/firestore";

/** A model object for data that is stored in the Database. */
export class DataModel {

    /** Default arg for the id field. */
    protected static readonly DEFAULT_ID_ARG:string = "Empty Id";
    public static readonly ID_FIELD_NAME:string = 'id';

    /** Creates a DataModel object with the given id, or an id equal to DataModel.DEFAULT_ID_ARG. */
    protected constructor(
        protected id:string = DataModel.DEFAULT_ID_ARG,
    ) {

    }

    /** Gives a JSON object with data representing this model
     *  ready to be sent out via HTTP response.
     * @returns a JSON object with data representing this model ready to be sent out via HTTP response
     */
    public toResponseJSON() : any { // Meant to be overriden in an extending class
        var json = this.getStandardJSON();

        json[DataModel.ID_FIELD_NAME] = this.id;

        return json;
    };

    /** Gives a DocumentData object ready to be placed into the Firestore DB.
     * @returns a DocumentData object ready to be placed into the Firestore DB
     */
    public toFirestoreJSON() : DocumentData { // Meant to be overriden in an extending class
        var json = this.getStandardJSON();

        return json;
    };

    /** Returns a JSON of standard data sent out to all endpoints.
     * @returns returns a JSON of standard data sent out to all endpoints
     */
    protected getStandardJSON() : any { // Meant to be overriden in an extending class
        var json:any = {};

        return json;
    }

    /** Performs an update on a DataModel object, updating all fields in the 
     * DataModel from the fields of the object passed in. 
     * @param data the data with fields of the same name as the name of the fields in this Datamodel
    */
    public updateFromData(data:any) : void { // Meant to be overriden in an extending class
        const id = data[DataModel.ID_FIELD_NAME];

        if (id != undefined) {
            this.id = id;
        }
    };

    public get Id(): string {
        return this.id;
    }
    public set Id(value: string) {
        this.id = value;
    }
}