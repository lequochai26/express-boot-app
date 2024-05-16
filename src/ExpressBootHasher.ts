import ExpressBootContext from "./ExpressBootContext";
import Hasher from "./interfaces/Hasher";
import crypto from 'crypto';

@ExpressBootContext.node("hasher")
export default class ExpressBootHasher implements Hasher {
    // Constructor:
    public constructor() {
        
    }

    // Methods:
    public hash(content: string, algorithm: HashAlgorithm): string {
        switch (algorithm) {
            case HashAlgorithm.SHA256: {
                const hash = crypto.createHash('sha256');
                hash.update(content);
                return hash.digest('hex');
            }
        }
    }
}