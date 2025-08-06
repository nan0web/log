import Logger from "./Logger.js"

class NoConsole {
	#logs = []
	clear() {
		this.#logs = []
	}
	debug(...args) {
		this.#logs.push(["debug", ...args])
	}
	info(...args) {
		this.#logs.push(["info", ...args])
	}
	warn(...args) {
		this.#logs.push(["warn", ...args])
	}
	error(...args) {
		this.#logs.push(["error", ...args])
	}
	log(...args) {
		this.#logs.push(["log", ...args])
	}
	output() {
		return this.#logs
	}
}

class NoLogger extends Logger {
	/** @type {NoConsole} */
	console
	constructor(options = {}) {
		super(options)
		this.icons = false
		this.chromo = true
		this.console = new NoConsole()
	}
	output() {
		return this.console.output()
	}
}

export default NoLogger
