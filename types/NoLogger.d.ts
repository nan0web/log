export default NoLogger;
declare class NoLogger extends Logger {
    /**
     * Creates a new NoLogger instance.
     * @param {Object} [options={}] - The options for the logger
     */
    constructor(options?: any);
    /** @type {NoConsole} */
    console: NoConsole;
    /**
     * Returns the logged output.
     * @returns {Array<Array<*>>} The array of logged messages
     */
    output(): Array<Array<any>>;
}
import Logger from "./Logger.js";
import NoConsole from "./NoConsole.js";
