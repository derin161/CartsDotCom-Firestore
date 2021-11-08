import * as functions from "firebase-functions";
import { TESTS_APP_NAME, FUNCTIONS_ROUTING_NAME } from "../utils";
import { ServerApp } from "./ServerApp";

/** Application used for testing connection to a Firebase function server with simple functions that do not access the db. */
export class TestsApp extends ServerApp {

    private static readonly PING_PARAM = 'num';

    /** Function to test a simple HTTPS GET request with no parameters.  */
    private static helloWorld = functions.https.onRequest((request, response) => {
        functions.logger.info("Hello logs! HelloWorld test call.", { structuredData: true });
        response.send("Hello from Firebase!");
    });

    /** Function to test a simple HTTPS GET request passing in a path param called num. */
    private static ping = functions.https.onRequest((request, response) => {
        functions.logger.info(`Hello logs! Ping test call with ${TestsApp.PING_PARAM} = ${request.params[TestsApp.PING_PARAM]}.`, { structuredData: true });
        response.send(`You pinged me with path param ${TestsApp.PING_PARAM} = ${request.params[TestsApp.PING_PARAM]}`);
    });

    /** Creates an instance of a Tests Application with all routing applied.
     */
    public constructor() {
        super(TESTS_APP_NAME);
    }

    public applyRouting(app: any): void {
        app.get(`/${FUNCTIONS_ROUTING_NAME}/ping/:${TestsApp.PING_PARAM}`, TestsApp.ping);
        app.get(`/${FUNCTIONS_ROUTING_NAME}/helloWorld/`, TestsApp.helloWorld);
    }
}
