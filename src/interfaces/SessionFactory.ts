import { Request, Response } from "express";

export default interface SessionFactory {
    /**
     * Create new session
     * @returns Session's id, session
     */
    create(): [ string, any ];

    /**
     * Get session
     * @param sessionId 
     * @returns Session
     */
    get(sessionId: string): any;

    /**
     * Get or create new session with operations adjusted for request handling.
     * @param request 
     * @param response 
     * @returns Session
     */
    retrieve(request: Request, response: Response): any;
}