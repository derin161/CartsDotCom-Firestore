import { https } from "firebase-functions/v1";
import { DocumentData, DocumentSnapshot, FirestoreDataConverter } from "firebase/firestore";

/** Extends the FirestoreDataConverter interface for additional functionality 
 * beyond those necessary to provide to the Firebase SDK for transferring
 * custom data objects to and from Cloud Firestore.
 */
export interface DataModelConverter<DataModel> extends FirestoreDataConverter<DataModel> {
  /** Returns a DataModel object taken from a DocumentSnapshot (as opposed to a DocumentQuerySnapshot). 
   * 
   * @param snapshot a DocumentSnapshot containing DocumentData with fields corresponding to the names of the
   * fields of the Datamodel
   * @returns a DataModel (or a promise containg a DataModel if async) with fields populated
   * with data from the the DocumentData in snapshot 
   */
  fromFirestoreDoc(snapshot: DocumentSnapshot<DocumentData>): DataModel;

  /** Returns a DataModel object taken from an https.Request which has fields by the 
   * same name as the fields in the parameterized DataModel of the DataModelConverter. 
   * 
   * @param request the http.request with an  http.request.body with fields by the same name of the fields
   * in the DataModel
   * @returns a DataModel (or a promise containg a DataModel if async) with fields populated
   * with data from the body of the request 
   */
  fromHTTPRequest(request:https.Request): Promise<DataModel> | DataModel;

  /** Returns a DataModel object taken from a response which has fields by the 
   * same name as the fields in the parameterized DataModel of the DataModelConverter.
   * 
   * @param response an object containing fields by the same name as the fields in the DataModel
   * @returns a DataModel (or a promise containg a DataModel if async) with fields populated
   * with data from the response 
   */
  fromHTTPResponse(response:any): Promise<DataModel> | DataModel;
}