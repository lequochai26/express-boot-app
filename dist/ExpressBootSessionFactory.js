"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const IdGenerateStrategy_1 = __importDefault(require("./enums/IdGenerateStrategy"));
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
(0, dotenv_1.config)();
const expirationTimeStr = process.env.SESSION_EXPIRATION_TIME;
const expirationTime = expirationTimeStr ? Number.parseInt(expirationTimeStr) : 3600000;
const prefix = "express-boot";
const cookieKey = `${prefix}_sessionId`;
let ExpressBootSessionFactory = class ExpressBootSessionFactory {
    // Fields:
    sessions;
    // Dependencies:
    idGenerator() { return null; }
    // Constructor:
    constructor() {
        this.sessions = {};
    }
    // Methods:
    generateId() {
        return `${prefix}_${this.idGenerator().generate(IdGenerateStrategy_1.default.TIME)}`;
    }
    create() {
        const id = this.generateId();
        const session = {};
        this.sessions[id] = session;
        const self = this;
        setTimeout(() => delete self.sessions[id], expirationTime);
        return [id, session];
    }
    get(sessionId) {
        if (!sessionId) {
            return undefined;
        }
        return this.sessions[sessionId];
    }
    retrieve(request, response) {
        const sessionId = request.cookies[cookieKey];
        const session = this.get(sessionId);
        if (!session) {
            const [sessionId, session] = this.create();
            response.cookie(cookieKey, sessionId);
            return session;
        }
        return session;
    }
};
__decorate([
    ExpressBootContext_1.default.inject(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ExpressBootSessionFactory.prototype, "idGenerator", null);
ExpressBootSessionFactory = __decorate([
    ExpressBootContext_1.default.node("sessionFactory"),
    __metadata("design:paramtypes", [])
], ExpressBootSessionFactory);
exports.default = ExpressBootSessionFactory;
//# sourceMappingURL=ExpressBootSessionFactory.js.map