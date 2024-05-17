"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ExpressBootContext_1;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
/**
 * ExpressBoot app's context and node container support for dependency injection.
 */
let ExpressBootContext = class ExpressBootContext {
    static { ExpressBootContext_1 = this; }
    // STATIC
    // Static fields:
    /**
     * Nodes storage.
     */
    static nodes = {};
    /**
     * HTTP request handlers storage
     */
    static requestHandlers = [];
    /**
     * HTTP request middlewares storage
     */
    static requestMiddlewares = [];
    /**
     * Executable scripts storage
     */
    static scripts = [];
    /**
     * CORS handler
     */
    static corsHandler = undefined;
    /**
     * Multer configurer
     */
    static multerConfigurer = undefined;
    // Decorators:
    /**
     * Define a node through class with node name as given
     * @param name - node name
     */
    static node(name, ...args) {
        const evaluation = function (target) {
            if (!name) {
                name = target.name;
                name = name.replace(name.charAt(0), name.charAt(0).toLowerCase());
            }
            ExpressBootContext_1.nodes[name] = new target(...args);
        };
        return evaluation;
    }
    /**
     * Define a node through config method with node name as method's name
     * @param dependencies - dependencies will be inject into config methods
     */
    static configNode(...dependencies) {
        const evaluation = function (target, propertyKey, descriptor) {
            ExpressBootContext_1.nodes[propertyKey] = descriptor.value.call(target, ...dependencies.map(dependency => ExpressBootContext_1.nodes[dependency]));
            return {
                ...descriptor,
                value: function () {
                    return ExpressBootContext_1.nodes[propertyKey];
                }
            };
        };
        return evaluation;
    }
    /**
     * Inject dependency into method with method's name as node name.
     * @returns New method which will return dependency on call
     */
    static inject(name) {
        const evaluation = function (target, propertyKey, descriptor) {
            return {
                ...descriptor,
                value: function () {
                    return ExpressBootContext_1.nodes[name || propertyKey];
                }
            };
        };
        return evaluation;
    }
    /**
     * Mark a method as a request handler or a request middleware (if method is undefined)
     * @param path - Request's path mapping
     * @param method - HTTP method
     */
    static requestHandle(path, method) {
        const evaluation = function (target, propertyKey, descriptor) {
            if (!path) {
                return;
            }
            const requestHandler = function (request, response, next) {
                descriptor.value.call(target, request, response, next);
            };
            if (!method) {
                ExpressBootContext_1.requestMiddlewares.push([path, requestHandler]);
            }
            else {
                ExpressBootContext_1.requestHandlers.push([path, method, requestHandler]);
            }
        };
        return evaluation;
    }
    /**
     * GET request handler
     * @param path - Request's path mapping
     */
    static get(path) {
        return ExpressBootContext_1.requestHandle(path, 'GET');
    }
    /**
     * POST request handler
     * @param path - Request's path mapping
     */
    static post(path) {
        return ExpressBootContext_1.requestHandle(path, 'POST');
    }
    /**
     * PUT request handler
     * @param path - Request's path mapping
     */
    static put(path) {
        return ExpressBootContext_1.requestHandle(path, 'PUT');
    }
    /**
     * DELETE request handler
     * @param path - Request's path mapping
     */
    static delete(path) {
        return ExpressBootContext_1.requestHandle(path, 'DELETE');
    }
    /**
     * PATCH request handler
     * @param path - Request's path mapping
     */
    static patch(path) {
        return ExpressBootContext_1.requestHandle(path, 'PATCH');
    }
    /**
     * OPTIONS request handler
     * @param path - Request's path mapping
     */
    static options(path) {
        return ExpressBootContext_1.requestHandle(path, 'OPTIONS');
    }
    /**
     * HEAD request handler
     * @param path - Request's path mapping
     */
    static head(path) {
        return ExpressBootContext_1.requestHandle(path, 'HEAD');
    }
    /**
     * Request middleware
     * @param path Request's path mapping
     */
    static middleware(path) {
        return ExpressBootContext_1.requestHandle(path);
    }
    /**
     * Mark a method as a CORS handler
     */
    static cors() {
        function evaluation(target, propertyKey, descriptor) {
            ExpressBootContext_1.corsHandler = { target, handler: descriptor.value };
        }
        ;
        return evaluation;
    }
    /**
     * Mark a method as a multer configurer
     */
    static multer() {
        function evaluation(target, propertyKey, descriptor) {
            ExpressBootContext_1.multerConfigurer = { target, configurer: descriptor.value };
        }
        return evaluation;
    }
    /**
     * Marks a method as an executable script and will be execute when context successfully loaded.
     */
    static script(...dependencies) {
        const evaluation = function (target, propertyKey, descriptor) {
            descriptor.value.call(target, ...dependencies.map(dependency => ExpressBootContext_1.nodes[dependency]));
        };
        return evaluation;
    }
    // INSTANCE
    // Constructors:
    constructor() {
    }
    // Methods:
    /**
     * Get a specific node with given name
     * @param name Node name
     * @returns Node
     */
    getNode(name) {
        return ExpressBootContext_1.nodes[name];
    }
    /**
     * Get all nodes available in system
     * @returns List of all nodes in system
     */
    getNodes() {
        return Object.values(ExpressBootContext_1.nodes);
    }
    /**
     * Get all request handlers in system
     * @returns List of all request handlers
     */
    getRequestHandlers() {
        return ExpressBootContext_1.requestHandlers;
    }
    /**
     * Get all request middlewares in system
     * @returns List of all request middlewares
     */
    getRequestMiddlewares() {
        return ExpressBootContext_1.requestMiddlewares;
    }
    /**
     * Get all scripts in system
     * @returns List of all scripts
     */
    getScripts() {
        return ExpressBootContext_1.scripts;
    }
    /**
     * Get CORS handler for this project
     * @returns CORS handler
     */
    getCorsHandler() {
        return ExpressBootContext_1.corsHandler;
    }
    /**
     * Get multer configurer for this project
     * @returns Multer configurer
     */
    getMulterConfigurer() {
        return ExpressBootContext_1.multerConfigurer;
    }
    /**
     * Load context from a specific path
     * @param path Root directory source directory
     */
    async load(path) {
        const dirs = fs_1.default.readdirSync(path, { encoding: null, recursive: true });
        for (const dir of dirs) {
            if (!dir.endsWith(".ts")) {
                continue;
            }
            await Promise.resolve(`${`${path}${!path.endsWith("/") ? "/" : ""}${dir}`}`).then(s => __importStar(require(s)));
        }
    }
};
ExpressBootContext = ExpressBootContext_1 = __decorate([
    ExpressBootContext.node("context"),
    __metadata("design:paramtypes", [])
], ExpressBootContext);
exports.default = ExpressBootContext;
//# sourceMappingURL=ExpressBootContext.js.map