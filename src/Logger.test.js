import { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import Logger from './Logger.js'
import LoggerFormat from "./LoggerFormat.js"
import Console from './Console.js'

describe('Logger class functionality', () => {
	it('should create a logger instance with default values', () => {
		const logger = new Logger()
		assert.equal(logger.level, 'info')
		assert.ok(logger.console instanceof Console)
		assert.equal(logger.icons, false)
		assert.equal(logger.chromo, false)
		assert.equal(logger.stream, null)
	})

	it('should create a logger instance with custom values', () => {
		const logger = new Logger({
			level: 'debug',
			icons: true,
			chromo: true
		})
		assert.equal(logger.level, 'debug')
		assert.equal(logger.icons, true)
		assert.equal(logger.chromo, true)
	})

	it('should create a logger instance with stream function', () => {
		const mockStream = async (data) => data
		const logger = new Logger({
			stream: mockStream
		})
		assert.equal(logger.stream, mockStream)
	})

	it('should create a logger instance from string level', () => {
		const logger = new Logger('warn')
		assert.equal(logger.level, 'warn')
	})

	it('should detect log level from argv', () => {
		const level = Logger.detectLevel(['--debug', '--other'])
		assert.equal(level, 'debug')
	})

	it('should calculate progress correctly', () => {
		const progress = Logger.progress(50, 100, 1)
		assert.equal(progress, '50.0')
	})

	it('should handle debug logging', () => {
		const logger = new Logger('debug')
		// This test would require mocking console.debug to verify it's called
		// For now, we just verify it doesn't throw an error
		assert.doesNotThrow(() => logger.debug('test message'))
	})

	it('should handle info logging', () => {
		const logger = new Logger('info')
		assert.doesNotThrow(() => logger.info('test message'))
	})

	it('should handle custom stream logging', async () => {
		let streamedData = ''
		const mockStream = async (data) => {
			streamedData += data
		}

		const logger = new Logger({
			stream: mockStream
		})

		logger.info('test custom stream')

		// Give some time for async operations to complete
		await new Promise(resolve => setTimeout(resolve, 10))

		assert.ok(streamedData.includes('test custom stream'))
	})

	it('should generate correct cursor up sequence', () => {
		const logger = new Logger()
		assert.equal(logger.cursorUp(1), '\x1b[1A')
		assert.equal(logger.cursorUp(5), '\x1b[5A')
	})

	it('should generate correct cursor down sequence', () => {
		const logger = new Logger()
		assert.equal(logger.cursorDown(1), '\x1b[1B')
		assert.equal(logger.cursorDown(5), '\x1b[5B')
	})

	it('should generate correct erase sequence', () => {
		const logger = new Logger()

		const stack = []
		logger.write = (str) => {
			stack.push(str)
		}
		logger.console.info = (...args) => {
			stack.push(args)
		}

		logger.info("Hello")
		logger.clearLine()
		logger.info("all")

		assert.deepEqual(stack, [
			["Hello"],
			"\x1B[2K\r",
			["all"],
		])
	})

	it('should generate correct progress bar', () => {
		assert.equal(Logger.bar(0, 10), '█··········· 10.00%')
		assert.equal(Logger.bar(5, 10), '███████····· 60.00%')
		assert.equal(Logger.bar(9, 10), '████████████ 100.00%')
	})

	it('should handle window size correctly', () => {
		const logger = new Logger()
		const size = logger.getWindowSize()
		assert.ok(Array.isArray(size))
		assert.equal(size.length, 2)
		assert.equal(typeof size[0], 'number')
		assert.equal(typeof size[1], 'number')
	})

	it('should store lines for erasing', () => {
		const logger = new Logger()
		logger._storeLine("test line 1")
		logger._storeLine("test line 2")
		assert.equal(logger._previousLines.length, 2)
		assert.equal(logger._previousLines[0], "test line 1")
		assert.equal(logger._previousLines[1], "test line 2")
	})

	it('should create format from string and value', () => {
		const format = Logger.createFormat("icon", "✓")
		assert.ok(format instanceof LoggerFormat)
		assert.equal(format.icon, "✓")
	})

	it('should create format from object', () => {
		const format = Logger.createFormat({ icon: "!", color: Logger.RED })
		assert.ok(format instanceof LoggerFormat)
		assert.equal(format.icon, "!")
		assert.equal(format.color, Logger.RED)
	})

	it('should generate table with borders correctly', () => {
		const logger = new Logger()
		const data = [
			{ name: 'John', age: 30 },
			{ name: 'Jane', age: 25 }
		]
		const columns = ['name', 'age']

		// Mock console.info to capture output
		const loggedLines = []
		logger.console.info = (...args) => loggedLines.push(args[0])

		const result = logger.table(data, columns, { border: 1, headBorder: 1 })

		// Check that borders are added
		assert.ok(result[0].startsWith('----')) // Top border
		assert.ok(result[2].startsWith('----')) // Head border
		assert.ok(result[result.length - 1].startsWith('----')) // Bottom border
	})
})
