import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { https } from "firebase-functions/v1";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";

/** Class to model item data. */
export class ItemModel extends DataModel  {

    private static converter:DataModelConverter<ItemModel> = {
        toFirestore(item: ItemModel): DocumentData {
            return item.getFirebaseObject();
        },

        fromFirestore(
            snapshot: QueryDocumentSnapshot,
            options: SnapshotOptions
        ): ItemModel {
            const data = snapshot.data(options)!;
            return new ItemModel( data.description, data.imageUrl, data.name, data.price, data.quantity, snapshot.id);
        },

        fromFirestoreDoc(
            snapshot: DocumentSnapshot<DocumentData>): ItemModel {
            const data = snapshot.data()!;
            return new ItemModel( data.description, data.imageUrl, data.name, data.price, data.quantity, snapshot.id);
        },

        fromHTTPRequest: function (request: https.Request): ItemModel {
            return new ItemModel(
                request.body.description,
                request.body.imageUrl,
                request.body.name,
                request.body.price,
                request.body.quantity,
            );
        }
    };

    constructor(
        private description: string = 'Empty Description',
        private imageUrl: string = 'No image URL provided',
        private name: string = 'Empty Name',
        private price: number = -1,
        private quantity: number = -1,
        id:string = 'Empty Id',
    ) {
        super(id);
    }

    public get Quantity(): number {
        return this.quantity;
    }
    public set Quantity(value: number) {
        this.quantity = value;
    }
    public get Price(): number {
        return this.price;
    }
    public set Price(value: number) {
        this.price = value;
    }
    public get Name(): string {
        return this.name;
    }
    public set Name(value: string) {
        this.name = value;
    }
    public get ImageUrl(): string {
        return this.imageUrl;
    }
    public set ImageUrl(value: string) {
        this.imageUrl = value;
    }

    public get Description(): string {
        return this.description;
    }
    public set Description(value: string) {
        this.description = value;
    }

    public static get Converter():DataModelConverter<ItemModel> {
        return ItemModel.converter;
    }

    public getFirebaseObject() : DocumentData {
        return {
            description: this.description,
            imageUrl: this.imageUrl,
            name: this.name,
            price: this.price,
            quantity: this.quantity,
        };
    }

    public updateFromHTTPRequest(request: https.Request) {
        const description = request.body.description;
        const imageUrl = request.body.imageUrl;
        const name = request.body.name;
        const price = request.body.price;
        const quantity = request.body.quantity;

                        if (description != undefined) {
                            this.Description = description;
                        }

                        if (imageUrl != undefined) {
                            this.ImageUrl = imageUrl;
                        }
                        if (name != undefined) {
                            this.Name = name;
                        }
                        if (price != undefined) {
                            this.Price = price;
                        }
                        if (quantity != undefined) {
                            this.Quantity = quantity;
                        }
    }


};



