export default interface Hasher {
    hash(content: string, algorithm: HashAlgorithm): string;
}