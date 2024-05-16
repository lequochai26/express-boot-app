import IdGenerateStrategy from "../enums/IdGenerateStrategy";

/**
 * ID Generator
 */
export default interface IdGenerator {
    /**
     * Generate an id string with specific id generation strategy.
     * @param strategy ID generation strategy
     * @returns Generated id
     */
    generate(strategy: IdGenerateStrategy): string;
}