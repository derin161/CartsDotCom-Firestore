import { BASE_REQUEST_URL, FUNCTIONS_ROUTING_NAME, ORDERS_COLL_NAME, ORDER_PROCESSING_APP_NAME, USERS_COLL_NAME } from "../utils";
import { ServerApp } from "./ServerApp";
import * as functions from "firebase-functions";
import { https } from "firebase-functions";
import { HTTPHandler } from "../HTTPHandler";

/** Application used for accessing the /users root collection and all subcollections. */
export class OrderProcessingApp extends ServerApp {
    private static readonly USER_ID_PARAM = 'uid';
    private static readonly ORDER_DATA_FIELD_NAME = 'orderData';
    

    private static ordersToProcess:any[] = []; 

    public static batchProccessOrders = functions.pubsub.schedule('every 5 minutes')
    .onRun((context) => {
        console.log('Running scheduled batchProcessOrders.');
        HTTPHandler.Instance.httpGetASync(`${BASE_REQUEST_URL}/${ORDER_PROCESSING_APP_NAME}/${FUNCTIONS_ROUTING_NAME}/manualTrigger/`);
        return null;
    });

    private static processAllOrders() {
        console.log('Running batchProcessOrders.');
        console.log(OrderProcessingApp.ordersToProcess);
        OrderProcessingApp.ordersToProcess.forEach(order => {
            console.log(order);
            OrderProcessingApp.postUserOrder(order[OrderProcessingApp.USER_ID_PARAM], order[OrderProcessingApp.ORDER_DATA_FIELD_NAME]);
        });
        OrderProcessingApp.ordersToProcess = [];
        console.log(OrderProcessingApp.ordersToProcess);
        console.log('Finished batchProcessOrders.');
    }

    private static manualTrigger(request: https.Request, response: any) {
        OrderProcessingApp.processAllOrders();
        response.send('Manual trigger received.')
    }
      
    /** Creates a document in the /users/USER_ID_PARAM/orders collection using the
     * fields in the body of the request with a random id the path to which will be sent back to the client. 
     * 
     * @param request the incoming http request, with path param USER_ID_PARAM being the id of the requested user to place the order under
     * @param response the outgoing response, which will be sent back user data, or an error if one occurs
    */
    private static createUserOrder(request: https.Request, response: any){
        const orderData: any = {};
        orderData[OrderProcessingApp.USER_ID_PARAM] = request.params[OrderProcessingApp.USER_ID_PARAM];
        orderData[OrderProcessingApp.ORDER_DATA_FIELD_NAME] = request.body;
        OrderProcessingApp.ordersToProcess.push(orderData);
        response.send("Order added to queue.");
    }

    private static getQueue(request: https.Request, response: any) {
        response.send(OrderProcessingApp.ordersToProcess);
    }

    private static postUserOrder(uid: string, orderData: any) {
        const postUrl = `${BASE_REQUEST_URL}/${USERS_COLL_NAME}/${uid}/${ORDERS_COLL_NAME}`;
        HTTPHandler.Instance.httpPostASync(postUrl, orderData);        
    }

    /** Creates an instance of a Users Application with all routing applied.*/
    public constructor() {
        super(ORDER_PROCESSING_APP_NAME);
    }

    public applyRouting(app: any): void {
        app.post(`/:${OrderProcessingApp.USER_ID_PARAM}/${ORDERS_COLL_NAME}`, OrderProcessingApp.createUserOrder);
        app.get(`/${FUNCTIONS_ROUTING_NAME}/getQueue/`, OrderProcessingApp.getQueue);

        app.get(`/${FUNCTIONS_ROUTING_NAME}/manualTrigger/`, OrderProcessingApp.manualTrigger);
    }
}
