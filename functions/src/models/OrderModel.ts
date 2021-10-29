import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { https } from "firebase-functions/v1";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";

/** Class to model user order data. */
export class OrderModel extends DataModel  {

    private static converter:DataModelConverter<OrderModel> = {
        toFirestore(item: OrderModel): DocumentData {
            return item.getFirebaseObject();
        },

        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): OrderModel {
            return OrderModel.getModel(snapshot.data(options)!, snapshot.id);
        },

        fromFirestoreDoc(snapshot: DocumentSnapshot<DocumentData>): OrderModel {
            return OrderModel.getModel(snapshot.data()!, snapshot.id);
        },

        fromHTTPRequest: function (request: https.Request): OrderModel {
            return OrderModel.getModel(request.body);
        }
    };

    

    constructor(
        private streetAddress:string = "Empty Address",
        private state:string = "Empty State",
        private zipCode:string = "Empty ZipCode",
        private country:string = "Empty Country",
        private totalCost:number = -1,
        private shippingMethod:string = "Empty Shipping Method",
        private timestamp:number = -1,
        id:string|undefined = undefined, //Defaulting to undefined keeps single point of control over default value in DataModel class
    ) {
        super(id);
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
    
    public static get Converter():DataModelConverter<OrderModel> {
        return OrderModel.converter;
    }

    public static getModel(data: any, docId:string|undefined = undefined) : OrderModel {
        
        return new OrderModel(
            data.streetAddress,
            data.state,
            data.zipCode,
            data.country,
            data.totalCost,
            data.shippingMethod,
            data.timestamp,
            docId,
        );
    }

    public getFirebaseObject() : DocumentData {
        return {
            country: this.country,
            shippingMethod: this.shippingMethod,
            state: this.state,
            streetAddress: this.streetAddress,
            timestamp: this.timestamp,
            totalCost: this.totalCost,
            zipCode: this.zipCode,
        };
    }

    public updateFromData(data: any) {
        const country = data.country;
        const shippingMethod = data.shippingMethod;
        const state = data.state;
        const streetAddress = data.streetAddress;
        const timestamp = data.timestamp;
        const totalCost = data.totalCost;
        const zipCode = data.zipCode;

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

    }


};



