import { config } from "dotenv";
import IdGenerateStrategy from "./enums/IdGenerateStrategy";
import ExpressBootContext from "./ExpressBootContext";
import IdGenerator from "./interfaces/IdGenerator";
import SessionFactory from "./interfaces/SessionFactory";
import { Request, Response } from "express";

config();
const expirationTimeStr: string = process.env.SESSION_EXPIRATION_TIME;
const expirationTime: number = expirationTimeStr ? Number.parseInt(expirationTimeStr) : 3_600_000;
const prefix: string = "express-boot";
const cookieKey: string = `${prefix}_sessionId`;

@ExpressBootContext.node("sessionFactory")
export default class ExpressBootSessionFactory implements SessionFactory {
    // Fields:
    private sessions: { [ index: string ]: any };

    // Dependencies:
    @ExpressBootContext.inject()
    private idGenerator(): IdGenerator { return null; }

    // Constructor:
    public constructor() {
        this.sessions = {};
    }

    // Methods:
    private generateId(): string {
        return `${prefix}_${this.idGenerator().generate(IdGenerateStrategy.TIME)}`
    }

    public create(): [string, any] {
        const id: string = this.generateId();
        const session: any = {};
        this.sessions[id] = session;

        const self = this;
        setTimeout(
            () => delete self.sessions[id],
            expirationTime
        );

        return [ id, session ];
    }

    public get(sessionId: string): any {
        if (!sessionId) {
            return undefined;
        }

        return this.sessions[sessionId];
    }

    public retrieve(request: Request, response: Response): any {
        let { sessionId } = request.cookies;
        const session = this.get(sessionId);

        if (!session) {
            const [ sessionId, session ] = this.create();
            response.cookie(cookieKey, sessionId);
            return session;
        }

        return session;
    }
}