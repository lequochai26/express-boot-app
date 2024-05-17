/**
 * Represent a logger in ExpressBoot system
 */
export default interface Logger {
    /**
     * Info log
     * @param content Content
     */
    info(content: string): void;

    /**
     * Warning log
     * @param content Content
     */
    warning(content: string): void;

    /**
     * Error log
     * @param content Content
     */
    error(content: string): void;
}