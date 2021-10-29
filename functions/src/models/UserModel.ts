import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { auth } from "firebase-admin";
import { https } from "firebase-functions/v1";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";

/** Class to model user data. */
export class UserModel extends DataModel  {

    private static converter:DataModelConverter<UserModel> = {
        toFirestore(item: UserModel): DocumentData {
            return item.getFirebaseObject();
        },

        fromFirestore(
            snapshot: QueryDocumentSnapshot,
            options: SnapshotOptions
        ): UserModel {
            const data = snapshot.data(options)!;
            return new UserModel(data.firstName, data.lastName, snapshot.id);
        },

        fromFirestoreDoc(
            snapshot: DocumentSnapshot<DocumentData>): UserModel {
            const data = snapshot.data()!;
            return new UserModel(data.firstName, data.lastName, snapshot.id);
        },

        fromHTTPRequest: function (request: https.Request): UserModel {
            return new UserModel(
                request.body.firstName,
                request.body.lastName,
            );
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
        uid:string = 'Empty Id',
    ) {
        super(uid);

        if (uid != 'Empty Id') {
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

    public updateFromHTTPRequest(request: https.Request) {
        const firstName = request.body.firstName;
        const lastName = request.body.lastName;

        if (firstName != undefined) {
            this.FirstName = firstName;
        }

        if (lastName != undefined) {
            this.FirstName = lastName;
        }
    }


};



