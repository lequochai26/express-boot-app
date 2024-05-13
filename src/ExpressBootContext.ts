@ExpressBootContext.node("context")
export default class ExpressBootContext {
    // STATIC
    // Static fields:
    /**
     * Nodes storage.
     */
    static nodes: { [ index: string | symbol ]: any } = {};

    // Decorators:
    /**
     * Define a node through class with node name as given
     * @param name - node name
     */
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

    /**
     * Define a node through config method with node name as method's name
     * @param dependencies - dependencies will be inject into config methods
     */
    public static configNode(...dependencies: string[]): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor: any) {
            ExpressBootContext.nodes[propertyKey] = descriptor.value.call(
                target,
                ...dependencies.map(
                    dependency => ExpressBootContext.nodes[dependency]
                )
            );
            
            return {
                ...descriptor,
                value: function () {
                    return ExpressBootContext.nodes[propertyKey];
                }
            };
        }

        return evaluation;
    }

    /**
     * Inject dependency into method with method's name as node name.
     * @returns New method which will return dependency on call
     */
    public static inject(): MethodDecorator {
        const evaluation: MethodDecorator = function (target, propertyKey, descriptor) {
            return <any> {
                ...descriptor,
                value: function () {
                    return ExpressBootContext.nodes[propertyKey]
                }
            }
        }
        return evaluation;
    }

    // INSTANCE
    // Constructors:
    public constructor() {

    }

    // Methods:
    public getNode(name: string): any {
        return ExpressBootContext.nodes[name];
    }

    public getNodes(): any[] {
        return Object.values(
            ExpressBootContext.nodes
        );
    }
}