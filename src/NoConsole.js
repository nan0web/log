import Console from "./Console.js"

/**
 * A console wrapper that stores logs in memory instead of outputting them.
 * Useful for testing or capturing logs for later processing.
 */
class NoConsole extends Console {
	/** @type {Array<Array<string, *[]>>} */
	#logs = []

	constructor(options = {}) {
		super(options)
		const {
			silent = false
		} = options
		this.silent = Boolean(silent)
	}

	/**
	 * Clears all stored logs.
	 * @returns {void}
	 */
	clear() {
		this.#logs = []
	}

	/**
	 * Stores a debug log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	debug(...args) {
		if (this.silent) return
		this.#logs.push(["debug", ...args])
	}

	/**
	 * Stores an info log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	info(...args) {
		if (this.silent) return
		this.#logs.push(["info", ...args])
	}

	/**
	 * Stores a warning log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	warn(...args) {
		if (this.silent) return
		this.#logs.push(["warn", ...args])
	}

	/**
	 * Stores an error log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	error(...args) {
		if (this.silent) return
		this.#logs.push(["error", ...args])
	}

	/**
	 * Stores a generic log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	log(...args) {
		if (this.silent) return
		this.#logs.push(["log", ...args])
	}

	/**
	 * Returns all stored logs.
	 * @returns {Array<Array<*>>} An array of log entries, each containing the log level and arguments
	 */
	output() {
		return this.#logs
	}
	/**
	 * @param {object} input
	 * @returns {NoConsole}
	 */
	static from(input) {
		if (input instanceof NoConsole) return input
		return new NoConsole(input)
	}
}

export default NoConsole
