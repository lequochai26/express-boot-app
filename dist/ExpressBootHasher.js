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
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
const crypto_1 = __importDefault(require("crypto"));
let ExpressBootHasher = class ExpressBootHasher {
    // Constructor:
    constructor() {
    }
    // Methods:
    hash(content, algorithm) {
        switch (algorithm) {
            case HashAlgorithm_1.default.SHA256: {
                const hash = crypto_1.default.createHash('sha256');
                hash.update(content);
                return hash.digest('hex');
            }
        }
    }
};
ExpressBootHasher = __decorate([
    ExpressBootContext_1.default.node("hasher"),
    __metadata("design:paramtypes", [])
], ExpressBootHasher);
exports.default = ExpressBootHasher;
//# sourceMappingURL=ExpressBootHasher.js.map