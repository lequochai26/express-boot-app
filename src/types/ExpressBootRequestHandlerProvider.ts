import { RequestHandler } from "express";

/**
 * Express's RequestHandler provider (often use to represent for a configurer)
 */
type ExpressBootRequestHandlerProvider = () => RequestHandler;
export default ExpressBootRequestHandlerProvider;