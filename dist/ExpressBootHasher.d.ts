import HashAlgorithm from "./enums/HashAlgorithm";
import Hasher from "./interfaces/Hasher";
export default class ExpressBootHasher implements Hasher {
    constructor();
    hash(content: string, algorithm: HashAlgorithm): string;
}
