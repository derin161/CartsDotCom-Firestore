import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import { DataModel } from "./DataModel";
import { DataModelConverter } from "./DataModelConverter";

/** Default item data to use if any field isn't passed into the body of a POST request. */
export class ItemModel extends DataModel  {
    fromFirebaseDocument(data: DocumentData): DataModel {
        return new ItemModel(data.description, data.id, data.imageUrl, data.name, data.price, data.quantity);
    }
    public getFirebaseObject() {
        return {
            description: this.description, 
            id: this.id,
            imageUrl: this.imageUrl,
            name: this.name,
            price: this.price,
            quantity: this.quantity,
        };
    }

    constructor(
        private description: string = 'Empty Description',
        private id: number = -1,
        private imageUrl: string = 'No image URL provided',
        private name: string = 'Empty Name',
        private price: number = -1,
        private quantity: number = -1,
    ) {
        super();
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
    public get Id(): number {
        return this.id;
    }
    public set Id(value: number) {
        this.id = value;
    }
    public get Description(): string {
        return this.description;
    }
    public set Description(value: string) {
        this.description = value;
    }

    public static get dbConverter():DataModelConverter<ItemModel> {
        return ItemModel.mDbConverter;
    }

    static mDbConverter:DataModelConverter<ItemModel> = {
        toFirestore(item: ItemModel): DocumentData {
            return {
               description: item.Description, 
               id: item.Id,
               imageUrl: item.ImageUrl,
               name: item.Name,
               price: item.Price,
               quantity: item.Quantity,
           };
       },
       fromFirestore(
         snapshot: QueryDocumentSnapshot,
         options: SnapshotOptions
       ): ItemModel {
         const data = snapshot.data(options)!;
         return new ItemModel(data.description, data.id, data.imageUrl, data.name, data.price, data.quantity);
       },
   
       fromFirestoreDoc(
           snapshot: DocumentSnapshot<DocumentData>): ItemModel {
           const data = snapshot.data()!;
           return new ItemModel(data.description, data.id, data.imageUrl, data.name, data.price, data.quantity);
         }
    };

    public update(description: string | undefined, id: number | undefined, imageUrl: string | undefined, name: string | undefined,
                    price: number | undefined, quantity: number | undefined,) {
                        if (description != undefined) {
                            this.Description = description;
                        }
                        if (id != undefined) {
                            this.Id = id;
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



