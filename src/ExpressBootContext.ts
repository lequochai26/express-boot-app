import { RequestHandler } from "express";
import Context from "./interfaces/Context";
import ExpressBootNode from "./interfaces/ExpressBootNode";
import ExpressBootRequestHandler from "./interfaces/ExpressBootRequestHandler";
import ExpressBootRequestMiddleware from "./interfaces/ExpressBootRequestMiddleware";
import ExpressBootHTTPMethod from "./types/ExpressBootHTTPMethod";
import ExpressBootRequestHandlerProvider from "./types/ExpressBootRequestHandlerProvider";
import ExpressBootScript from "./types/ExpressBootScript";
import fs from 'fs';

export default class ExpressBootContext implements Context {
    // Static fields:
    private static nodes: { [ index: string | symbol ]: any } = {};
    private static requestHandlers: ExpressBootRequestHandler[] = [];
    private static requestMiddlewares: { [ priority: number ]: ExpressBootRequestMiddleware[] } = {};
    private static corsConfigurer: ExpressBootRequestHandlerProvider;
    private static multerConfigurer: ExpressBootRequestHandlerProvider;
    private static scripts: { [ priority: number ]: ExpressBootScript[] } = {};

    // Decorators:
    public static node(name?: string, ...args: any[]): ClassDecorator {
        const evaluation: ClassDecorator = function (target: any) {
            if (!name) {
                name = target.name;
                name = name.replace(
                    name.charAt(0),
                    name.charAt(0).toLowerCase()
                );
            }
            ExpressBootContext.nodes[name] = new target(...args);
        };
        return evaluation;
    }

    public static configNode(name?: string, ...dependencies: (string | symbol)[]): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            ExpressBootContext.nodes[name || propertyKey] = descriptor.value.call(target, ...dependencies);
        };
        return evaluation;
    }

    public static inject(name?: string): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor) {
            return <any> {
                ...descriptor,
                value: function () {
                    return ExpressBootContext.nodes[name || propertyKey];
                }
            };
        };
        return evaluation;
    }

    public static requestHandle(path: string, method?: ExpressBootHTTPMethod, priority = -1): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            const handler: RequestHandler = function (request, response, next) {
                descriptor.value.call(target, request, response, next);
            }

            if (!method) {
                if (!ExpressBootContext.requestMiddlewares[priority]) {
                    ExpressBootContext.requestMiddlewares[priority] = [];
                }
                ExpressBootContext.requestMiddlewares[priority].push({
                    path,
                    middleware: handler
                })
            }
            else {
                ExpressBootContext.requestHandlers.push({
                    path, method, handler
                });
            }
        };
        return evaluation;
    }

    public static get(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'GET');
    }

    public static post(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'POST');
    }

    public static put(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'PUT');
    }

    public static delete(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'DELETE');
    }

    public static patch(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'PATCH');
    }

    public static options(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'OPTIONS');
    }

    public static head(path: string): MethodDecorator {
        return ExpressBootContext.requestHandle(path, 'HEAD');
    }

    public static middleware(path: string, priority?: number) {
        return ExpressBootContext.requestHandle(path, undefined, priority);
    }

    public static cors<T extends ExpressBootRequestHandlerProvider>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
        ExpressBootContext.corsConfigurer = function () {
            return descriptor.value.call(target);
        };
    }

    public static multer<T extends ExpressBootRequestHandlerProvider>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
        ExpressBootContext.multerConfigurer = function () {
            return descriptor.value.call(target);
        };
    }

    public static script<T extends ExpressBootScript>(priority: number = -1, ...dependencies: (string | symbol)[]) {
        function evaluation(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
            if (!ExpressBootContext.scripts[priority]) {
                ExpressBootContext.scripts[priority] = [];
            }
            ExpressBootContext.scripts[priority].push(
                function () {
                    descriptor.value.call(target, ...dependencies.map(dependency => ExpressBootContext.nodes[dependency]));
                }
            )
        };
        return evaluation;
    }

    // Constructors:
    public constructor() {

    }

    // Methods:
    public getNode(name: string): any {
        return ExpressBootContext.nodes[name];
    }

    public getNodes(): ExpressBootNode[] {
        return Object.keys(ExpressBootContext.nodes)
            .map(
                name => ({
                    name,
                    value: ExpressBootContext.nodes[name]
                })
            );
    }

    public getRequestHandlers(): ExpressBootRequestHandler[] {
        return ExpressBootContext.requestHandlers;
    }

    public getRequestMiddlewares(): ExpressBootRequestMiddleware[] {
        return Object.keys(ExpressBootContext.requestMiddlewares)
            .map(
                priority => Number.parseInt(priority)
            )
            .map(
                (priority, index, array) => (
                    priority >= 0
                    ?
                    priority
                    :
                    array.length
                )
            )
            .sort(
                (a, b) => a - b
            )
            .map(
                priority => ExpressBootContext.requestMiddlewares[priority]
            )
            .flat(1);
    }

    public getCorsConfigurer(): ExpressBootRequestHandlerProvider {
        return ExpressBootContext.corsConfigurer;
    }

    public getMulterConfigurer(): ExpressBootRequestHandlerProvider {
        return ExpressBootContext.multerConfigurer;
    }

    public getScripts(): ExpressBootScript[] {
        return Object.keys(ExpressBootContext.scripts)
            .map(
                str => Number.parseInt(str)
            )
            .map(
                (priority, index, array) => (
                    priority >= 0
                    ?
                    priority
                    :
                    array.length
                )
            )
            .sort(
                (a, b) => a - b
            )
            .map(
                priority => ExpressBootContext.scripts[priority]
            )
            .flat(1);
    }

    public async load(path: string): Promise<void> {
        const filePaths: string[] = fs.readdirSync(
            path, { encoding: null, recursive: true }
        );

        for (const filePath of filePaths) {
            await import(filePath);
        }
    }
}