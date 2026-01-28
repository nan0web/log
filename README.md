# @nan0web/log

<!-- %PACKAGE_STATUS% -->

A cross-platform Logger class that wraps console methods for both Node.js and browsers
with consistent interface and streaming support.

## Description

The `@nan0web/log` package provides a minimal yet powerful foundation for logging systems.
Core classes:

- `Logger` — main logger class with levels, icons, colors, time and streaming support
- `LogConsole` — wraps console methods for consistent cross-platform logging
- `LoggerFormat` — defines format for a logger level with icon, color and background
- `NoLogger` — captures logs in memory, perfect for testing
- `NoConsole` — captures console output in memory, perfect for testing

These classes are perfect for building CLI tools, debugging layers, structured logs,
and streaming data to files or external services.

## Installation

How to install with npm?
```bash
npm install @nan0web/log
```

How to install with pnpm?
```bash
pnpm add @nan0web/log
```

How to install with yarn?
```bash
yarn add @nan0web/log
```

## Usage

### Basic Logger

Logger can be instantiated with a level or options and logs everything below that level

How to create a Logger instance with level?
```js
import Logger from '@nan0web/log'
const logger = new Logger('debug')
logger.info(typeof logger.debug) // ← function
logger.info(logger.level) // ← debug
```

How to create a Logger instance with options?
```js
import Logger from '@nan0web/log'
const logger = new Logger({
	level: 'info',
	icons: true,
	chromo: true,
	time: true,
})
logger.info("Hello with options") // ← TIME-HH-IIT... ℹ Hello with options
```
### Custom Formats

Logger supports custom formats for different levels

How to use custom formats for different levels?
```js
import Logger from '@nan0web/log'
const logger = new Logger({
	level: "debug",
	icons: true,
	formats: [
		["debug", { icon: "🔍", color: Logger.CYAN }],
		["info", { icon: "ℹ️ ", color: Logger.GREEN }],
		["warn", { icon: "⚠️ ", color: Logger.YELLOW }],
		["error", { icon: "❌", color: Logger.RED }],
		["success", { icon: "✅", color: Logger.GREEN }],
	]
})
logger.debug("Debug message")     // ← \x1b[36m🔍 Debug message
logger.info("Info message")       // ← \x1b[32mℹ️  Info message
logger.warn("Warning message")    // ← \x1b[33m⚠️  Warning message
logger.error("Error message")     // ← \x1b[31m❌ Error message
logger.success("Success message") // ← \x1b[32m✅ Success message
```
### Streaming Logs

Logger supports streaming logs to files or external services

How to stream logs to a file?
```js
import Logger from '@nan0web/log'
let streamOutput = ""
const logger = new Logger({
	stream: async (message) => {
		streamOutput += message
	}
})
logger.broadcast("Streamed message")
// Wait a bit for async operations
await new Promise(resolve => setTimeout(resolve, 10))
console.log(streamOutput) // ← Streamed message
```
### Memory Logging with NoLogger

NoLogger captures logs in memory instead of printing them, perfect for testing

How to capture logs in memory with NoLogger?
```js
import { NoLogger } from '@nan0web/log'
const logger = new NoLogger({ level: "debug" })
logger.debug("Debug message")
logger.info("Info message")
logger.warn("Warning message")
logger.error("Error message")
logger.success("Success message")
const logs = logger.output()
console.log(logs) // ← [ [ "debug", "Debug message" ], [ "info", "Info message" ], ... ]
```
### Advanced Features

Logger includes useful helpers for formatting, tables, progress, etc.

How to create and display formatted tables?
```js
import Logger from '@nan0web/log'
const logger = new Logger()
const data = [
	{ name: "John", age: 30, city: "New York" },
	{ name: "Jane", age: 25, city: "Los Angeles" },
	{ name: "Bob", age: 35, city: "Chicago" }
]
// Capture table output by mocking console methods
logger.table(data, ["name", "age", "city"], { padding: 2, border: 1 })
// ------------------------
// name  age  city
// John  30   New York
// Jane  25   Los Angeles
// Bob   35   Chicago
// ------------------------
```

How to style text with colors and background?
```js
import Logger from '@nan0web/log'
const styled = Logger.style("Styled text", {
	color: Logger.MAGENTA,
	bgColor: Logger.BG_WHITE
})
console.info(styled) // ← \x1b[35m\x1b[47mStyled text\x1b[0m
```
### Work with cursor and clear lines for progress

Demonstrates moving the cursor, moving it down, and clearing a line.

The logger methods return the ANSI escape sequences, which you can log
directly. Each call creates a separate log entry.

How to work with cursor and clear lines for progress?
```js
const logger = new Logger()
// Log a multiline message
logger.info("Need to add first lines\nto let cursor move up")
// Log the cursor‑up escape sequence – this is a separate log entry
logger.cursorUp(2, true)
// Log the clear‑line escape sequence – a separate entry as well
logger.info(logger.clearLine())
```
### Prefix Option

Logger can prepend a custom prefix to every log line.

How to use Logger.prefix option?
```js
const logger = new Logger({ prefix: "PREFIX> " })
logger.info("Message with prefix") // ← PREFIX> Message with prefix
```
## API

### Logger

* **Properties**
  * `level` – minimum log level to output (debug|info|warn|error|silent)
  * `console` – Console instance used for output
  * `icons` – whether to show icons
  * `chromo` – whether to apply colors
  * `time` – format for timestamps (default: false)
  * `spent` – whether to log execution time differences (default: false)
  * `stream` – function for output streaming (default: null)
  * `formats` – map of formats for different log levels

* **Methods**
  * `debug(...args)` – log debug message
  * `info(...args)` – log info message
  * `warn(...args)` – log warning message
  * `error(...args)` – log error message
  * `success(...args)` – log success message (uses info channel)
  * `log(...args)` – log generic message
  * `setFormat(target, opts)` – set format for a log level
  * `setStream(streamFunction)` – define stream function for output
  * `table(data, columns, options)` – format and log table data
  * `write(str)` – write string directly to stdout
  * `cursorUp(lines)` – move cursor up in terminal
  * `cursorDown(lines)` – move cursor down in terminal
  * `clear()` – clear the console
  * `clearLine()` – clear the current line
  * `getWindowSize()` – get terminal size [columns, rows]
  * `cut(str, width)` – cut string to terminal width
  * `static from(input)` – create Logger instance from string or options
  * `static detectLevel(argv)` – detect log level from command line args
  * `static createFormat(name, value)` – create LoggerFormat from input
  * `static style(value, styleOptions)` – style a value with colors
  * `static stripANSI(str)` – remove ANSI codes from string
  * `static progress(i, len, fixed)` – calculate progress percentage
  * `static spent(checkpoint, fixed)` – calculate time since checkpoint
  * `static bar(i, len, width, char, space)` – create progress bar string

### LogConsole

* **Properties**
  * `console` – the underlying console instance
  * `prefix` – prefix data for every log

* **Methods**
  * `debug(...args)` – log debug message
  * `info(...args)` – log info message
  * `warn(...args)` – log warning message
  * `error(...args)` – log error message
  * `log(...args)` – log generic message
  * `clear()` – clear the console
  * `assert(condition, ...args)` – assert a condition
  * `count(label)` – log count of calls with label
  * `countReset(label)` – reset counter for label
  * `dir(obj)` – display object properties
  * `dirxml(obj)` – display object tree
  * `group(...args)` – create inline group
  * `groupCollapsed(...args)` – create collapsed group
  * `groupEnd()` – exit current group
  * `profile(label)` – start profile
  * `profileEnd(label)` – end profile
  * `time(label)` – start timer
  * `timeStamp(label)` – log timestamp
  * `timeEnd(label)` – stop timer and log elapsed time
  * `timeLog(label)` – log current timer value
  * `table(data, columns)` – display tabular data
  * `trace()` – log stack trace

### LoggerFormat

* **Properties**
  * `icon` – icon string
  * `color` – ANSI color code
  * `bgColor` – ANSI background color code

* **Methods**
  * `static from(input)` – create format from object or existing instance

### NoLogger

Extends `Logger`.

* **Properties**
  * `console` – NoConsole instance that captures output

* **Methods**
  * `output()` – return captured logs

### NoConsole

* **Properties**
  * `silent` – whether to suppress all output

* **Methods**
  * `debug(...args)` – capture debug log
  * `info(...args)` – capture info log
  * `warn(...args)` – capture warning log
  * `error(...args)` – capture error log
  * `log(...args)` – capture generic log
  * `clear()` – clear captured logs
  * `output(type)` – return captured logs (all or filtered by type)
  * `static from(input)` – create or return NoConsole instance

## Java•Script

Uses `d.ts` files for autocompletion

## CLI Playground

How to run playground script?
```bash
# Clone the repository and run the CLI playground
git clone https://github.com/nan0web/log.git
cd log
npm install
npm run play
```

## Contributing

How to contribute? - [check here](./CONTRIBUTING.md)

## License

How to license ISC? - [check here](./LICENSE)
