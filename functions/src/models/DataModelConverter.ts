import { https } from "firebase-functions/v1";
import { DocumentData, DocumentSnapshot, FirestoreDataConverter } from "firebase/firestore";

/** Extends the FirestoreDataConverter class for additional functionality beyond those necessary to provide to the Firebase SDK for transferring
 *  custom data objects to and from Cloud Firestore.
 */
export interface DataModelConverter<DataModel> extends FirestoreDataConverter<DataModel> {
  /** Returns a DataModel object taken from a DocumentSnapshot (as opposed to a DocumentQuerySnapshot). */
  fromFirestoreDoc(snapshot: DocumentSnapshot<DocumentData>): DataModel;

  /** Returns a DataModel object taken from an https.Request. */
  fromHTTPRequest(request:https.Request): DataModel;
}