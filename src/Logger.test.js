import { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import Logger from './Logger.js'
import LoggerFormat from "./LoggerFormat.js"
import Console from './Console.js'
import NoConsole from './NoConsole.js'

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

	it('should handle when argv has no matching level', () => {
		const level = Logger.detectLevel(['--unknown', '--other'])
		assert.equal(level, undefined)
	})

	it('should calculate progress correctly', () => {
		const progress = Logger.progress(50, 100, 1)
		assert.equal(progress, '50.0')
	})

	it('should calculate progress with zero length', () => {
		const progress = Logger.progress(0, 0, 1)
		assert.equal(progress, '0')
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

	it("should add a timestamp and spent in messages", () => {
		const logger = new Logger({ time: true, spent: true, console: new NoConsole() })
		logger.info("Time?")
		const log = logger.console.console.output()[0][1]
		assert.match(log, /^\d{4}-\d{2}-\d{2}T/)
		assert.match(log, / \d\.\d+ Time\?$/)
	})

	it("should setFormat", () => {
		const logger = new Logger({ icons: true, console: new NoConsole() })
		logger.setFormat("info", { icon: "+" })
		logger.info("Time?")
		const log = logger.console.console.output()[0][1]
		assert.equal(log, "+ Time?")
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

	it('should not generate progress bar with zero length', () => {
		const bar = Logger.bar(0, 0)
		assert.ok(bar.includes(' 0.00%'))
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

	it('should limit stored lines to 10', () => {
		const logger = new Logger()
		for (let i = 0; i < 15; i++) {
			logger._storeLine(`line ${i}`)
		}
		assert.equal(logger._previousLines.length, 10)
		assert.equal(logger._previousLines[0], "line 5")
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

	it('should generate table without columns and data normalization', () => {
		const logger = new Logger()
		const data = [
			['John', 30],
			['Jane', 25]
		]

		// Mock console.info to capture output
		const loggedLines = []
		logger.console.info = (...args) => loggedLines.push(args[0])

		const result = logger.table(data, [], { silent: true })
		assert.equal(result.length, 2)
		assert.ok(result[0].includes('John'))
		assert.ok(result[1].includes('Jane'))
	})

	it('should handle empty data in table', () => {
		const logger = new Logger()
		const result = logger.table([])
		assert.deepEqual(result, [])
	})

	it('should handle non-array data in table', () => {
		const logger = new Logger()
		const result = logger.table("invalid")
		assert.deepEqual(result, [])
	})

	it('should handle table with widths specified', () => {
		const logger = new Logger()
		const data = [
			['John', 30],
			['Jane', 25]
		]
		const columns = ['name', 'age']

		// Mock console.info to capture output
		const loggedLines = []
		logger.console.info = (...args) => loggedLines.push(args[0])

		const result = logger.table(data, columns, { widths: [10, 5], silent: true })
		assert.ok(result[0].length >= 15) // name width + age width + spaces
	})

	it("should handle table with UTF-8 values", () => {
		const langs = [
			["🇩🇪", "Deutsch", "de"],
			["🇯🇵", "日本語", "ja"],
			["🇨🇳", "中文", "zh"],
		]
		const logger = new Logger()
		const result = logger.table(langs, [], { silent: true })
		assert.deepEqual(result, [
			"🇩🇪 Deutsch de ",
			"🇯🇵 日本語  ja ",
			"🇨🇳 中文    zh ",
		])
	})

	it("should handle proper widths of the columns", () => {
		const rows = [
			[ "gpt-oss-120b", 0, 0, "65,536", "65,536", "2024-06-01"],
			[ "qwen-3-32b", 0, 0, "65,536", "8,192", "2024-06-01"],
			[ "qwen-3-235b-a22b-instruct-2507", 0, 0, "65,536", "8,192", "2024-06-01"],
			[ "qwen-3-235b-a22b-thinking-2507", 0, 0, "65,536", "8,192", "2024-06-01"],
			[ "qwen-3-coder-480b", 0, 0, "65,536", "8,192", "2024-06-01"]
		]
		const cols = ["Model name", "→ in 1MT", "← out 1MT", "Context T", "Output T", "Date"]
		const logger = new Logger()
		const footer = ["footer", "0", "0", "", "", 2024]
		const result = logger.table(
			[...rows, footer],
			cols,
			{ padding: 3, aligns: ['left', 'right', 'right', 'right', 'right', 'right'] }
		)
		assert.deepEqual(result, [
			"Model name                       → in 1MT   ← out 1MT   Context T   Output T         Date",
			"gpt-oss-120b                            0           0      65,536     65,536   2024-06-01",
			"qwen-3-32b                              0           0      65,536      8,192   2024-06-01",
			"qwen-3-235b-a22b-instruct-2507          0           0      65,536      8,192   2024-06-01",
			"qwen-3-235b-a22b-thinking-2507          0           0      65,536      8,192   2024-06-01",
			"qwen-3-coder-480b                       0           0      65,536      8,192   2024-06-01",
			"footer                                  0           0                                2024",
		])
	})

	it.todo("should handle table with wide columns and padding", () => {
		const table = [
			[1, 2, 3],
			["-", "+++", "-"]
		]
		const logger = new Logger()
		const result = logger.table(table, ["First", "2nd", "3rd"], { padding: 3 })
		assert.deepEqual(result, [
			"First   2nd     3rd",
			"1       2       3",
			"-       +++     -",
		])
	})

	// Additional tests to cover uncovered lines in Logger.js
	it('should handle success logging', () => {
		const logger = new Logger('debug')
		assert.doesNotThrow(() => logger.success('test success'))
	})

	it('should handle log method', () => {
		const logger = new Logger('debug')
		assert.doesNotThrow(() => logger.log('test log'))
	})

	it('should create format with existing LoggerFormat', () => {
		const logger = new Logger()
		const format = new LoggerFormat({ icon: '✓' })
		const result = logger._argsWith('info', format, 'test message')
		assert.ok(result.includes('test message'))
	})

	it('should handle table with footBorder', () => {
		const logger = new Logger()
		const data = [['test']]
		const result = logger.table(data, ['col'], { footBorder: 1, silent: true })
		assert.ok(result.length > 1)
	})

	it('should use default format when no format defined', () => {
		const logger = new Logger()
		// Clear existing formats to test default behavior
		logger.formats.clear()
		const result = logger._argsWith('info', 'test message')
		assert.ok(result.includes('test message'))
	})

	it("should cut the text", () => {
		const logger = new Logger()

		assert.equal(logger.cut("Hello, world!"), "Hello, world!")
		assert.equal(logger.cut("Hello".repeat(20), 13), "HelloHelloHel")
	})
})
