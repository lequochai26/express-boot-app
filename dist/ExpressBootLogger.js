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
const colors_1 = require("colors");
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
let ExpressBootLogger = class ExpressBootLogger {
    // Constructor:
    constructor() {
    }
    // Private methods:
    log(content, type) {
        content = `<${new Date().toLocaleTimeString("vi")}>  [${type.charAt(0)}]  ${content}`;
        content = (type === 'INFO'
            ?
                (0, colors_1.cyan)(content)
            :
                type === 'WARNING'
                    ?
                        (0, colors_1.yellow)(content)
                    :
                        (0, colors_1.red)(content));
        console.log(content);
    }
    // Methods:
    info(content) {
        this.log(content, "INFO");
    }
    warning(content) {
        this.log(content, "WARNING");
    }
    error(content) {
        this.log(content, "ERROR");
    }
    requestLog(request, respone, next) {
        this.info(`${request.method}: ${request.path}`);
        next();
    }
};
__decorate([
    ExpressBootContext_1.default.requestLogger,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], ExpressBootLogger.prototype, "requestLog", null);
ExpressBootLogger = __decorate([
    ExpressBootContext_1.default.node("logger"),
    __metadata("design:paramtypes", [])
], ExpressBootLogger);
exports.default = ExpressBootLogger;
//# sourceMappingURL=ExpressBootLogger.js.map