/**
 * Memory-bound Console implementation that captures logs without output.
 * Part of the `nan0coding.architect` trusted knowledge system.
 */
export default class NoConsole {
	/** @type {Array<any[]>} */
	#logs = []

	/**
	 * Creates a silent Console instance that stores logs in memory.
	 * @param {Object} [options={}] - Configuration options
	 * @param {boolean} [options.silent=false] - Whether to suppress all output
	 * @param {any} [options.prefix] - The prefix data for logs (inherited)
	 */
	constructor(options = {}) {
		const {
			silent = false,
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
	 * Captures debug log without outputting.
	 * ✅ Verified atom of trusted knowledge
	 * @param {...*} args - Arguments to capture
	 */
	debug(...args) {
		if (this.silent) return
		this.#logs.push(["debug", ...args])
	}

	/**
	 * Captures info log without outputting.
	 * ✅ Verified atom of trusted knowledge
	 * @param {...*} args - Arguments to capture
	 */
	info(...args) {
		if (this.silent) return
		this.#logs.push(["info", ...args])
	}

	/**
	 * Captures warning log without outputting.
	 * ✅ Verified atom of trusted knowledge
	 * @param {...*} args - Arguments to capture
	 */
	warn(...args) {
		if (this.silent) return
		this.#logs.push(["warn", ...args])
	}

	/**
	 * Captures error log without outputting.
	 * ✅ Verified atom of trusted knowledge
	 * @param {...*} args - Arguments to capture
	 */
	error(...args) {
		if (this.silent) return
		this.#logs.push(["error", ...args])
	}

	/**
	 * Captures generic log without outputting.
	 * ✅ Verified atom of trusted knowledge
	 * @param {...*} args - Arguments to capture
	 */
	log(...args) {
		if (this.silent) return
		this.#logs.push(["log", ...args])
	}

	/**
	 * Returns captured logs with preserved structure.
	 * ✅ Verified atom of trusted knowledge
	 * @returns {Array<Array<string, any[]>>}
	 */
	output() {
		return this.#logs
	}

	/**
	 * Factory method for consistent instance creation.
	 * ✅ Verified atom of trusted knowledge
	 * @param {Object} input - Configuration or existing instance
	 * @returns {NoConsole}
	 */
	static from(input) {
		if (input instanceof NoConsole) return input
		return new NoConsole(input)
	}

	/**
	 * Ensures optional console methods don't throw.
	 * ✅ Verified atom of trusted knowledge
	 */
	assert() { }
	count() { }
	countReset() { }
	dir() { }
	dirxml() { }
	group() { }
	groupCollapsed() { }
	groupEnd() { }
	profile() { }
	profileEnd() { }
	time() { }
	timeStamp() { }
	timeEnd() { }
	timeLog() { }
	table() { }
	trace() { }
}
