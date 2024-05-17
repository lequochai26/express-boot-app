import { cyan, red, yellow } from "colors";
import ExpressBootContext from "./ExpressBootContext";
import Logger from "./interfaces/Logger";
import { NextFunction, Request, Response } from "express";

@ExpressBootContext.node("logger")
export default class ExpressBootLogger implements Logger {
    // Constructor:
    public constructor() {

    }

    // Private methods:
    private log(content: string, type: "INFO" | "WARNING" | "ERROR"): void {
        content = `<${new Date().toLocaleTimeString("vi")}>  [${type.charAt(0)}]  ${content}`;

        content = (
            type === 'INFO'
            ?
            cyan(content)
            :
            type === 'WARNING'
            ?
            yellow(content)
            :
            red(content)
        );

        console.log(content);
    }

    // Methods:
    public info(content: string): void {
        this.log(content, "INFO");
    }

    public warning(content: string): void {
        this.log(content, "WARNING");
    }

    public error(content: string): void {
        this.log(content, "ERROR");
    }

    @ExpressBootContext.requestLogger
    public requestLog(request: Request, respone: Response, next: NextFunction) {
        this.info(`${request.method}: ${request.path}`);
        next();
    }
}