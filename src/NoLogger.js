import Logger from "./Logger.js"
import NoConsole from "./NoConsole.js"

class NoLogger extends Logger {
	/** @type {NoConsole} */
	console

	/**
	 * Creates a new NoLogger instance.
	 * @param {Object} [options={}] - The options for the logger
	 */
	constructor(options = {}) {
		super(options)
		this.icons = false
		this.chromo = true
		this.console = new NoConsole()
	}

	/**
	 * Returns the logged output.
	 * @returns {Array<Array<*>>} The array of logged messages
	 */
	output() {
		return this.console.output()
	}
}

export default NoLogger
