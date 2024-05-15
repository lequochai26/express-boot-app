import ExpressBootRequestHandlerProvider from "../types/ExpressBootRequestHandlerProvider";
import ExpressBootScript from "../types/ExpressBootScript";
import ExpressBootRequestHandler from "./ExpressBootRequestHandler";
import ExpressBootRequestMiddleware from "./ExpressBootRequestMiddleware";

export default interface Context {
    getNode(name: string): any;
    getNodes(): any[];
    getRequestHandlers(): ExpressBootRequestHandler[];
    getRequestMiddlewares(): ExpressBootRequestMiddleware[];
    getCorsConfigurer(): ExpressBootRequestHandlerProvider;
    getMulterConfigurer(): ExpressBootRequestHandlerProvider;
    getScripts(): ExpressBootScript[];
}