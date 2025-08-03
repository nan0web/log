/**
 * Logger class for handling different log levels
 * Supports debug, info, warn, error, and log methods
 */
class Logger {
	/**
	 * @param {object} options - Logger configuration
	 * @param {string} [options.level='info'] - Minimum log level to output (debug|info|warn|error|silent)
	 * @param {Console} [options.console=console] - Console instance to use for output
	 */
	constructor(options = {}) {
		const {
			level = 'info',
			console: consoleInstance = console
		} = options

		this.console = consoleInstance
		this.level = level

		// Log level priorities
		this.levels = {
			debug: 0,
			info: 1,
			warn: 2,
			error: 3,
			silent: 4
		}

		this.currentLevel = this.levels[this.level] ?? 1
	}

	/**
	 * Log debug message
	 * @param {...any} args - Arguments to log
	 */
	debug(...args) {
		if (this.currentLevel <= 0) {
			this.console.debug(...args)
		}
	}

	/**
	 * Log info message
	 * @param {...any} args - Arguments to log
	 */
	info(...args) {
		if (this.currentLevel <= 1) {
			this.console.info(...args)
		}
	}

	/**
	 * Log warning message
	 * @param {...any} args - Arguments to log
	 */
	warn(...args) {
		if (this.currentLevel <= 2) {
			this.console.warn(...args)
		}
	}

	/**
	 * Log error message
	 * @param {...any} args - Arguments to log
	 */
	error(...args) {
		if (this.currentLevel <= 3) {
			this.console.error(...args)
		}
	}

	/**
	 * Log message
	 * @param {...any} args - Arguments to log
	 */
	log(...args) {
		if (this.currentLevel <= 1) {
			this.console.log(...args)
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
}

export default Logger