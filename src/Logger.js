import stringWidth from "string-width"
import { empty } from "@nan0web/types"
import LoggerFormat from "./LoggerFormat.js"
import Console from "./Console.js"

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
 */

/**
 * Logger class for handling different log levels
 * Supports debug, info, warn, error, and log methods
 */
export default class Logger {
	static LOGO = [
		"__   _ _______ __   _     _  _  _ _______ ______ ",
		"| \\  | |_____| | \\  |     |  |  | |______ |_____] ",
		"|  \\_| |     | |  \\_|  •  |__|__| |______ |_____] ",
		"                                                 ",
		"",
	].join("\n")
	static DIM = '\x1b[2m'
	static BLACK = "\x1b[30m"
	static RED = '\x1b[31m'
	static GREEN = '\x1b[32m'
	static YELLOW = '\x1b[33m'
	static BLUE = '\x1b[34m'
	static MAGENTA = '\x1b[35m'
	static CYAN = '\x1b[36m'
	static WHITE = '\x1b[37m'
	static BG_BLACK = '\x1b[40m'
	static BG_RED = '\x1b[41m'
	static BG_GREEN = '\x1b[42m'
	static BG_YELLOW = '\x1b[43m'
	static BG_BLUE = '\x1b[44m'
	static BG_MAGENTA = '\x1b[45m'
	static BG_CYAN = '\x1b[46m'
	static BG_WHITE = '\x1b[47m'
	static RESET = '\x1b[0m'
	static LEVELS = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
		silent: 4
	}
	/** @type {string} */
	level
	/** @type {Console} */
	console
	/** @type {boolean} */
	icons
	/** @type {boolean} */
	chromo
	/** @type {Map<string, LoggerFormat>} */
	formats
	/** @type {number} */
	at
	/** @type {boolean|number} */
	spent
	/** @type {string|boolean} */
	time
	/** @type {Function|null} */
	stream
	/** @type {string[]} */
	_previousLines = []

	/**
	 * @param {string | LoggerOptions} options
	 */
	constructor(options = {}) {
		if ("string" === typeof options) {
			options = { level: options }
		}
		const {
			level = 'info',
			console: consoleInstance = console,
			icons = false,
			chromo = false,
			time = false,
			spent = false,
			stream = null,
			formats = [
				["debug", { icon: "•", color: Logger.DIM }],
				["log", { icon: "•" }],
				["info", { icon: "ℹ" }],
				["warn", { icon: "∆", color: Logger.YELLOW }],
				["error", { icon: "!", color: Logger.RED }],
				["success", { icon: "✓", color: Logger.GREEN }],
			]
		} = options

		// @ts-ignore
		this.console = new Console({ console: consoleInstance })
		this.level = level
		this.icons = Boolean(icons)
		this.chromo = Boolean(chromo)
		this.time = time
		this.spent = Boolean(spent)
		this.stream = stream
		this.at = Date.now()

		this.formats = new Map(formats)
		this.formats.forEach(
			(opts, target) => this.formats.set(target, LoggerFormat.from(opts))
		)
		this.currentLevel = Logger.LEVELS[this.level] ?? 1
	}

	/**
	 * Prepare arguments with formatting for specified log level
	 * @param {string} target - Log level target
	 * @param {...any} args - Arguments to format
	 * @returns {string}
	 */
	_argsWith(target, ...args) {
		let format = new LoggerFormat(this.formats.get(target))
		if (!this.icons) format.icon = ""
		if (this.chromo) format.color = ""
		if (args[0] instanceof LoggerFormat) {
			format = new LoggerFormat(args[0])
			args = args.slice(1)
		}
		if (!format.icon && this.icons) {
			format.icon = {
				debug: "•",
				log: "•",
				info: "ℹ",
				warn: "∆",
				error: "!",
				success: "✓",
			}[target] || "•"
		}
		if (!format.color) {
			format.color = {
				debug: Logger.DIM,
				log: "",
				info: "",
				warn: Logger.YELLOW,
				error: Logger.RED,
				success: Logger.GREEN,
			}[target] || ""
		}

		const logArgs = []

		// Add timestamp if enabled
		if (this.time) {
			const timestamp = new Date().toISOString()
			logArgs.push(timestamp)
		}

		// Add spent time if enabled
		if (this.spent !== false) {
			logArgs.push(Logger.spent(this.at, true === this.spent ? 3 : this.spent))
			this.at = Date.now()
		}

		const prefix = []

		if (format.icon) logArgs.push(format.icon)
		if (!this.chromo && (format.color || format.bgColor)) {
			if (format.bgColor) prefix.unshift(format.bgColor)
			if (format.color) prefix.unshift(format.color)
		}
		logArgs.push(...args)
		return prefix.length ? prefix.join("") + logArgs.join(" ") + Logger.RESET : logArgs.join(" ")
	}

	/**
	 * Set format for a log level
	 * @param {string} target - Log level target
	 * @param {object} opts - Format options
	 */
	setFormat(target, opts) {
		this.formats.set(target, LoggerFormat.from(opts))
	}

	/**
	 * Set stream function for output
	 * @param {Function} streamFunction - Function to handle streaming output
	 */
	setStream(streamFunction) {
		this.stream = streamFunction
	}

	/**
	 * Log to a stream. Use setStream() to define stream function.
	 * @param {string} str - Arguments to log
	 */
	async broadcast(str) {
		if (!this.stream) return
		try {
			await this.stream(str)
			return
		} catch (error) {
			// Fallback to file writing or console error if stream fails
			this.error("Failed to write to stream:", error)
		}
	}

	/**
	 * Log debug message
	 * @param {...any} args - Arguments to log
	 */
	debug(...args) {
		if (this.currentLevel <= 0) {
			const str = this._argsWith("debug", ...args)
			this.console.debug(str)
			this._storeLine(str)
			this.broadcast(str)
		}
	}

	/**
	 * Log info message
	 * @param {...any} args - Arguments to log
	 */
	info(...args) {
		if (this.currentLevel <= 1) {
			const str = this._argsWith("info", ...args)
			this.console.info(str)
			this._storeLine(str)
			this.broadcast(str)
		}
	}

	/**
	 * Log warning message
	 * @param {...any} args - Arguments to log
	 */
	warn(...args) {
		if (this.currentLevel <= 2) {
			const str = this._argsWith("warn", ...args)
			this.console.warn(str)
			this._storeLine(str)
			this.broadcast(str)
		}
	}

	/**
	 * Log error message
	 * @param {...any} args - Arguments to log
	 */
	error(...args) {
		if (this.currentLevel <= 3) {
			const str = this._argsWith("error", ...args)
			this.console.error(str)
			this._storeLine(str)
			this.broadcast(str)
		}
	}

	/**
	 * Log success info message
	 * @param {...any} args - Arguments to log
	 */
	success(...args) {
		if (this.currentLevel <= 1) {
			const str = this._argsWith("success", ...args)
			this.console.info(str)
			this._storeLine(str)
			this.broadcast(str)
		}
	}

	/**
	 * Log message
	 * @param {...any} args - Arguments to log
	 */
	log(...args) {
		if (this.currentLevel <= 1) {
			const str = this._argsWith("log", ...args)
			this.console.log(str)
			this._storeLine(str)
			this.broadcast(str)
		}
	}

	/**
	 * Create Logger instance from input
	 * Returns input if already a Logger, otherwise creates new instance
	 *
	 * @param {Object|string} input - Raw input for configuration or log level string
	 * @returns {Logger} - New instance with validated configuration
	 */
	static from(input) {
		if (input instanceof Logger) return input
		if (typeof input === 'string') return new Logger({ level: input })
		return new Logger(input)
	}

	/**
	 * Detect log level from command line arguments
	 * @param {string[]} argv - Command line arguments
	 * @returns {string | undefined} Level
	 */
	static detectLevel(argv = []) {
		for (const arg of argv) {
			const a = arg.startsWith("--") ? arg.slice(2) : ""
			if (undefined !== Logger.LEVELS[a]) {
				return arg.slice(2)
			}
		}
		return undefined
	}

	/**
	 * Create a LoggerFormat instance from input
	 * @param {string | object} name - Format name or options object
	 * @param {any | undefined} value - Format value (if name is a string)
	 * @returns {LoggerFormat}
	 */
	static createFormat(name, value) {
		if ("string" === typeof name) {
			return new LoggerFormat({ [name]: value })
		}
		return new LoggerFormat(name)
	}

	/**
	 * Style a value with background and text colors
	 * @param {any} value - Value to style
	 * @param {object} styleOptions - Styling options
	 * @param {string} [styleOptions.bgColor] - Background color
	 * @param {string} [styleOptions.color] - Text color
	 * @returns {string} - Styled value as a string
	 */
	static style(value, styleOptions = {}) {
		if ("string" === typeof value) value = value.split("\n")
		if (!Array.isArray(value)) value = String(value).split("\n")
		const { bgColor, color } = styleOptions
		const styledValue = []

		value.map(String).forEach(row => {
			if (color) styledValue.push(Logger[color.toUpperCase()] || color)
			if (bgColor) styledValue.push(Logger[`BG_${bgColor.toUpperCase()}`] || bgColor)
			styledValue.push(row)
			styledValue.push(Logger.RESET)
			styledValue.push("\n")
		})
		return styledValue.join("").slice(0, -1)
	}

	/**
	 * Calculate progress percentage
	 * @param {number} i - Current progress value
	 * @param {number} len - Total progress length
	 * @param {number} fixed - Number of decimal places to fix
	 * @returns {string} - Progress percentage as a string
	 */
	static progress(i, len, fixed = 1) {
		if (len === 0) return '0'
		return (100 * i / len).toFixed(fixed)
	}

	/**
	 * Calculate time elapsed since checkpoint
	 * @param {number} checkpoint - Timestamp to calculate from
	 * @param {number} fixed - Number of decimal places to fix
	 * @returns {string} - Time elapsed in seconds as a string
	 */
	static spent(checkpoint, fixed = 2) {
		return ((Date.now() - checkpoint) / 1_000).toFixed(fixed)
	}

	/**
	 * Format time duration
	 * @param {number} duration - Duration in milliseconds
	 * @param {string} format - Format string (e.g., DD HH:mm:ss.SSS)
	 * @returns {string} - Formatted time string
	 */
	static toTime(duration, format = 'DD HH:mm:ss.SSS') {
		const dur = new Date(duration)
		const base = new Date(0)
		base.setMilliseconds(dur.getMilliseconds())
		base.setSeconds(dur.getSeconds())
		base.setMinutes(dur.getMinutes())
		base.setHours(dur.getHours())

		const days = String(Math.floor(duration / (24 * 60 * 60 * 1_000))).padStart(2, '0')

		if (format.includes('DD')) {
			const timeFormat = format.replace('DD', '')
			const timePart = base.toISOString().substr(11, 12)
			return format.replace('DD', days).replace(timeFormat.trim(), timePart)
		} else {
			return base.toISOString().substr(11, 12)
		}
	}

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
	table(data, columns, options = {}) {
		const {
			widths = [], space = ' ', padding = 1, aligns = 'left', prefix = "",
			silent = false, border = 0, headBorder = 0, footBorder = 0
		} = options
		if (!Array.isArray(data) || data.length === 0) return []

		// Normalize data
		let rows
		if (empty(columns)) {
			rows = data.map(row =>
				Array.isArray(row) ? row.map(String) : Object.values(row).map(String)
			)
		} else {
			// Filter columns if specified
			rows = data.map(row => {
				if (Array.isArray(row)) {
					return columns.map(col => String(row[columns.indexOf(col)]))
				} else {
					return columns.map(col => String(row[col]))
				}
			})
		}

		const cols = Math.max(...rows.map(r => r.length))

		// Normalize aligns to array
		const alignArr = Array.isArray(aligns)
			? aligns
			: Array(cols).fill(aligns)

		// Calculate column widths
		for (let i = 0; i < cols; i++) {
			const max = Math.max(
				...(rows.map(row => padding + (stringWidth(row[i] || "") || 0))),
				widths[i] || 0
			)
			widths[i] = Math.max(max, String(columns?.[i] || "").length)
		}

		const textPadding = (cell, i, len) => {
			const width = widths[i]
			const align = alignArr[i] || 'left'
			const padLen = Math.max(0, width - stringWidth(cell))
			let paddedCell = cell
			if (align === 'right') {
				if (i === len - 1) {
					paddedCell = space.repeat(padLen) + cell
				} else {
					paddedCell = space.repeat(Math.max(0, padLen - padding)) + cell + space.repeat(padding)
				}
			} else if (align === 'center') {
				const left = Math.floor(padLen / 2)
				const right = padLen - left
				paddedCell = space.repeat(left) + cell + space.repeat(right)
			} else {
				// default to left alignment
				paddedCell = cell + space.repeat(padLen)
			}
			return paddedCell
		}

		const result = []
		// Format and print each row
		for (const row of rows) {
			const line = row.map((cell = '', i) => textPadding(cell, i, row.length)).join('')
			result.push(line)
		}

		// Add header if columns are specified
		if (!empty(columns)) {
			const header = columns.map((col, i) => textPadding(col, i, columns.length)).join('')
			result.unshift(header)
		}

		// Add borders
		if (border > 0) {
			const borderLine = "-".repeat(Math.max(...result.map(r => r.length)) + prefix.length)
			// @todo add vertical |
			result.unshift(borderLine)
			result.push(borderLine)
		}

		if (headBorder > 0 && !empty(columns)) {
			const headerLength = result[0].length
			const headBorderLine = "-".repeat(headerLength)
			result.splice(1 + border, 0, headBorderLine)
		}

		if (footBorder > 0) {
			const resultLength = result.length
			const footBorderLine = "-".repeat(result[resultLength - 1].length)
			result.splice(resultLength - 1, 0, footBorderLine)
		}

		if (!silent) {
			for (let row of result) {
				if (prefix) row = prefix + row
				const formatted = this._argsWith("info", row)
				this.console.info(formatted)
				this._storeLine(formatted)
				this.broadcast(formatted)
			}
		}
		return result
	}

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
	cursorUp(lines = 1, clearLines = false) {
		const str = `\x1b[${lines}A`
		if (!clearLines) return str
		this.write(str)
		for (let i = 0; i < Math.abs(lines); i++) {
			this.clearLine()
			// this.write("\n")
		}
		this.console.info(str)
		return str
	}

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
	cursorDown(lines = 1) {
		return `\x1b[${lines}B`
	}

	/**
	 * Write string directly to stdout
	 * @param {string} str - String to write
	 */
	write(str) {
		if ("undefined" === typeof process?.stdout?.write) {
			this.console.info(str)
			return
		}
		process.stdout.write(str)
	}

	/**
	 * Clear the entire terminal screen
	 */
	clear() {
		if ("undefined" === typeof process?.stdout) {
			return this.console.clear()
		}
		this.write('\x1b[2J\x1b[0;0H')
	}

	/**
	 * Clear the current line in terminal.
	 * For progress use it with logger.cursorUp()
	 * ```js
	 * logger.clearLine(logger.cursorUp())
	 * logger.info("The same line")
	 * ```
	 * @param {string} str - String to write before clearing
	 */
	clearLine(str = "") {
		if ("undefined" === typeof process?.stdout) {
			return this.console.clear()
		}
		if ("" !== str) this.write(str)
		this.write('\x1b[2K\r')
	}

	/**
	 * Returns array is of the type `[numColumns, numRows]` where `numColumns` and
	 * `numRows` represent the number of columns and rows in the corresponding TTY.
	 * @returns {number[]}
	 */
	getWindowSize() {
		if ("undefined" === typeof process?.stdout?.getWindowSize) {
			return [80, 40]
		}
		return process.stdout.getWindowSize()
	}

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
	cut(str, width = this.getWindowSize()[0]) {
		const length = stringWidth(str)
		return length > width ? str.slice(0, width) : str
	}

	/**
	 * Erase the previous line by covering it with spaces or specified character
	 * @param {string} char - Character to use for erasing (default: space)
	 * @returns {string} - Erase sequence string
	 */
	erase(char = " ") {
		if (this._previousLines.length === 0) {
			return ""
		}

		const lastLine = this._previousLines[this._previousLines.length - 1]
		if (!lastLine) {
			return ""
		}
		const windowSize = this.getWindowSize()
		const columns = windowSize[0]

		return char.repeat(Math.max(0, columns - lastLine.length))
	}

	/**
	 * Store the last output line for potential erasing
	 * @param {string} line - The line that was just output
	 * @private
	 */
	_storeLine(line) {
		this._previousLines.push(line)
		if (this._previousLines.length > 10) {
			this._previousLines.shift()
		}
	}

	/**
	 * Create a progress bar
	 * @param {number} i - Current progress index
	 * @param {number} len - Total progress length
	 * @param {number} width - Progress bar width
	 * @param {string} char - Progress bar character
	 * @param {string} space - Space character
	 * @returns {string} - Progress bar string
	 */
	static bar(i, len, width = 12, char = '█', space = '·') {
		if (0 === len) len = Number.MAX_SAFE_INTEGER
		const percent = ((i + 1) / len) * 100
		const filled = Math.floor((percent / 100) * width)
		const suffix = ` ${percent.toFixed(2)}%`
		return `${char.repeat(filled)}${space.repeat(Math.max(0, width - filled))}${suffix}`
	}
}
