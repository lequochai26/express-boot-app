import Responser from "./Responser";
/**
 * Response helper provides a set of methods to make response easier
 */
export default interface ResponseHelper {
    /**
     * Success response (200)
     * @param result Result include into response
     * @param schema Response schema
     * @returns Responser
     */
    success<T>(result: any, schema?: new (...args: any[]) => T): Responser;
    /**
     * Not found response (404)
     * @param result Result include into response
     * @param schema Response schema
     * @returns Responser
     */
    notFound<T>(result: any, schema?: new (...args: any[]) => T): Responser;
    /**
     * Error response (400)
     * @param result Result include into response
     * @param schema Response schema
     * @returns Responser
     */
    error<T>(result: any, schema?: new (...args: any[]) => T): Responser;
}
