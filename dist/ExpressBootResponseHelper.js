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
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
let ExpressBootResponseHelper = class ExpressBootResponseHelper {
    // Constructor:
    constructor() {
    }
    // Private methods:
    generateResponser(type, result, schema) {
        if (!result) {
            throw new Error(`Result cannot be undefined or null!`);
        }
        const body = (!schema
            ?
                result
            :
                new schema(result));
        return {
            use(response) {
                if (type === 'ERROR') {
                    response.status(400);
                }
                if (type === 'NOT_FOUND') {
                    response.status(404);
                }
                response.json(body);
            },
        };
    }
    // Methods:
    success(result, schema) {
        return this.generateResponser('SUCCESS', result, schema);
    }
    notFound(result, schema) {
        return this.generateResponser('NOT_FOUND', result, schema);
    }
    error(result, schema) {
        return this.generateResponser('ERROR', result, schema);
    }
};
ExpressBootResponseHelper = __decorate([
    ExpressBootContext_1.default.node("responseHelper"),
    __metadata("design:paramtypes", [])
], ExpressBootResponseHelper);
exports.default = ExpressBootResponseHelper;
//# sourceMappingURL=ExpressBootResponseHelper.js.map