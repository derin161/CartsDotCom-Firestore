import * as express from 'express';
import * as cors from "cors";

/** Abstract class used to model Express Applications running on Firebase Cloud. */
export abstract class ServerApp {
    protected readonly appName:string;
    private readonly app:any;

    /** Creates an instance of a Server Application with all routing applied.
     * @param appName the name to use for the application
     */
    protected constructor(appName:string) {
        this.appName = appName;
        this.app = express();
        this.app.use(cors({ origin: true })); // Automatically allow cross-origin requests
        this.applyRouting(this.app);
    }

    /** Returns the name of the app for routing to the application. */
    public get AppName() : string {
        return this.appName;
    }

    /** Returns the instance of the application. */
    public get App() : any {
        return this.app;
    }

    /** Applies all path routing necessary for HTTP requests made to the application. */
    public abstract applyRouting(app:any) : void;
    
}
