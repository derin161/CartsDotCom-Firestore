import { DocumentData, DocumentSnapshot, FirestoreDataConverter } from "firebase/firestore";

export interface DataModelConverter<DataModel> extends FirestoreDataConverter<DataModel> {
  fromFirestoreDoc(
      snapshot: DocumentSnapshot<DocumentData>): DataModel;
}