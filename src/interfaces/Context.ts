import ExpressBootRequestHandlerProvider from "../types/ExpressBootRequestHandlerProvider";
import ExpressBootScript from "../types/ExpressBootScript";
import ExpressBootNode from "./ExpressBootNode";
import ExpressBootRequestHandler from "./ExpressBootRequestHandler";
import ExpressBootRequestMiddleware from "./ExpressBootRequestMiddleware";

export default interface Context {
    getNode(name: string): any;
    getNodes(): ExpressBootNode[];
    getRequestHandlers(): ExpressBootRequestHandler[];
    getRequestMiddlewares(): ExpressBootRequestMiddleware[];
    getCorsConfigurer(): ExpressBootRequestHandlerProvider;
    getMulterConfigurer(): ExpressBootRequestHandlerProvider;
    getScripts(): ExpressBootScript[];
    load(path: string): Promise<void>;
}