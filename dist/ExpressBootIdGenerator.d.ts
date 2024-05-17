import IdGenerateStrategy from "./enums/IdGenerateStrategy";
import IdGenerator from "./interfaces/IdGenerator";
export default class ExpressBootIdGenerator implements IdGenerator {
    private hasher;
    constructor();
    generate(strategy: IdGenerateStrategy): string;
}
