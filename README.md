# @nan0web/log

A simple, flexible, and universe-friendly logging utility designed for nan0web applications. It supports multiple log levels, customizable formats, icons, and colors, making it easy to integrate and adapt to any environment.

## Features

- Supports common log levels: `debug`, `info`, `warn`, `error`, `success`, and `log`.
- Configurable minimum log level to control output verbosity.
- Optional colored output and icons for better visual distinction.
- Extendable formatting for each log level.
- No dependencies — pure JavaScript implementation.
- Fully testable with mock console support (`NoLogger`).

## Installation

Using [pnpm](https://pnpm.io/):

```bash
pnpm add @nan0web/log
```

## Usage

### Basic Logger

```js
import Logger from '@nan0web/log'

const logger = new Logger({ level: 'debug' })

logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message')
logger.success('Success message')
```

### Custom Formatting

You can define custom icons and colors per log level:

```js
const logger = new Logger({
	level: 'info',
	formats: [
		['info', { icon: 'ℹ', color: Logger.BLUE }],
		['warn', { icon: '⚠', color: Logger.YELLOW }],
	]
})
```

### Silent Logging with NoLogger

Use `NoLogger` to capture logs without printing them to the console:

```js
import { NoLogger } from '@nan0web/log'

const logger = new NoLogger({ level: 'debug' })
logger.debug('Silent debug')
logger.error('Silent error')

// Get captured logs
console.log(logger.output())
// Output: [['debug', 'Silent debug'], ['error', 'Silent error']]
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
| `formats` | Array<[string, object]> | Default formats | Log level-specific format overrides   |

### Methods

| Method    | Description            |
|-----------|------------------------|
| `debug(...args)`  | Log debug message     |
| `info(...args)`   | Log info message      |
| `warn(...args)`   | Log warning message   |
| `error(...args)`  | Log error message     |
| `success(...args)`| Log success message   |
| `log(...args)`    | Log general message   |

### Static Utilities

| Method                 | Description                                      |
|------------------------|--------------------------------------------------|
| `Logger.from(input)`   | Create or return a Logger instance from input   |
| `Logger.detectLevel(argv)` | Detect log level from command-line arguments |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

ISC — see [LICENSE](./LICENSE)
