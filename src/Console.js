/**
 * A cross-platform Console class that wraps console methods for both Node.js and browsers.
 * Provides a consistent interface for logging across environments and supports streaming to files.
 */
class Console {
	/**
	 * Creates a new Console instance.
	 * @param {Object} [options={}] - Console configuration options
	 * @param {Console} [options.console=console] - The underlying console instance to wrap
	 */
	constructor(options = {}) {
		const { console: consoleInstance = console } = options

		// Use the provided console or fallback to global console
		this.console = consoleInstance

		// In browser environment, ensure common methods exist
		if (typeof window !== 'undefined') {
			this.console.debug = this.console.debug || this.console.log
			this.console.info = this.console.info || this.console.log
			this.console.warn = this.console.warn || this.console.log
			this.console.error = this.console.error || this.console.log
		}
	}

	/**
	 * Logs a debug message
	 * @param {...any} args - Arguments to log
	 */
	debug(...args) {
		this.console.debug(...args)
	}

	/**
	 * Logs an info message
	 * @param {...any} args - Arguments to log
	 */
	info(...args) {
		this.console.info(...args)
	}

	/**
	 * Logs a warning message
	 * @param {...any} args - Arguments to log
	 */
	warn(...args) {
		this.console.warn(...args)
	}

	/**
	 * Logs an error message
	 * @param {...any} args - Arguments to log
	 */
	error(...args) {
		this.console.error(...args)
	}

	/**
	 * Logs a generic message
	 * @param {...any} args - Arguments to log
	 */
	log(...args) {
		this.console.log(...args)
	}

	/**
	 * Clears the console
	 */
	clear() {
		if (this.console.clear) {
			this.console.clear()
		}
	}

	/**
	 * Asserts a condition
	 * @param {boolean} condition - Condition to assert
	 * @param {...any} args - Arguments to log if assertion fails
	 */
	assert(condition, ...args) {
		if (this.console.assert) {
			this.console.assert(condition, ...args)
		}
	}

	/**
	 * Logs the count of calls to this method with a specific label
	 * @param {string} [label='default'] - Label for the counter
	 */
	count(label = 'default') {
		if (this.console.count) {
			this.console.count(label)
		}
	}

	/**
	 * Resets the counter for a specific label
	 * @param {string} [label='default'] - Label for the counter to reset
	 */
	countReset(label = 'default') {
		if (this.console.countReset) {
			this.console.countReset(label)
		}
	}

	/**
	 * Displays an interactive listing of object properties
	 * @param {object} obj - Object to display
	 */
	dir(obj) {
		if (this.console.dir) {
			this.console.dir(obj)
		}
	}

	/**
	 * Displays an interactive tree of descendant elements
	 * @param {object} obj - Object to display
	 */
	dirxml(obj) {
		if (this.console.dirxml) {
			this.console.dirxml(obj)
		}
	}

	/**
	 * Creates an inline group in the console
	 * @param {...any} args - Arguments for group creation
	 */
	group(...args) {
		if (this.console.group) {
			this.console.group(...args)
		}
	}

	/**
	 * Creates a collapsed inline group in the console
	 * @param {...any} args - Arguments for group creation
	 */
	groupCollapsed(...args) {
		if (this.console.groupCollapsed) {
			this.console.groupCollapsed(...args)
		}
	}

	/**
	 * Exits the current inline group
	 */
	groupEnd() {
		if (this.console.groupEnd) {
			this.console.groupEnd()
		}
	}

	/**
	 * Starts a profile with the specified label
	 * @param {string} label - Label for the profile
	 */
	profile(label) {
		if (this.console.profile) {
			this.console.profile(label)
		}
	}

	/**
	 * Ends a profile with the specified label
	 * @param {string} label - Label for the profile
	 */
	profileEnd(label) {
		if (this.console.profileEnd) {
			this.console.profileEnd(label)
		}
	}

	/**
	 * Starts a timer with the specified label
	 * @param {string} [label='default'] - Label for the timer
	 */
	time(label = 'default') {
		if (this.console.time) {
			this.console.time(label)
		}
	}

	/**
	 * Logs a timestamp with the specified label
	 * @param {string} label - Label for the timestamp
	 */
	timeStamp(label) {
		if (this.console.timeStamp) {
			this.console.timeStamp(label)
		}
	}

	/**
	 * Stops a timer and logs the elapsed time
	 * @param {string} [label='default'] - Label for the timer
	 */
	timeEnd(label = 'default') {
		if (this.console.timeEnd) {
			this.console.timeEnd(label)
		}
	}

	/**
	 * Logs the current value of a timer
	 * @param {string} [label='default'] - Label for the timer
	 */
	timeLog(label = 'default') {
		if (this.console.timeLog) {
			this.console.timeLog(label)
		}
	}

	/**
	 * Displays tabular data
	 * @param {any} data - Data to display
	 * @param {string[]} [columns] - Columns to display
	 */
	table(data, columns) {
		if (this.console.table) {
			this.console.table(data, columns)
		}
	}

	/**
	 * Logs a stack trace
	 */
	trace() {
		if (this.console.trace) {
			this.console.trace()
		}
	}
}

export default Console
