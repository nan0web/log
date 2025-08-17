# @nan0web/log

A cross-platform Logger class that wraps console methods for both Node.js and browsers.
Provides a consistent interface for logging across environments and supports streaming to files.

## Features

- Cross-platform compatibility (Node.js and browsers)
- Multiple log levels: `debug`, `info`, `warn`, `error`, `success`, `log`
- Customizable formatting with icons and colors
- Configurable minimum log level to control output verbosity
- Optional timestamp and elapsed time logging
- Table formatting with customizable column widths and alignments
- Progress bar utilities
- Terminal cursor control methods
- Stream support for output redirection
- No dependencies — pure JavaScript implementation
- Fully testable with mock console support (`NoLogger`)

## Installation

Using [pnpm](https://pnpm.io/):

```bash
pnpm add @nan0web/logger
```

## Usage

### Basic Logger

```js
import Logger from '@nan0web/logger'

const logger = new Logger({ level: 'debug' })

logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')
logger.success('Success message')
logger.log('Log message')
```

### Custom Formatting

You can define custom icons and colors per log level:

```js
const logger = new Logger({
	level: 'info',
	icons: true,
	chromo: true,
	formats: [
		['info', { icon: 'ℹ', color: Logger.BLUE }],
		['warn', { icon: '⚠', color: Logger.YELLOW }],
	]
})
```

### Silent Logging with NoLogger

Use `NoLogger` to capture logs without printing them to the console:

```js
import { NoLogger } from '@nan0web/logger'

const logger = new NoLogger({ level: 'debug' })
logger.debug('Silent debug')
logger.error('Silent error')

// Get captured logs
console.log(logger.output())
// Output: [['debug', 'Silent debug'], ['error', 'Silent error']]
```

### Streaming Output

You can set a stream function to redirect log output:

```js
const logger = new Logger({
	stream: async (str) => {
		// Write to file, send over network, etc.
		await fs.appendFile('log.txt', str + '\n')
	}
})

logger.info('This will be written to log.txt')
```

### Table Formatting

Create formatted tables with borders and alignment:

```js
const logger = new Logger()
const data = [
	{ name: 'John', age: 30 },
	{ name: 'Jane', age: 25 }
]
const columns = ['name', 'age']

logger.table(data, columns, { 
	border: 1, 
	headBorder: 1, 
	aligns: ['left', 'right'] 
})
```

### Progress Utilities

Get progress percentage and time elapsed:

```js
const checkpoint = Date.now()
const progress = Logger.progress(50, 100) // "50.0"
const spent = Logger.spent(checkpoint) // Time elapsed since checkpoint
const timeFormat = Logger.toTime(3661000) // "01 01:01:01.000"
```

### Terminal Control

Control cursor position and clear lines for progress updates:

```js
const logger = new Logger()

// Show a progress bar updating on the same line
for (let i = 0; i < 100; i++) {
	logger.clearLine(logger.cursorUp())
	logger.info(Logger.bar(i, 100))
	await sleep(100)
}
```

## API

### `new Logger(options)`

Create a new logger instance with optional configuration.

#### Options

| Option    | Type             | Default  | Description                                         |
|-----------|------------------|----------|-----------------------------------------------------|
| `level`   | string           | `'info'` | Minimum log level (`debug`, `info`, `warn`, `error`, `silent`) |
| `console` | Console instance  | `global.console` | Custom console implementation             |
| `icons`   | boolean          | `false`  | Enable or disable icons in logs                     |
| `chromo`  | boolean          | `false`  | Enable or disable colored output                    |
| `time`    | boolean/string   | `false`  | Enable timestamps with optional format              |
| `spent`   | boolean/number   | `false`  | Enable elapsed time logging                         |
| `stream`  | Function         | `null`   | Stream function for output redirection              |
| `formats` | Array<[string, object]> | Default formats | Log level-specific format overrides   |

### Logger Methods

| Method    | Description            |
|-----------|------------------------|
| `debug(...args)`  | Log debug message     |
| `info(...args)`   | Log info message      |
| `warn(...args)`   | Log warning message   |
| `error(...args)`  | Log error message     |
| `success(...args)`| Log success message (same level as info, but different format) |
| `log(...args)`    | Log general message   |
| `table(data, columns, options)` | Display formatted table data |
| `cursorUp(lines)` | Move cursor up in terminal |
| `cursorDown(lines)` | Move cursor down in terminal |
| `clearLine()` | Clear current line in terminal |
| `write(str)` | Write string directly to stdout |
| `clear()` | Clear the console/terminal |
| `getWindowSize()` | Get terminal window size |
| `erase(char)` | Erase previous line with character |

### Static Utilities

| Method                 | Description                                      |
|------------------------|--------------------------------------------------|
| `Logger.from(input)`   | Create or return a Logger instance from input   |
| `Logger.detectLevel(argv)` | Detect log level from command-line arguments |
| `Logger.createFormat(name, value)` | Create LoggerFormat instance from input |
| `Logger.style(value, options)` | Apply color styling to value |
| `Logger.progress(i, len, fixed)` | Calculate progress percentage |
| `Logger.spent(checkpoint, fixed)` | Calculate time elapsed since checkpoint |
| `Logger.toTime(duration, format)` | Format time duration string |
| `Logger.bar(i, len, width, char, space)` | Create progress bar string |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

ISC — see [LICENSE](./LICENSE)
