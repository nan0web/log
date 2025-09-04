export default NoConsole;
/**
 * A console wrapper that stores logs in memory instead of outputting them.
 * Useful for testing or capturing logs for later processing.
 */
declare class NoConsole extends Console {
    /**
     * @param {object} input
     * @returns {NoConsole}
     */
    static from(input: object): NoConsole;
    constructor(options?: {});
    silent: boolean;
    /**
     * Returns all stored logs.
     * @returns {Array<Array<*>>} An array of log entries, each containing the log level and arguments
     */
    output(): Array<Array<any>>;
    #private;
}
import Console from "./Console.js";
