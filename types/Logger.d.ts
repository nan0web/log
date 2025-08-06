export default Logger;
/**
 * Logger class for handling different log levels
 * Supports debug, info, warn, error, and log methods
 */
declare class Logger {
    static DIM: string;
    static YELLOW: string;
    static BLUE: string;
    static PURPLE: string;
    static RED: string;
    static GREEN: string;
    static RESET: string;
    static LEVELS: {
        debug: number;
        info: number;
        warn: number;
        error: number;
        silent: number;
    };
    /**
     * Create Logger instance from input
     * Returns input if already a Logger, otherwise creates new instance
     *
     * @param {Object|string} input - Raw input for configuration or log level string
     * @returns {Logger} - New instance with validated configuration
     */
    static from(input: any | string): Logger;
    /**
     * @param {string[]} argv
     * @returns {string | undefined} Level
     */
    static detectLevel(argv?: string[]): string | undefined;
    /**
     * @param {string | object} name
     * @param {any | undefined} value
     * @returns
     */
    static createFormat(name: string | object, value: any | undefined): LoggerFormat;
    /**
     * @param {object | string} options - Logger configuration or level
     * @param {object} options
     * @param {string} [options.level='info'] - Minimum log level to output (debug|info|warn|error|silent)
     * @param {Console} [options.console=console] - Console instance to use for output
     */
    constructor(options?: object | string);
    /** @type {Map<string, LoggerFormat>} */
    formats: Map<string, LoggerFormat>;
    console: any;
    level: any;
    icons: boolean;
    chromo: boolean;
    currentLevel: any;
    _argsWith(target: any, ...args: any[]): any[];
    setFormat(target: any, opts: any): void;
    /**
     * Log debug message
     * @param {...any} args - Arguments to log
     */
    debug(...args: any[]): void;
    /**
     * Log info message
     * @param {...any} args - Arguments to log
     */
    info(...args: any[]): void;
    /**
     * Log warning message
     * @param {...any} args - Arguments to log
     */
    warn(...args: any[]): void;
    /**
     * Log error message
     * @param {...any} args - Arguments to log
     */
    error(...args: any[]): void;
    success(...args: any[]): void;
    /**
     * Log message
     * @param {...any} args - Arguments to log
     */
    log(...args: any[]): void;
}
declare class LoggerFormat {
    /**
     * @param {object} input
     * @returns {LoggerFormat}
     */
    static from(input: object): LoggerFormat;
    constructor(input?: {});
    /** @type {string} */
    icon: string;
    /** @type {string} */
    color: string;
}
