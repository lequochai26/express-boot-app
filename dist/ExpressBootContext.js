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
let ExpressBootContext = class ExpressBootContext {
    static { ExpressBootContext_1 = this; }
    // Static fields:
    static nodes = {};
    static requestHandlers = [];
    static requestMiddlewares = {};
    static corsConfigurer;
    static multerConfigurer;
    static scripts = {};
    static requestLoggerHandler;
    // Static dependencies:
    static logger() { return null; }
    // Decorators:
    /**
     * Mark a class as node class.
     * @param name Node name
     * @param args Class constructor arguments
     */
    static node(name, ...args) {
        const evaluation = function (target) {
            if (!name) {
                name = target.name;
                name = name.replace(name.charAt(0), name.charAt(0).toLowerCase());
            }
            ExpressBootContext_1.nodes[name] = new target(...args);
            ExpressBootContext_1.logger()
                ?.info(`Instantiated node '${name}' of class '${target.name}'`);
        };
        return evaluation;
    }
    /**
     * Mark a method as a node generator method.
     * @param name Node name
     * @param dependencies Node names
     */
    static configNode(name, ...dependencies) {
        const evaluation = function (target, propertyKey, descriptor) {
            ExpressBootContext_1.nodes[name || propertyKey] = descriptor.value.call(target, ...dependencies);
            ExpressBootContext_1.logger()
                ?.info(`Received node '${String(name || propertyKey)}' from method '${String(propertyKey)}'`);
        };
        return evaluation;
    }
    /**
     * Inject a specific node matchs given name through marked method.
     * @param name Target node name
     */
    static inject(name) {
        const evaluation = function (target, propertyKey, descriptor) {
            ExpressBootContext_1.logger()
                ?.info(`Injected node '${String(name || propertyKey)}' into method '${String(propertyKey)}'`);
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
     * Mark a method as a request handler.
     * @param path Request mapping path
     * @param method HTTP method (undefined as middleware)
     * @param priority Execution priority (works for middlewares execution)
     */
    static requestHandle(path, method, priority = -1) {
        const evaluation = function (target, propertyKey, descriptor) {
            const handler = function (request, response, next) {
                descriptor.value.call(target, request, response, next);
            };
            if (!method) {
                if (!ExpressBootContext_1.requestMiddlewares[priority]) {
                    ExpressBootContext_1.requestMiddlewares[priority] = [];
                }
                ExpressBootContext_1.requestMiddlewares[priority].push({
                    path,
                    middleware: handler
                });
            }
            else {
                ExpressBootContext_1.requestHandlers.push({
                    path, method, handler
                });
            }
            ExpressBootContext_1.logger()
                ?.info(`Detected a ${method ? "request handler" : "middleware"} from method '${String(propertyKey)}'`);
        };
        return evaluation;
    }
    /**
     * Mark a method as a GET request handler.
     * @param path Request mapping path
     */
    static get(path) {
        return ExpressBootContext_1.requestHandle(path, 'GET');
    }
    /**
     * Mark a method as a POST request handler.
     * @param path Request mapping path
     */
    static post(path) {
        return ExpressBootContext_1.requestHandle(path, 'POST');
    }
    /**
     * Mark a method as a PUT request handler.
     * @param path Request mapping path
     */
    static put(path) {
        return ExpressBootContext_1.requestHandle(path, 'PUT');
    }
    /**
     * Mark a method as a DELETE request handler.
     * @param path Request mapping path
     */
    static delete(path) {
        return ExpressBootContext_1.requestHandle(path, 'DELETE');
    }
    /**
     * Mark a method as a PATCH request handler.
     * @param path Request mapping path
     */
    static patch(path) {
        return ExpressBootContext_1.requestHandle(path, 'PATCH');
    }
    /**
     * Mark a method as a OPTIONS request handler.
     * @param path Request mapping path
     */
    static options(path) {
        return ExpressBootContext_1.requestHandle(path, 'OPTIONS');
    }
    /**
     * Mark a method as a HEAD request handler.
     * @param path Request mapping path
     */
    static head(path) {
        return ExpressBootContext_1.requestHandle(path, 'HEAD');
    }
    /**
     * Mark a method as a request middleware.
     * @param path Request mapping path
     * @param priority Execution priority
     */
    static middleware(path, priority) {
        return ExpressBootContext_1.requestHandle(path, undefined, priority);
    }
    /**
     * Mark a method as a CORS configurer.
     */
    static cors(target, propertyKey, descriptor) {
        ExpressBootContext_1.corsConfigurer = function () {
            ExpressBootContext_1.logger()
                ?.info(`Detected CORS configurer from  method '${String(propertyKey)}'`);
            return descriptor.value.call(target);
        };
    }
    /**
     * Mark a method as a Multer configurer.
     */
    static multer(target, propertyKey, descriptor) {
        ExpressBootContext_1.multerConfigurer = function () {
            ExpressBootContext_1.logger()
                ?.info(`Detected multer configurer from method '${String(propertyKey)}'`);
            return descriptor.value.call(target);
        };
    }
    /**
     * Mark a method as a script.
     * @param priority Execution priority
     * @param dependencies Node names
     * @returns
     */
    static script(priority = -1, ...dependencies) {
        function evaluation(target, propertyKey, descriptor) {
            if (!ExpressBootContext_1.scripts[priority]) {
                ExpressBootContext_1.scripts[priority] = [];
            }
            ExpressBootContext_1.scripts[priority].push(function () {
                descriptor.value.call(target, ...dependencies.map(dependency => ExpressBootContext_1.nodes[dependency]));
            });
            ExpressBootContext_1.logger()
                ?.info(`Detected a script from method '${String(propertyKey)}'`);
        }
        ;
        return evaluation;
    }
    /**
     * Mark a method as a request logger
     */
    static requestLogger(target, propertyKey, descriptor) {
        ExpressBootContext_1.requestLoggerHandler = function (request, response, next) {
            return descriptor.value.call(target, request, response, next);
        };
    }
    // Constructors:
    constructor() {
    }
    // Methods:
    getNode(name) {
        return ExpressBootContext_1.nodes[name];
    }
    getNodes() {
        return Object.keys(ExpressBootContext_1.nodes)
            .map(name => ({
            name,
            value: ExpressBootContext_1.nodes[name]
        }));
    }
    getRequestHandlers() {
        return ExpressBootContext_1.requestHandlers;
    }
    getRequestHandler(path, method) {
        return ExpressBootContext_1.requestHandlers.filter(handler => (handler.path === path && handler.method === method))[0];
    }
    getRequestMiddlewares() {
        return Object.keys(ExpressBootContext_1.requestMiddlewares)
            .map(priority => Number.parseInt(priority))
            .map((priority, index, array) => {
            if (priority >= 0) {
                return priority;
            }
            ExpressBootContext_1.requestMiddlewares[array.length] = ExpressBootContext_1.requestMiddlewares[priority];
            delete ExpressBootContext_1.requestMiddlewares[priority];
            return array.length;
        })
            .sort((a, b) => a - b)
            .map(priority => ExpressBootContext_1.requestMiddlewares[priority])
            .flat(1);
    }
    getRequestMiddleware(path) {
        return Object.keys(ExpressBootContext_1.requestMiddlewares)
            .map(str => Number.parseInt(str))
            .map(priority => ExpressBootContext_1.requestMiddlewares[priority])
            .flat(1)
            .filter(middleware => (middleware.path === path))[0];
    }
    getCorsConfigurer() {
        return ExpressBootContext_1.corsConfigurer;
    }
    getMulterConfigurer() {
        return ExpressBootContext_1.multerConfigurer;
    }
    getScripts() {
        return Object.keys(ExpressBootContext_1.scripts)
            .map(str => Number.parseInt(str))
            .map((priority, index, array) => {
            if (priority >= 0) {
                return priority;
            }
            ExpressBootContext_1.scripts[array.length] = ExpressBootContext_1.scripts[priority];
            delete ExpressBootContext_1.scripts[priority];
            return array.length;
        })
            .sort((a, b) => a - b)
            .map(priority => ExpressBootContext_1.scripts[priority])
            .flat(1);
    }
    registerNode(node, name) {
        if (!node) {
            throw new Error(`Target can't be undefined!`);
        }
        ExpressBootContext_1.nodes[name] = node;
    }
    getRequestLogger() {
        return ExpressBootContext_1.requestLoggerHandler;
    }
    async load(path) {
        ExpressBootContext_1.logger()
            .info(`Context loading...`);
        const filePaths = fs_1.default.readdirSync(path, { encoding: null, recursive: true });
        for (const filePath of filePaths) {
            if (!filePath.endsWith(".ts")
                &&
                    !filePath.endsWith(".js")) {
                continue;
            }
            await Promise.resolve(`${`${path}${!path.endsWith("/") ? "/" : ""}${filePath}`}`).then(s => __importStar(require(s)));
            ExpressBootContext_1.logger()
                .info(`Context loading ${filePath}`);
        }
        ExpressBootContext_1.logger()
            .info(`Context loaded successfully!`);
    }
};
__decorate([
    ExpressBootContext.inject(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ExpressBootContext, "logger", null);
ExpressBootContext = ExpressBootContext_1 = __decorate([
    ExpressBootContext.node("context"),
    __metadata("design:paramtypes", [])
], ExpressBootContext);
exports.default = ExpressBootContext;
//# sourceMappingURL=ExpressBootContext.js.map