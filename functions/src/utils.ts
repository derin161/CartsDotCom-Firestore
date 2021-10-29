import { firestore } from "firebase-admin";

/** Utility functions that may be used by other functions serving HTTPS requests on Cloud Firestore. */

///////////////////////////////// DATA /////////////////////////////////////

export const USERS_COLL_NAME = 'users';
export const TESTS_APP_NAME = 'tests';
export const ORDERS_COLL_NAME = 'orders';

///////////////////////////////// END DATA /////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Updates a simple (not a map or a list) field giving it a new value of fieldValue if fieldValue is not null or undefined. */
export async function updateDocSimpleField(doc: firestore.DocumentReference<firestore.DocumentData>, field: string, fieldValue: any) {
    if (fieldValue != null && fieldValue != undefined) {
        var update: any = {};
        update[field] = fieldValue;
        await doc.update(update);
        var msg = 'Successfully updated ' + field + ' with value ' + fieldValue + '.';
    } else {
        var msg = 'Failed to or received no update for ' + field + ' with value ' + fieldValue + '.';
    }
    console.log(msg);
}

/** Updates a map field updating all the values in the map fieldValue if fieldValue is not undefined. */
export async function updateDocMapField(doc: firestore.DocumentReference<firestore.DocumentData>, field: string, fieldValue: any) {
    if (fieldValue != undefined) {
        var updatedMap = (await doc.get()).get(field);
        console.log(updatedMap, fieldValue)
        const updatesToMake = new Map(Object.entries(fieldValue));
        for (let [key, value] of updatesToMake) {
            updatedMap[key] = value;
        }

        var update: any = {};
        update[field] = updatedMap;
        await doc.update(update);
    }
}

/** Converts a map from Firestore to a typescript map. */
export function getMappedValues(map:any): Map<any,any> {
    var tempMap = new Map<any,any>();
    for (const [key, value] of Object.entries(map)) {
        tempMap.set(key, value);
    }
    return tempMap;
}

///////////////////////////////////////////////////////////////

