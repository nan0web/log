/**
 * @typedef {Object} LoggerOptions
 * @property {string} [level='info'] - Minimum log level to output (debug|info|warn|error|silent)
 * @property {Console} [console=console] - Console instance to use for output
 * @property {boolean} [icons=false] - Whether to show icons
 * @property {boolean} [chromo=false] - Whether to use colors
 * @property {string|boolean} [time=false] - Time format for logs
 * @property {boolean} [spent=false] - Whether to log spent time
 * @property {Function} [stream=null] - Stream function for output
 * @property {Array} [formats=[]] - Format map array for different levels with icons/colors config
 * @property {string} [prefix=''] - String to prepend to every log output (can contain ANSI styles)
 * @property {number} [fps] - Desired frames‑per‑second rate. If omitted, FPS throttling is disabled.
 */
/**
 * Logger class for handling different log levels.
 * Added optional FPS throttling.
 */
export default class Logger {
    static LOGO: string;
    static DIM: string;
    static BLACK: string;
    static RED: string;
    static GREEN: string;
    static YELLOW: string;
    static BLUE: string;
    static MAGENTA: string;
    static CYAN: string;
    static WHITE: string;
    static BG_BLACK: string;
    static BG_RED: string;
    static BG_GREEN: string;
    static BG_YELLOW: string;
    static BG_BLUE: string;
    static BG_MAGENTA: string;
    static BG_CYAN: string;
    static BG_WHITE: string;
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
     * @param {Object|string} input
     * @returns {Logger}
     */
    static from(input: any | string): Logger;
    /**
     * Detect log level from command line arguments
     * @param {string[]} argv
     * @returns {string|undefined}
     */
    static detectLevel(argv?: string[]): string | undefined;
    /**
     * Create a LoggerFormat instance from input
     * @param {string|object} name
     * @param {any|undefined} value
     * @returns {LoggerFormat}
     */
    static createFormat(name: string | object, value: any | undefined): LoggerFormat;
    /**
     * Style a value with background and text colors
     * @param {any} value
     * @param {object} styleOptions
     * @returns {string}
     */
    static style(value: any, styleOptions?: object): string;
    /**
     * Strip ANSI escape codes from a string
     * @param {string} str
     * @returns {string}
     */
    static stripANSI(str: string): string;
    /**
     * Calculate progress percentage
     * @param {number} i
     * @param {number} len
     * @param {number} fixed
     * @returns {string}
     */
    static progress(i: number, len: number, fixed?: number): string;
    /**
     * Calculate time elapsed since checkpoint
     * @param {number} checkpoint
     * @param {number} fixed
     * @returns {string}
     */
    static spent(checkpoint: number, fixed?: number): string;
    /**
     * Format time duration
     * @param {number} duration
     * @param {string} format
     * @returns {string}
     */
    static toTime(duration: number, format?: string): string;
    /**
     * Create a progress bar
     * @param {number} i
     * @param {number} len
     * @param {number} width
     * @param {string} char
     * @param {string} space
     * @returns {string}
     */
    static bar(i: number, len: number, width?: number, char?: string, space?: string): string;
    /**
     * @param {string|LoggerOptions} options
     */
    constructor(options?: string | LoggerOptions);
    /** @type {string} */
    level: string;
    /** @type {Console} */
    console: Console;
    /** @type {boolean} */
    icons: boolean;
    /** @type {boolean} */
    chromo: boolean;
    /** @type {Map<string, LoggerFormat>} */
    formats: Map<string, LoggerFormat>;
    /** @type {number} */
    at: number;
    /** @type {boolean|number} */
    spent: boolean | number;
    /** @type {string|boolean} */
    time: string | boolean;
    /** @type {Function|null} */
    stream: Function | null;
    /** @type {string[]} */
    _previousLines: string[];
    /** @type {string} */
    prefix: string;
    /** @type {number|null} FPS throttling – null disables throttling */
    fps: number | null;
    /** @type {number} */
    prev: number;
    currentLevel: any;
    /** @returns {boolean} */
    get isTTY(): boolean;
    /**
     * FPS throttle – returns true when throttling is disabled (fps === null)
     * or when enough time has passed.
     * @returns {boolean}
     */
    inFps(): boolean;
    /**
     * Prepare arguments with formatting for specified log level
     * @param {string} target - Log level target
     * @param {...any} args - Arguments to format
     * @returns {string}
     */
    _argsWith(target: string, ...args: any[]): string;
    /**
     * Set format for a log level
     * @param {string} target - Log level target
     * @param {object} opts - Format options
     */
    setFormat(target: string, opts: object): void;
    /**
     * Set stream function for output
     * @param {Function} streamFunction - Function to handle streaming output
     */
    setStream(streamFunction: Function): void;
    /**
     * Log to a stream. Use setStream() to define stream function.
     * @param {string} str
     */
    broadcast(str: string): Promise<void>;
    /**
     * Calculate how many terminal rows a string will occupy.
     *
     * @param {string} str - Formatted string to evaluate
     * @returns {number} Number of rows needed
     */
    _calculateRows(str: string): number;
    /**
     * Prints a message
     * @param {string} level
     * @param {...any} args
     * @returns {number}
     */
    _print(level: string, ...args: any[]): number;
    /**
     * Log debug message
     * @param {...any} args
     * @returns {number}
     */
    debug(...args: any[]): number;
    /**
     * Log info message
     * @param {...any} args
     * @returns {number}
     */
    info(...args: any[]): number;
    /**
     * Log warning message
     * @param {...any} args
     * @returns {number}
     */
    warn(...args: any[]): number;
    /**
     * Log error message
     * @param {...any} args
     * @returns {number}
     */
    error(...args: any[]): number;
    /**
     * Log success info message
     * @param {...any} args
     * @returns {number}
     */
    success(...args: any[]): number;
    /**
     * Log generic message
     * @param {...any} args
     * @returns {number|undefined}
     */
    log(...args: any[]): number | undefined;
    /**
     * Format table data
     * @param {Array<any>} data
     * @param {string[]} columns
     * @param {object} options
     * @returns {string[]}
     */
    table(data: Array<any>, columns: string[], options?: object): string[];
    /**
     * Move cursor up in the terminal
     * @param {number} [lines] - Number of lines to move up
     * @param {boolean} [clearLines] - If true uses this.clearLine() for every line of lines.
     * @returns {string}
     */
    cursorUp(lines?: number | undefined, clearLines?: boolean | undefined): string;
    /**
     * Move cursor down in the terminal
     * @param {number} lines - Number of lines to move down
     * @returns {string}
     */
    cursorDown(lines?: number): string;
    /**
     * Write string directly to stdout
     * @param {string} str
     */
    write(str: string): void;
    /**
     * Clear the entire terminal screen
     */
    clear(): void;
    /**
     * Clear the current line in terminal.
     * @param {string} str - String to write before clearing
     */
    clearLine(str?: string): void;
    /**
     * Returns array `[numColumns, numRows]` of the TTY size.
     * @returns {number[]}
     */
    getWindowSize(): number[];
    /**
     * Cuts a string to fit within a specified width.
     * @param {string} str
     * @param {number} [width=this.getWindowSize()[0]]
     * @returns {string}
     */
    cut(str: string, width?: number | undefined): string;
    /**
     * Erase the previous line by covering it with spaces or a character.
     * @param {string} char
     * @returns {string}
     */
    erase(char?: string): string;
    /**
     * Store the last output line for potential erasing
     * @param {string} line
     * @private
     */
    private _storeLine;
}
export type LoggerOptions = {
    /**
     * - Minimum log level to output (debug|info|warn|error|silent)
     */
    level?: string | undefined;
    /**
     * - Console instance to use for output
     */
    console?: Console | undefined;
    /**
     * - Whether to show icons
     */
    icons?: boolean | undefined;
    /**
     * - Whether to use colors
     */
    chromo?: boolean | undefined;
    /**
     * - Time format for logs
     */
    time?: string | boolean | undefined;
    /**
     * - Whether to log spent time
     */
    spent?: boolean | undefined;
    /**
     * - Stream function for output
     */
    stream?: Function | undefined;
    /**
     * - Format map array for different levels with icons/colors config
     */
    formats?: any[] | undefined;
    /**
     * - String to prepend to every log output (can contain ANSI styles)
     */
    prefix?: string | undefined;
    /**
     * - Desired frames‑per‑second rate. If omitted, FPS throttling is disabled.
     */
    fps?: number | undefined;
};
import Console from "./Console.js";
import LoggerFormat from "./LoggerFormat.js";
