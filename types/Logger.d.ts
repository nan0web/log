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
 */
/**
 * Logger class for handling different log levels
 * Supports debug, info, warn, error, and log methods
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
     * Returns input if already a Logger, otherwise creates new instance
     *
     * @param {Object|string} input - Raw input for configuration or log level string
     * @returns {Logger} - New instance with validated configuration
     */
    static from(input: any | string): Logger;
    /**
     * Detect log level from command line arguments
     * @param {string[]} argv - Command line arguments
     * @returns {string | undefined} Level
     */
    static detectLevel(argv?: string[]): string | undefined;
    /**
     * Create a LoggerFormat instance from input
     * @param {string | object} name - Format name or options object
     * @param {any | undefined} value - Format value (if name is a string)
     * @returns {LoggerFormat}
     */
    static createFormat(name: string | object, value: any | undefined): LoggerFormat;
    /**
     * Style a value with background and text colors
     * @param {any} value - Value to style
     * @param {object} styleOptions - Styling options
     * @param {string} [styleOptions.bgColor] - Background color
     * @param {string} [styleOptions.color] - Text color
     * @param {boolean} [styleOptions.stripped=false] - If true, strip ANSI codes instead of applying
     * @returns {string} - Styled value as a string
     */
    static style(value: any, styleOptions?: {
        bgColor?: string | undefined;
        color?: string | undefined;
        stripped?: boolean | undefined;
    }): string;
    /**
     * Strip ANSI escape codes from a string
     * @param {string} str - Input string with potential ANSI codes
     * @returns {string} - String without ANSI codes
     */
    static stripANSI(str: string): string;
    /**
     * Calculate progress percentage
     * @param {number} i - Current progress value
     * @param {number} len - Total progress length
     * @param {number} fixed - Number of decimal places to fix
     * @returns {string} - Progress percentage as a string
     */
    static progress(i: number, len: number, fixed?: number): string;
    /**
     * Calculate time elapsed since checkpoint
     * @param {number} checkpoint - Timestamp to calculate from
     * @param {number} fixed - Number of decimal places to fix
     * @returns {string} - Time elapsed in seconds as a string
     */
    static spent(checkpoint: number, fixed?: number): string;
    /**
     * Format time duration
     * @param {number} duration - Duration in milliseconds
     * @param {string} format - Format string (e.g., DD HH:mm:ss.SSS)
     * @returns {string} - Formatted time string
     */
    static toTime(duration: number, format?: string): string;
    /**
     * Create a progress bar
     * @param {number} i - Current progress index
     * @param {number} len - Total progress length
     * @param {number} width - Progress bar width
     * @param {string} char - Progress bar character
     * @param {string} space - Space character
     * @returns {string} - Progress bar string
     */
    static bar(i: number, len: number, width?: number, char?: string, space?: string): string;
    /**
     * @param {string | LoggerOptions} options
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
    currentLevel: any;
    /** @returns {boolean} */
    get isTTY(): boolean;
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
     * @param {string} str - Arguments to log
     */
    broadcast(str: string): Promise<void>;
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
    /**
     * Log success info message
     * @param {...any} args - Arguments to log
     */
    success(...args: any[]): void;
    /**
     * Log message
     * @param {...any} args - Arguments to log
     */
    log(...args: any[]): void;
    /**
     * Format table data
     * @param {Array<any>} data - Table data
     * @param {string[]} columns - Columns to filter
     * @param {object} options - Format options
     * @param {Array<number>} [options.widths=[]] - Column widths
     * @param {string} [options.space=" "] - Space character
     * @param {number} [options.padding=1] - Padding width
     * @param {string|string[]} [options.aligns="left"] - Text aligns
     * @param {string} [options.prefix=""] - Text prefix
     * @param {boolean} [options.silent=false] - If silent no output provided
     * @param {number} [options.border=0]
     * @param {number} [options.headBorder=0]
     * @param {number} [options.footBorder=0]
     * @returns {string[]} - Formatted table rows
     */
    table(data: Array<any>, columns: string[], options?: {
        widths?: number[] | undefined;
        space?: string | undefined;
        padding?: number | undefined;
        aligns?: string | string[] | undefined;
        prefix?: string | undefined;
        silent?: boolean | undefined;
        border?: number | undefined;
        headBorder?: number | undefined;
        footBorder?: number | undefined;
    }): string[];
    /**
     * Move cursor up in the terminal
     * @param {number} [lines] - Number of lines to move up
     * @param {boolean} [clearLines] - If true uses this.clearLine() for every line of lines.
     * @returns {string} - Cursor up sequence string
     *
     * @example
     * logger.cursorUp(3, true) // clear lines and returns the string
     * logger.cursorUp(3) // returns the string
     */
    cursorUp(lines?: number | undefined, clearLines?: boolean | undefined): string;
    /**
     * Move cursor down in the terminal
     * ```js
     * const logger = new Logger()
     * logger.info("This is a progress")
     * logger.info(logger.cursorDown())
     * logger.info("Under the previous line")
     * ```
     * @param {number} lines - Number of lines to move down
     * @returns {string} - Cursor down sequence string
     */
    cursorDown(lines?: number): string;
    /**
     * Write string directly to stdout
     * @param {string} str - String to write
     */
    write(str: string): void;
    /**
     * Clear the entire terminal screen
     */
    clear(): void;
    /**
     * Clear the current line in terminal.
     * For progress use it with logger.cursorUp()
     * ```js
     * logger.clearLine(logger.cursorUp())
     * logger.info("The same line")
     * ```
     * @param {string} str - String to write before clearing
     */
    clearLine(str?: string): void;
    /**
     * Returns array is of the type `[numColumns, numRows]` where `numColumns` and
     * `numRows` represent the number of columns and rows in the corresponding TTY.
     * @returns {number[]}
     */
    getWindowSize(): number[];
    /**
     * Cuts a string to fit within a specified width, taking into account
     * visible string width (including handling of ANSI codes, full-width characters, etc.).
     *
     * @param {string} str - The input string to cut
     * @param {number} [width=this.getWindowSize()[0]] - Maximum width allowed for the string.
     *   If not provided, defaults to the current terminal window width.
     * @returns {string} The original string if it fits within the width,
     *   otherwise the string truncated to fit the specified width.
     *
     * @example
     * // Assuming terminal width is 80
     * cut("Hello, world!") // returns "Hello, world!"
     * cut("Hello".repeat(20), 13) // returns "HelloHelloHel" (truncated to fit 13 columns)
     */
    cut(str: string, width?: number | undefined): string;
    /**
     * Erase the previous line by covering it with spaces or specified character
     * @param {string} char - Character to use for erasing (default: space)
     * @returns {string} - Erase sequence string
     */
    erase(char?: string): string;
    /**
     * Store the last output line for potential erasing
     * @param {string} line - The line that was just output
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
};
import Console from "./Console.js";
import LoggerFormat from "./LoggerFormat.js";
