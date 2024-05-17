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
const HashAlgorithm_1 = __importDefault(require("./enums/HashAlgorithm"));
const IdGenerateStrategy_1 = __importDefault(require("./enums/IdGenerateStrategy"));
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
let ExpressBootIdGenerator = class ExpressBootIdGenerator {
    // Dependencies:
    hasher() { return null; }
    // Constructors:
    constructor() {
    }
    // Methods:
    generate(strategy) {
        switch (strategy) {
            case IdGenerateStrategy_1.default.TIME: return this.hasher().hash(new Date()
                .getTime()
                .toString(), HashAlgorithm_1.default.SHA256);
        }
    }
};
__decorate([
    ExpressBootContext_1.default.inject(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ExpressBootIdGenerator.prototype, "hasher", null);
ExpressBootIdGenerator = __decorate([
    ExpressBootContext_1.default.node("idGenerator"),
    __metadata("design:paramtypes", [])
], ExpressBootIdGenerator);
exports.default = ExpressBootIdGenerator;
//# sourceMappingURL=ExpressBootIdGenerator.js.map