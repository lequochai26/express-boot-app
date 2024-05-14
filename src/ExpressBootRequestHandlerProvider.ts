import { RequestHandler } from "express";

type ExpressBootRequestHandlerProvider = () => RequestHandler;
export default ExpressBootRequestHandlerProvider;