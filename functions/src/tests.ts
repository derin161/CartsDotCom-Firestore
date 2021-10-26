import * as functions from "firebase-functions";

/** These functions are used for testing connection to a Firebase function server. */

////////////////// FUNCTIONS ///////////////////////////

/** Function to test a simple HTTPS GET request with no parameters.  */
export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs! HelloWorld test call.", { structuredData: true });
    response.send("Hello from Firebase!");
});

/** Function to test a simple HTTPS GET request passing in a path param called num. */
export const ping = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs! Ping test call with num = " + request.params.num + ".", { structuredData: true });
    response.send("You pinged me with path param num = " + request.params.num);
});

///////////////////////////////////////////////////////////////
