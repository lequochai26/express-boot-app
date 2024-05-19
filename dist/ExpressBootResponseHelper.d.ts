import ResponseHelper from "./interfaces/ResponseHelper";
import Responser from "./interfaces/Responser";
export default class ExpressBootResponseHelper implements ResponseHelper {
    constructor();
    private generateResponser;
    success<T>(result: any, schema?: new (...args: any[]) => T): Responser;
    notFound<T>(result: any, schema?: new (...args: any[]) => T): Responser;
    error<T>(result: any, schema?: new (...args: any[]) => T): Responser;
}
