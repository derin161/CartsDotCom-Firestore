import {https} from "firebase-functions";
import { INVENTORY_COLL_NAME } from "./utils";
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentSnapshot, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, updateDoc } from "@firebase/firestore";
import { getDoc } from "firebase/firestore";

/** Functions used for HTTPS requests on the /inventory collection. */

////////////////////////////////// DATA /////////////////////////////////////

/** Default item data to use if any field isn't passed into the body of a POST request. */
class ItemModel  {
    constructor(
        private description: string = 'Empty Description',
        private id: number = -1,
        private imageUrl: string = 'No image URL provided',
        private name: string = 'Empty Name',
        private price: number = -1,
        private quantity: number = -1,
    ) {
        
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

    public static get dbConverter():FirestoreDataConverter<ItemModel> {
        return ItemModel.mDbConverter;
    }

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

class mDbConverter implements FirestoreDataConverter<ItemModel> {
    toFirestore(item: ItemModel): DocumentData {
         return {
            description: item.Description, 
            id: item.Id,
            imageUrl: item.ImageUrl,
            name: item.Name,
            price: item.Price,
            quantity: item.Quantity,
        };
    }
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): ItemModel {
      const data = snapshot.data(options)!;
      return new ItemModel(data.description, data.id, data.imageUrl, data.name, data.price, data.quantity);
    }

    fromFirestore2(
        snapshot: DocumentSnapshot<DocumentData>,
        options: SnapshotOptions
      ): ItemModel {
        const data = snapshot.data(options)!;
        return new ItemModel(data.description, data.id, data.imageUrl, data.name, data.price, data.quantity);
      }
  };

const ITEM_ID_PARAM = 'itemId';

var INVENTORY_COLL_REF:CollectionReference<DocumentData>;

////////////////////////////////// END DATA /////////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Sends a response to containing the JSON document in the users collection
 *  with the given ID = request.params[ITEM_ID_PARAM] */
function getItem(request: https.Request, response: any) {
    const itemId = request.params[ITEM_ID_PARAM];
    console.log(`Processing ${request.method} request to /${INVENTORY_COLL_NAME}/${itemId}...`);
    var responseMsg:DocumentData|string = `Error getting /${INVENTORY_COLL_NAME}/${itemId}`;
    try {
        getDoc(doc(INVENTORY_COLL_REF, itemId)).then(value => {
            // fulfillment
            const docData = value.data();
            if (docData != undefined) { //document exists
                responseMsg = docData;
                console.log(`Successfully sent /${INVENTORY_COLL_NAME}/${itemId}.`);
            } else {
                responseMsg = `/${INVENTORY_COLL_NAME}/${itemId} not found`;
                console.log(responseMsg);
            }
            response.send(responseMsg);
          }, reason => {
            // rejection
            console.log(reason);
            response.send(responseMsg);
          });
    } catch (error) {
        console.log(error);
        response.send(responseMsg); //Be sure to end func call otherwise it may incur additional charges for not ending
    }
}

/** Updates all user fields passed into the body of the Request.  */
async function createItem(request: https.Request, response: any) {

    const item = new ItemModel(
                    request.body.description,
                    request.body.id,
                    request.body.imageUrl,
                    request.body.name,
                    request.body.price,
                    request.body.quantity,
                );
        
        addDoc(INVENTORY_COLL_REF, item).then(value => {
            const msg = `Successfully created item document /${INVENTORY_COLL_NAME}/${value.id}`;
            console.log(msg);
            response.send(msg);
          }, reason => {
            // rejection
            console.log(reason);
            response.send(`Error creating item.`);
          })
          .catch(error => {
            console.log(error);
            response.send(`Error creating item.`);
          });
}

/** Updates all user fields passed into the body of the Request.  */
async function updateItem(request: https.Request, response: any) {
    const itemId = request.params[ITEM_ID_PARAM];
        const x = await getDoc(doc(INVENTORY_COLL_REF, itemId));
        const item = ItemModel.dbConverter.fromFirestore(x);
        //(await getDoc(doc(INVENTORY_COLL_REF, itemId))).data()!;
        item.update(
                    request.body.description,
                    request.body.id,
                    request.body.imageUrl,
                    request.body.name,
                    request.body.price,
                    request.body.quantity,        
        );

        const updatedItem = ItemModel.dbConverter.toFirestore(item);

        updateDoc(doc(INVENTORY_COLL_REF, itemId), updatedItem).then(value => {
            const msg = `Successfully updated item document /${INVENTORY_COLL_NAME}/${itemId}`;
            console.log(msg);
            response.send(msg);
          }, reason => {
            // rejection
            console.log(reason);
            response.send(`Error updating item.`);
          })
          .catch(error => {
            console.log(error);
            response.send(`Error updating item.`);
          });
}

export function applyRouting(expressApps: Map<string, any>) {
    const app = expressApps.get(INVENTORY_COLL_NAME);
    app.get(`/:${ITEM_ID_PARAM}`, getItem);
    app.put(`/:${ITEM_ID_PARAM}`, updateItem);
    app.post(`/`, createItem);
}

export function registerDB(app: Firestore) {
    INVENTORY_COLL_REF = collection(app, INVENTORY_COLL_NAME).withConverter(ItemModel.dbConverter);
}

///////////////////////////////// END FUNCTIONS ///////////////////////////////////