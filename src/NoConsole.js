import Console from "./Console.js"

/**
 * A console wrapper that stores logs in memory instead of outputting them.
 * Useful for testing or capturing logs for later processing.
 */
class NoConsole extends Console {
	/** @type {Array<Array<string, *[]>>} */
	#logs = []

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
		this.#logs.push(["debug", ...args])
	}

	/**
	 * Stores an info log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	info(...args) {
		this.#logs.push(["info", ...args])
	}

	/**
	 * Stores a warning log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	warn(...args) {
		this.#logs.push(["warn", ...args])
	}

	/**
	 * Stores an error log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	error(...args) {
		this.#logs.push(["error", ...args])
	}

	/**
	 * Stores a generic log message.
	 * @param {...*} args - The arguments to log
	 * @returns {void}
	 */
	log(...args) {
		this.#logs.push(["log", ...args])
	}

	/**
	 * Returns all stored logs.
	 * @returns {Array<Array<*>>} An array of log entries, each containing the log level and arguments
	 */
	output() {
		return this.#logs
	}
}

export default NoConsole
