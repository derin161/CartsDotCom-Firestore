import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { https } from "firebase-functions/v1";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";

/** Class to model item data. */
export class ItemModel extends DataModel  {

    /** Adapter used to exchange ItemModel objects with other forms. */
    private static converter:DataModelConverter<ItemModel> = {
        toFirestore(item: ItemModel): DocumentData {
            return item.toFirestoreJSON();
        },

        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ItemModel {
            return ItemModel.getModel(snapshot.data(options)!, snapshot.id);
        },

        fromFirestoreDoc(snapshot: DocumentSnapshot<DocumentData>): ItemModel {
            return ItemModel.getModel(snapshot.data()!, snapshot.id);
        },

        fromHTTPRequest (request: https.Request): ItemModel {
            return ItemModel.getModel(request.body);
        },

        fromHTTPResponse (response: any): ItemModel {
            return ItemModel.getModel(response, response[DataModel.ID_FIELD_NAME]);
        }
    };

    private static readonly DESCRIPTION_FIELD_NAME:string = 'description';
    private static readonly IMAGE_URL_FIELD_NAME:string = 'imageUrl';
    private static readonly NAME_FIELD_NAME:string = 'name';
    private static readonly PRICE_FIELD_NAME:string = 'price';
    private static readonly QUANTITY_FIELD_NAME:string = 'quantity';
    
    /** Returns a ItemModel object with the given docId (or DataModel.DEFAULT_ID_ARG if left undefined) 
     * and the properties from data matching those in the ItemModel.
     * 
     * @param data the data sharing properties with the ItemModel to extract data from
     * @param docId the id to use with this ItemModel
     * @returns a ItemModel object with the given docId (or DataModel.DEFAULT_ID_ARG) and the properties from data
     * matching those in the ItemModel
     */
    public static getModel(data: any, docId:string|undefined = undefined) : ItemModel {
        const item = new ItemModel(
            data[ItemModel.DESCRIPTION_FIELD_NAME],
            data[ItemModel.IMAGE_URL_FIELD_NAME],
            data[ItemModel.NAME_FIELD_NAME],
            data[ItemModel.PRICE_FIELD_NAME],
            data[ItemModel.QUANTITY_FIELD_NAME],
            docId,
        );
        return item;
    }

    /** The adapter used to convert ItemModel to other forms. */
    public static get Converter():DataModelConverter<ItemModel> {
        return ItemModel.converter;
    }

    /** Builds a ItemModel object with the given properties. */
    constructor(
        private description: string = 'Empty Description',
        private imageUrl: string = 'No image URL provided',
        private name: string = 'Empty Name',
        private price: number = -1,
        private quantity: number = -1,
        id:string|undefined = undefined, //Defaulting to undefined keeps single point of control over default value in DataModel class
    ) {
        super(id);
    }

    public getStandardJSON() : any {
        var json:any = {};

        json[ItemModel.DESCRIPTION_FIELD_NAME] = this.description;
        json[ItemModel.IMAGE_URL_FIELD_NAME] = this.imageUrl;
        json[ItemModel.NAME_FIELD_NAME] = this.name;
        json[ItemModel.PRICE_FIELD_NAME] = this.price;
        json[ItemModel.QUANTITY_FIELD_NAME] = this.quantity;

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
        const description = data[ItemModel.DESCRIPTION_FIELD_NAME];
        const imageUrl = data[ItemModel.IMAGE_URL_FIELD_NAME];
        const name = data[ItemModel.NAME_FIELD_NAME];
        const price = data[ItemModel.PRICE_FIELD_NAME];
        const quantity = data[ItemModel.QUANTITY_FIELD_NAME];

        if (description != undefined) {
            this.description = description;
        }

        if (imageUrl != undefined) {
            this.imageUrl = imageUrl;
        }
        if (name != undefined) {
            this.name = name;
        }
        if (price != undefined) {
            this.price = price;
        }
        if (quantity != undefined) {
            this.quantity = quantity;
        }
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

};
