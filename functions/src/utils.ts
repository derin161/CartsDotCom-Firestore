import { collection, CollectionReference, DocumentData, Firestore } from "firebase/firestore";

/** Utility functions that may be useful for serving HTTPS requests. */

///////////////////////////////// DATA /////////////////////////////////////

export const INVENTORY_COLL_NAME = 'inventory';
export const ORDERS_COLL_NAME = 'orders';
export const USERS_COLL_NAME = 'users';
export const TESTS_APP_NAME = 'tests';
export const BASE_REQUEST_URL = 'http://localhost:5001/cartsdotcom/us-central1';
export const FUNCTIONS_ROUTING_NAME = 'functions'

///////////////////////////////// END DATA /////////////////////////////////


///////// FUNCTIONS /////////////////////////////////////////////////////

/** Returns a CollectionReference given the fullPath to the collection.
 * @param db an instance of the Firestore db
 * @param fullPath the full path to the collection in the db
 * @param pathEndsWithDocId will remove the last item from the path (the document id) if true
 */
export function getCollectionFromPath(db:Firestore, fullPath:string, pathEndsWithDocId: boolean) : CollectionReference<DocumentData> {
    var collPath = fullPath;
    if (pathEndsWithDocId) { //trim off doc id
        collPath = collPath.substring(0, fullPath.lastIndexOf('/'));
    }
    return collection(db, collPath);
}

/** Gets the last element from a path (the document id).
 * e.g. /users/123 would return 123.
 * 
 * @param fullPath the full path to the document in the db
 * @returns the string representing the document id on the end of the path
 */
export function getDocIDFromPath(fullPath:string) : string {
    //trim off doc id
    return fullPath.substring(fullPath.lastIndexOf('/') + 1).trim();
}

/** Sets a map 'cleanly'. That is, the set of keys in destMap will remain unchanged, 
 * and only the values of keys in the intersection of both key sets will be set in destMap.
 * 
 * @param srcMap the map to set values from
 * @param destMap the map to update the values with a key that also exists in srcMap
 */
export function cleanSetMap(srcMap:Map<any, any>, destMap: Map<any, any>) {
    destMap.forEach((val, key) => {
        if (srcMap.has(key)) {
            destMap.set(key, srcMap.get(key));
        }
    });
}

/** Converts a map from JSON to a typescript map. 
 * 
 * @param JSONMap the JSON to convert from
 * @returns a Map with keys and values taken from the JSON
*/
export function jsonToMap(JSONMap:any): Map<any,any> {
    const tempMap = new Map<any,any>();
    for (const [key, value] of Object.entries(JSONMap)) {
        tempMap.set(key, value);
    }
    return tempMap;
}

/** Converts a typescript map to a JSON form. 
 * 
 * @param map a typescript map
 * @returns a JSON representing the given map
*/
export function mapToJson(map:Map<any, any>) {
    const JSONMap:any = {};
    map.forEach((val, key) => {
        JSONMap[key] = val;
    });
    return JSONMap;
}



///////////////////////////////////////////////////////////////

