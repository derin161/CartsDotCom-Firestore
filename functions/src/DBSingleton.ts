import { Firestore } from "@firebase/firestore";

/** Singleton class for controlling access to the DB. */
export class DBSingleton {

    private static instance: DBSingleton = new DBSingleton();
    private db: Firestore | undefined;

    public static get Instance() {
        return DBSingleton.instance;
    }

    private constructor() {} //private singleton constructor

    /** Registers the DB to pull data from. */
    public registerDB(db: Firestore) {
        this.db = db;
    }

    /** Returns true if the DB has been registered and is ready to acccess.
     * @returns true if DB has been registered
     */
    public DBIsRegistered() {
        return this.db != undefined;
    }

    /** Get the instance of the DB.
     * @requires the DB has been registered already
     */
    public get DB() {
        return this.db!;
    }
}