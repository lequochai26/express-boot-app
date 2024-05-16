import IdGenerateStrategy from "./enums/IdGenerateStrategy";
import ExpressBootContext from "./ExpressBootContext";
import Hasher from "./interfaces/Hasher";
import IdGenerator from "./interfaces/IdGenerator";

@ExpressBootContext.node("idGenerator")
export default class ExpressBootIdGenerator implements IdGenerator {
    // Dependencies:
    @ExpressBootContext.inject()
    private hasher(): Hasher { return null; }

    // Constructors:
    public constructor() {

    }

    // Methods:
    public generate(strategy: IdGenerateStrategy): string {
        switch (strategy) {
            case IdGenerateStrategy.TIME: return this.hasher().hash(
                new Date()
                    .getTime()
                    .toString(),
                HashAlgorithm.SHA256
            );
        }
    }   
}