import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { https } from "firebase-functions/v1";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";
import { ItemModel } from "./ItemModel";

/** Class to model user order data. */
export class OrderModel extends DataModel  {

    /** Adapter used to exchange OrderModel objects with other forms. */
    private static converter:DataModelConverter<OrderModel> = {
        toFirestore(order: OrderModel): DocumentData {
            return order.toFirestoreJSON();
        },

        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): OrderModel {
            return OrderModel.getModel(snapshot.data(options)!, snapshot.id);
        },

        fromFirestoreDoc(snapshot: DocumentSnapshot<DocumentData>): OrderModel {
            return OrderModel.getModel(snapshot.data()!, snapshot.id);
        },

        fromHTTPRequest (request: https.Request): OrderModel {
            return OrderModel.getModel(request.body);
        },

        fromHTTPResponse (response: any): OrderModel {
            return OrderModel.getModel(response, response[DataModel.ID_FIELD_NAME]);
        }
    };

    private static readonly STREET_ADDRESS_FIELD_NAME:string = 'streetAddress';
    private static readonly STATE_FIELD_NAME:string = 'state';
    private static readonly ZIP_CODE_FIELD_NAME:string = 'zipCode';
    private static readonly COUNTRY_FIELD_NAME:string = 'country';
    private static readonly TOTAL_COST_FIELD_NAME:string = 'totalCost';
    private static readonly SHIPPING_METHOD_FIELD_NAME:string = 'shippingMethod';
    private static readonly TIMESTAMP_FIELD_NAME:string = 'timestamp';
    private static readonly ITEMS_ORDERED_FIELD_NAME:string = 'itemsOrdered';
    
    /** The adapter used to convert OrderModels to other forms. */
    public static get Converter():DataModelConverter<OrderModel> {
        return OrderModel.converter;
    }

    /** Returns a OrderModel object with the given docId (or DataModel.DEFAULT_ID_ARG if left undefined) 
     * and the properties from data matching those in the OrderModel.
     * 
     * @param data the data sharing properties with the OrderModel to extract data from
     * @param docId the id to use with this OrderModel
     * @returns a OrderModel object with the given docId (or DataModel.DEFAULT_ID_ARG) and the properties from data
     * matching those in the OrderModel
     */
    public static getModel(data: any, docId:string|undefined = undefined) : OrderModel {
        const order = new OrderModel(
            data[OrderModel.STREET_ADDRESS_FIELD_NAME],
            data[OrderModel.STATE_FIELD_NAME],
            data[OrderModel.ZIP_CODE_FIELD_NAME],
            data[OrderModel.COUNTRY_FIELD_NAME],
            data[OrderModel.TOTAL_COST_FIELD_NAME],
            data[OrderModel.SHIPPING_METHOD_FIELD_NAME],
            data[OrderModel.TIMESTAMP_FIELD_NAME],
            data[OrderModel.ITEMS_ORDERED_FIELD_NAME],
            docId,
        );
        
        return order;
    }

    /** Builds an OrderModel object with the given properties. */
    constructor(
        private streetAddress:string = "Empty Address",
        private state:string = "Empty State",
        private zipCode:string = "Empty ZipCode",
        private country:string = "Empty Country",
        private totalCost:number = -1,
        private shippingMethod:string = "Empty Shipping Method",
        private timestamp:number = -1,
        private itemsOrdered:ItemModel[] = [],
        id:string|undefined = undefined, //Defaulting to undefined keeps single point of control over default value in DataModel class
    ) {
        super(id);
    }

    public getStandardJSON() : any {
        var json:any = {};

        json[OrderModel.STREET_ADDRESS_FIELD_NAME] = this.streetAddress;
        json[OrderModel.STATE_FIELD_NAME] = this.state;
        json[OrderModel.ZIP_CODE_FIELD_NAME] = this.zipCode;
        json[OrderModel.COUNTRY_FIELD_NAME] = this.country;
        json[OrderModel.TOTAL_COST_FIELD_NAME] = this.totalCost;
        json[OrderModel.SHIPPING_METHOD_FIELD_NAME] = this.shippingMethod;
        json[OrderModel.TIMESTAMP_FIELD_NAME] = this.timestamp;
        json[OrderModel.ITEMS_ORDERED_FIELD_NAME] = this.itemsOrdered;

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
        const country = data[OrderModel.COUNTRY_FIELD_NAME];
        const shippingMethod = data[OrderModel.SHIPPING_METHOD_FIELD_NAME];
        const state = data[OrderModel.STATE_FIELD_NAME];
        const streetAddress = data[OrderModel.STREET_ADDRESS_FIELD_NAME];
        const timestamp = data[OrderModel.TIMESTAMP_FIELD_NAME];
        const totalCost = data[OrderModel.TOTAL_COST_FIELD_NAME];
        const zipCode = data[OrderModel.ZIP_CODE_FIELD_NAME];
        const itemsOrdered = data[OrderModel.ITEMS_ORDERED_FIELD_NAME];

        if (country != undefined) {
            this.country = country;
        }

        if (shippingMethod != undefined) {
            this.shippingMethod = shippingMethod;
        }

        if (state != undefined) {
            this.state = state;
        }

        if (streetAddress != undefined) {
            this.streetAddress = streetAddress;
        }

        if (timestamp != undefined) {
            this.timestamp = timestamp;
        }

        if (totalCost != undefined) {
            this.totalCost = totalCost;
        }

        if (zipCode != undefined) {
            this.zipCode = zipCode;
        }

        if (itemsOrdered != undefined) {
            this.itemsOrdered = itemsOrdered;
        }

    }

    public get StreetAddress(): string {
        return this.streetAddress;
    }

    public set StreetAddress(value: string) {
        this.streetAddress = value;
    }

    public get State(): string {
        return this.state;
    }

    public set State(value: string) {
        this.state = value;
    }

    public get ZipCode(): string {
        return this.zipCode;
    }

    public set ZipCode(value: string) {
        this.zipCode = value;
    }

    public get Country(): string {
        return this.country;
    }

    public set Country(value: string) {
        this.country = value;
    }

    public get TotalCost(): number {
        return this.totalCost;
    }

    public set TotalCost(value: number) {
        this.totalCost = value;
    }

    public get ShippingMethod(): string {
        return this.shippingMethod;
    }

    public set ShippingMethod(value: string) {
        this.shippingMethod = value;
    }

    public get Timestamp(): number {
        return this.timestamp;
    }

    public set Timestamp(value: number) {
        this.timestamp = value;
    }

    public get ItemsOrdered(): ItemModel[] {
        return this.itemsOrdered;
    }

    public set ItemsOrdered(value: ItemModel[]) {
        this.itemsOrdered = value;
    }
};
