import axios = require('axios');
import { DataModelConverter } from "./models/DataModelConverter";

/** Singleton helper class for standard GET, POST, PUT requests using custom DataModel object converters. */
export class HTTPHandler {
    
    private static instance:HTTPHandler = new HTTPHandler();

    public static get Instance() {
        return this.instance;
    }

    private constructor() {} //private constructor for singleton

    /** Get DataModels from the array of JSONs. 
     * 
     * @param data an array of JSON objects
     * @param converter the converter to use to convert from JSON to a DataModel
     * @returns a Promise containing an array of DataModels
    */
    private async getModelsFromArray<T>(data: any[], converter: DataModelConverter<T>): Promise<T[]> {
        const models: T[] = [];

        for (const datum of data) {
            models.push(await converter.fromHTTPResponse(datum));
        }

        return models;
    }

    /** Makes an HTTP GET request to the given url, returning a Promise containing an array of DataModels.
     * 
     * @param url the url to GET
     * @param converter the converter to use to get the DataModel objects
     * @returns a Promise containing an array of DataModels from the GET request, or an Error message if one occurs
     */
    public async httpGetDataModelListAsync<T>(url: string, converter: DataModelConverter<T>): Promise<T[]>{
        const response = this.httpGetASync(url);
        return this.getModelsFromArray(await response, converter);
    }

    /** Makes an HTTP GET request to the given url, returning a Promise containing a DataModel.
     * 
     * @param url the url to GET
     * @param converter the converter to use to get the DataModel object
     * @returns a Promise containing a DataModel from the GET request, or an Error message if one occurs
     */
    public async httpGetDataModelAsync<T>(url: string, converter: DataModelConverter<T>): Promise<T> {
        const response =  this.httpGetASync(url);
        return converter.fromHTTPResponse(await response);
    }

    /** Makes an HTTP GET request to the given url, returning a Promise containing the response.
     * 
     * @param url the url to GET
     * @returns a Promise containing a DataModel from the GET request, or an Error message if one occurs
     */
    public async httpGetASync(url : string) : Promise<any> {
        var response = 'Error';
        try {
            response = await (await axios.default.get(url)).data;
            console.log(response);
          } catch (error) {
            console.error(error);
        } finally {
            return response;
        }
    }

    /** Makes an HTTP GET request to the given url, returning a Promise containing the response.
     * 
     * @param url the url to GET
     * @returns a Promise containing a DataModel from the GET request, or an Error message if one occurs
     */
     public async httpPostASync(url : string, data: any) : Promise<any> {
        var response = 'Error';
        try {
            response = await axios.default.post(url, data);
            console.log(response);
        } catch (error) {
            console.error(error);
        } finally {
            return response;
        }
    }

}
