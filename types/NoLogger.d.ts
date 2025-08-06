export default NoLogger;
declare class NoLogger extends Logger {
    constructor(options?: {});
    /** @type {NoConsole} */
    console: NoConsole;
    output(): any[];
}
import Logger from "./Logger.js";
declare class NoConsole {
    clear(): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    log(...args: any[]): void;
    output(): any[];
    #private;
}
