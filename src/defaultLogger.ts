import { RequestHandler } from "express";

const defaultLogger: RequestHandler = function (request, response, next) {
    console.log(`${request.method} ${request.path}`);
    next();
}

export default defaultLogger;