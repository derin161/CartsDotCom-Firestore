import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { auth } from "firebase-admin";
import { https } from "firebase-functions/v1";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";

/** Class to model user data. */
export class UserModel extends DataModel  {
    public static getModel(data: any, docId:string|undefined = undefined): UserModel {
        return new UserModel(
            data.firstName,
            data.lastName,
            docId
        );
    }

    private static converter:DataModelConverter<UserModel> = {
        toFirestore(item: UserModel): DocumentData {
            return item.getFirebaseObject();
        },

        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserModel {
            return UserModel.getModel(snapshot.data(options)!, snapshot.id);
        },

        fromFirestoreDoc(snapshot: DocumentSnapshot<DocumentData>): UserModel {
            return UserModel.getModel(snapshot.data()!, snapshot.id);
        },

        fromHTTPRequest: function (request: https.Request): UserModel {
            return UserModel.getModel(request.body);
        }
    };

    private static async getUserEmail(uid:string) : Promise<string> {
        const user = await auth().getUser(uid);
        return user.email!;
    }

    private email: string = 'Empty Email';

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
    
    public static get Converter():DataModelConverter<UserModel> {
        return UserModel.converter;
    }

    public getFirebaseObject() : DocumentData {
        return {
            firstName: this.FirstName,
            lastName: this.LastName,
        };
    }

    public updateFromData(data: any) {
        const firstName = data.firstName;
        const lastName = data.lastName;

        if (firstName != undefined) {
            this.FirstName = firstName;
        }

        if (lastName != undefined) {
            this.FirstName = lastName;
        }
    }


};



