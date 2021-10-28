import { DocumentData } from "@firebase/firestore";

export abstract class DataModel {
    public abstract getFirebaseObject() : DocumentData;
    public abstract fromFirebaseDocument(data: DocumentData):DataModel;
}