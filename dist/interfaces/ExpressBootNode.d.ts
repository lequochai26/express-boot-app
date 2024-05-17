/**
 * Represent a node in ExpressBoot system
 */
export default interface ExpressBootNode {
    /**
     * Node name
     */
    name: string | symbol;
    /**
     * Node object
     */
    value: any;
}
