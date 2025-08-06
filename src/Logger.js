class LoggerFormat {
	/** @type {string} */
	icon
	/** @type {string} */
	color
	constructor(input = {}) {
		const {
			icon = "",
			color = "",
		} = input
		this.icon = String(icon)
		this.color = String(color)
	}
	/**
	 * @param {object} input
	 * @returns {LoggerFormat}
	 */
	static from(input) {
		if (input instanceof LoggerFormat) return input
		return new LoggerFormat(input)
	}
}

/**
 * Logger class for handling different log levels
 * Supports debug, info, warn, error, and log methods
 */
class Logger {
	// @todo fix codes for
	static DIM = '\x1b[2m'
	// @todo fix codes for
	static YELLOW = '\x1b[33m'
	// @todo fix codes for
	static BLUE = '\x1b[34m'
	static PURPLE = '\x1b[35m'
	static RED = '\x1b[31m'
	static GREEN = '\x1b[32m'
	static RESET = '\x1b[0m'
	static LEVELS = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3,
		silent: 4
	}
	// @todo add other properties
	/** @type {Map<string, LoggerFormat>} */
	formats
	/**
	 * @param {object | string} options - Logger configuration or level
	 * @param {object} options
	 * @param {string} [options.level='info'] - Minimum log level to output (debug|info|warn|error|silent)
	 * @param {Console} [options.console=console] - Console instance to use for output
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
			formats = [
				["debug", { icon: "•", color: Logger.DIM }],
				["log", { icon: "¡" }],
				["info", { icon: "ℹ" }],
				["warn", { icon: "∆", color: Logger.YELLOW }],
				["error", { icon: "!", color: Logger.RED }],
				["success", { icon: "✓", color: Logger.GREEN }],
			]
		} = options

		this.console = consoleInstance
		this.level = level
		this.icons = Boolean(icons)
		this.chromo = Boolean(chromo)
		this.formats = new Map(formats)
		this.formats.forEach(
			(opts, target) => this.formats.set(target, LoggerFormat.from(opts))
		)
		this.currentLevel = Logger.LEVELS[this.level] ?? 1
	}

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
				warn: "▲",
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
		if (format.icon) args.unshift(format.icon)
		if (!this.chromo && format.color) {
			args.unshift(format.color)
			args.push(Logger.RESET)
		}
		return args
	}

	setFormat(target, opts) {
		this.formats.set(target, LoggerFormat.from(opts))
	}

	/**
	 * Log debug message
	 * @param {...any} args - Arguments to log
	 */
	debug(...args) {
		if (this.currentLevel <= 0) {
			this.console.debug(...this._argsWith("debug", ...args))
		}
	}

	/**
	 * Log info message
	 * @param {...any} args - Arguments to log
	 */
	info(...args) {
		if (this.currentLevel <= 1) {
			this.console.info(...this._argsWith("info", ...args))
		}
	}

	/**
	 * Log warning message
	 * @param {...any} args - Arguments to log
	 */
	warn(...args) {
		if (this.currentLevel <= 2) {
			this.console.warn(...this._argsWith("warn", ...args))
		}
	}

	/**
	 * Log error message
	 * @param {...any} args - Arguments to log
	 */
	error(...args) {
		if (this.currentLevel <= 3) {
			this.console.error(...this._argsWith("error", ...args))
		}
	}

	success(...args) {
		if (this.currentLevel <= 1) {
			this.console.info(...this._argsWith("success", ...args))
		}
	}

	/**
	 * Log message
	 * @param {...any} args - Arguments to log
	 */
	log(...args) {
		if (this.currentLevel <= 1) {
			this.console.log(...this._argsWith("log", ...args))
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
	 * @param {string[]} argv
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
	 * @param {string | object} name
	 * @param {any | undefined} value
	 * @returns
	 */
	static createFormat(name, value) {
		if ("string" === typeof name) {
			return new LoggerFormat({ [name]: value })
		}
		return new LoggerFormat(name)
	}
}

export default Logger
