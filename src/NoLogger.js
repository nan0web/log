import Logger from "./Logger.js"
import NoConsole from "./NoConsole.js"

class NoLogger extends Logger {
	/** @type {NoConsole} */
	console

	/**
	 * Creates a new NoLogger instance.
	 * @param {import("./Logger.js").LoggerOptions} [options={}] - The options for the logger
	 */
	constructor(options = {}) {
		super(options)
		const {
			console = new NoConsole(),
		} = options
		this.console = NoConsole.from(console)
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
