import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { auth } from "firebase-admin";
import { https } from "firebase-functions/v1";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";

/** Class to model user data. */
export class UserModel extends DataModel  {

    /** Adapter used to exchange UserModel objects with other forms. */
    private static converter:DataModelConverter<UserModel> = {
        toFirestore(user: UserModel): DocumentData {
            return user.toFirestoreJSON();
        },

        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserModel {
            return UserModel.getModel(snapshot.data(options)!, snapshot.id);
        },

        fromFirestoreDoc(snapshot: DocumentSnapshot<DocumentData>): UserModel {
            return UserModel.getModel(snapshot.data()!, snapshot.id);
        },

        fromHTTPRequest (request: https.Request): UserModel {
            return UserModel.getModel(request.body);
        },

        fromHTTPResponse (response: any): UserModel {
            return UserModel.getModel(response, response[DataModel.ID_FIELD_NAME]);
        }
    };

    /** Gets the user email from Firestore Auth.
     * @param uid the uid of the user to get the email for
     * @returns a promise containing the user's email
     */
    private static async getUserEmail(uid:string) : Promise<string> {
        const user = await auth().getUser(uid);
        return user.email!;
    }

    private static readonly FIRST_NAME_FIELD_NAME:string = 'firstName';
    private static readonly LAST_NAME_FIELD_NAME:string = 'lastName';

    /** Returns a OrderModel object with the given docId (or DataModel.DEFAULT_ID_ARG if left undefined) 
     * and the properties from data matching those in the OrderModel.
     * 
     * @param data the data sharing properties with the OrderModel to extract data from
     * @param docId the id to use with this OrderModel
     * @returns a OrderModel object with the given docId (or DataModel.DEFAULT_ID_ARG) and the properties from data
     * matching those in the OrderModel
     */
    public static getModel(data: any, docId:string|undefined = undefined): UserModel {
        return new UserModel(
            data[UserModel.FIRST_NAME_FIELD_NAME],
            data[UserModel.LAST_NAME_FIELD_NAME],
            docId
        );
    }

    /** The adapter used to convert UserModels to other forms. */
    public static get Converter():DataModelConverter<UserModel> {
        return UserModel.converter;
    }

    private email: string = 'Empty Email';

    /** Builds an OrderModel object with the given properties. */
    constructor(
        private firstName: string = 'Empty First Name',
        private lastName: string = 'Empty Last Name',
        uid:string|undefined = undefined, //Defaulting to undefined keeps single point of control over default value in DataModel class
    ) {
        super(uid);

        if (uid != undefined) {
           UserModel.getUserEmail(uid)
            .then(value => { this.email = value});
        }
    }

    public getStandardJSON() : any {
        var json:any = {};

        json[UserModel.FIRST_NAME_FIELD_NAME] = this.firstName;
        json[UserModel.LAST_NAME_FIELD_NAME] = this.lastName;

        return json;
    }

    public toResponseJSON() : any {
        var json:any = this.getStandardJSON();
        
        json[DataModel.ID_FIELD_NAME] = this.id;

        return json;
    }

    public toFirestoreJSON() : DocumentData {
        var json:any = this.getStandardJSON();
        
        return json;
    }

    public updateFromData(data: any) {
        const firstName = data[UserModel.FIRST_NAME_FIELD_NAME];
        const lastName = data[UserModel.LAST_NAME_FIELD_NAME];

        if (firstName != undefined) {
            this.FirstName = firstName;
        }

        if (lastName != undefined) {
            this.FirstName = lastName;
        }
    }

    
    public get FirstName(): string {
        return this.firstName;
    }

    public set FirstName(value: string) {
        this.firstName = value;
    }

    public get LastName(): string {
        return this.lastName;
    }

    public set LastName(value: string) {
        this.lastName = value;
    }

    public get Email(): string {
        return this.email;
    }

};



