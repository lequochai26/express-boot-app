import ExpressBootContext from "./ExpressBootContext";
import ResponseHelper from "./interfaces/ResponseHelper";
import Responser from "./interfaces/Responser";

@ExpressBootContext.node("responseHelper")
export default class ExpressBootResponseHelper implements ResponseHelper {
    // Constructor:
    public constructor() {

    }

    // Private methods:
    private generateResponser<T>(type: "SUCCESS" | "NOT_FOUND" | "ERROR", result: any, schema?: new (...args: any[]) => T): Responser {
        if (!result) {
            throw new Error(`Result cannot be undefined or null!`);
        }

        const body = (
            !schema
            ?
            result
            :
            new schema(result)
        );

        return {
            use(response) {
                if (type === 'ERROR') {
                    response.status(400);
                }

                if (type === 'NOT_FOUND') {
                    response.status(404);
                }

                response.json(body);
            },
        };
    }

    // Methods:
    public success<T>(result: any, schema?: new (...args: any[]) => T): Responser {
        return this.generateResponser('SUCCESS', result, schema);
    }

    public notFound<T>(result: any, schema?: new (...args: any[]) => T): Responser {
        return this.generateResponser('NOT_FOUND', result, schema);
    }

    public error<T>(result: any, schema?: new (...args: any[]) => T): Responser {
        return this.generateResponser('ERROR', result, schema);
    }
}