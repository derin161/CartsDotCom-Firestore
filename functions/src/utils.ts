/** Utility functions that may be used by other functions serving HTTPS requests on Cloud Firestore. */

import { CollectionReference, DocumentData, collection, Firestore } from "@firebase/firestore";

///////////////////////////////// DATA /////////////////////////////////////

export const USERS_COLL_NAME = 'users';
export const TESTS_APP_NAME = 'tests';
export const ORDERS_COLL_NAME = 'orders';
export const INVENTORY_COLL_NAME = 'inventory';

///////////////////////////////// END DATA /////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Converts a map from Firestore to a typescript map. */
export function getMappedValues(map:any): Map<any,any> {
    var tempMap = new Map<any,any>();
    for (const [key, value] of Object.entries(map)) {
        tempMap.set(key, value);
    }
    return tempMap;
}

export function getCollectionFromPath(db:Firestore, fullPath:string, pathEndsWithDocId: boolean) : CollectionReference<DocumentData> {
    //trim off doc id
    var collPath = fullPath;
    if (pathEndsWithDocId) {
        collPath = collPath.substring(0, fullPath.lastIndexOf('/'));
    }
    return collection(db, collPath);
}

export function getDocIDFromPath(fullPath:string) : string {
    //trim off doc id
    return fullPath.substring(fullPath.lastIndexOf('/') + 1).trim();
}

///////////////////////////////////////////////////////////////

