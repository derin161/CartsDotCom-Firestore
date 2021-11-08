import {https} from "firebase-functions";
import { OrderModel } from "../models/OrderModel";
import { UserModel } from "../models/UserModel";
import { StandardRequests } from "../StandardRequests";
import { USERS_COLL_NAME, ORDERS_COLL_NAME } from "../utils";
import { ServerApp } from "./ServerApp";

/** Application used for accessing the /users root collection and all subcollections. */
export class UsersApp extends ServerApp {
    private static readonly USER_ID_PARAM = 'uid';
    private static readonly ORDER_ID_PARAM = 'oid';

    /** Sends a response containing the JSON document in the /users collection. 
     * 
     * @param request the incoming http request, with path param USER_ID_PARAM being the id of the requested user doc
     * @param response the outgoing response, which will be sent back user data, or an error if one occurs
    */
    private static getUser(request: https.Request, response: any) {
        StandardRequests.Instance.readDoc(request, response, USERS_COLL_NAME, UserModel.Converter);
    }

    /** Updates all user fields passed into the body of the Request.  
     * 
     * @param request the incoming http request, with path param USER_ID_PARAM being the id of the requested user doc to update
     * @param response the outgoing response, which will be sent back user data, or an error if one occurs
    */
    private static updateUser(request: https.Request, response: any) {
        StandardRequests.Instance.updateDoc(request, response, USERS_COLL_NAME, UserModel.Converter);
    }

    /** Creates document /users/USER_ID_PARAM in the using the
     * fields in the body of the request, the path to which will be sent back to the client. 
     * 
     * @param request the incoming http request, with path param USER_ID_PARAM being the id of the user doc
     * @param response the outgoing response, which will be sent back user data, or an error if one occurs
    */
    private static createUser(request: https.Request, response: any) {
        StandardRequests.Instance.createWithID(request, response, USERS_COLL_NAME, UserModel.Converter);
    }

    /** Creates a document in the /users/USER_ID_PARAM/orders collection using the
     * fields in the body of the request with a random id the path to which will be sent back to the client. 
     * 
     * @param request the incoming http request, with path param USER_ID_PARAM being the id of the requested user to place the order under
     * @param response the outgoing response, which will be sent back user data, or an error if one occurs
    */
    private static createUserOrder(request: https.Request, response: any){
        StandardRequests.Instance.createDoc(request, response, USERS_COLL_NAME, OrderModel.Converter);
    }

    /** Updates all order fields passed into the body of the Request at /users/USER_ID_PARAM/orders/ORDER_ID_PARAM.  
     * 
     * @param request the incoming http request, with path param USER_ID_PARAM being the id of the requested user to seach under
     * and path param ORDER_ID_PARAM being the id of the order to update
     * @param response the outgoing response, which will be sent back user order data, or an error if one occurs
    */
    private static updateUserOrder(request: https.Request, response: any){
        StandardRequests.Instance.updateDoc(request, response, USERS_COLL_NAME, OrderModel.Converter);
    }

    /** Sends a response containing the JSON document at /users/USER_ID_PARAM/orders/ORDER_ID_PARAM 
     * 
     * @param request the incoming http request, with path param USER_ID_PARAM being the id of the requested user to seach under
     * and path param ORDER_ID_PARAM being the id of the order to search for
     * @param response the outgoing response, which will be sent back user order data, or an error if one occurs
    */
    private static getUserOrder(request: https.Request, response: any) {
        StandardRequests.Instance.readDoc(request, response, USERS_COLL_NAME, OrderModel.Converter);
    }

    /** Sends a response containing all JSON documents in the /users/USER_ID_PARAM/orders collection. 
     * 
     * @param request the incoming http request, with USER_ID_PARAM as a path param of the user to search under
     * @param response the outgoing response, which will be sent back an array of user order data, or an error if one occurs
    */
    private static getUserOrdersCollection(request: https.Request, response: any) {
        StandardRequests.Instance.readCollec(request, response, USERS_COLL_NAME, OrderModel.Converter);
    }

    /** Creates an instance of a Users Application with all routing applied.*/
    public constructor() {
        super(USERS_COLL_NAME);
    }

    public applyRouting(app: any): void {
        app.get(`/:${UsersApp.USER_ID_PARAM}`, UsersApp.getUser); // /users collection
        app.put(`/:${UsersApp.USER_ID_PARAM}`, UsersApp.updateUser);
        app.post(`/:${UsersApp.USER_ID_PARAM}`, UsersApp.createUser);

        app.get(`/:${UsersApp.USER_ID_PARAM}/${ORDERS_COLL_NAME}/:${UsersApp.ORDER_ID_PARAM}`, UsersApp.getUserOrder); // /users/<uid>/orders collection
        app.post(`/:${UsersApp.USER_ID_PARAM}/${ORDERS_COLL_NAME}/`, UsersApp.createUserOrder);
        app.put(`/:${UsersApp.USER_ID_PARAM}/${ORDERS_COLL_NAME}/:${UsersApp.ORDER_ID_PARAM}`, UsersApp.updateUserOrder)
        app.get(`/:${UsersApp.USER_ID_PARAM}/${ORDERS_COLL_NAME}`, UsersApp.getUserOrdersCollection);

    }
}
