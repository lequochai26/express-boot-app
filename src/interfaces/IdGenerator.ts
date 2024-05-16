import IdGenerateStrategy from "../enums/IdGenerateStrategy";

export default interface IdGenerator {
    generate(strategy: IdGenerateStrategy): string;
}