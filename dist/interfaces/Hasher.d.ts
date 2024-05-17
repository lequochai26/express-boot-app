import HashAlgorithm from "../enums/HashAlgorithm";
/**
 * Text hasher
 */
export default interface Hasher {
    /**
     * Hash a text with specific hashing algorithm
     * @param content Content to be hash
     * @param algorithm Hashing algorithm
     */
    hash(content: string, algorithm: HashAlgorithm): string;
}
