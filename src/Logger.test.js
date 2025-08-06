import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Logger from './Logger.js'
import NoLogger from './NoLogger.js'

function createTestLogger(input) {
	if ("string" === typeof input) {
		input = { level: input }
	}
		const console = new NoLogger(input)
		const logger = new Logger({ ...input, console: console.console })
		return { logger, console }
}

suite('Logger', () => {
	/** @type {Logger} */
	let logger
	/** @type {NoLogger} */
	let mockConsole

	describe('log levels', () => {
		it('should log debug messages when level is debug', () => {
			const { logger, console } = createTestLogger("debug")
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')

			const output = console.output()
			assert.equal(output.length, 4)
			assert.deepStrictEqual(output[0], ['debug', Logger.DIM, 'test debug', Logger.RESET])
			assert.deepStrictEqual(output[1], ['info', 'test info'])
			assert.deepStrictEqual(output[2], ['warn', Logger.YELLOW, 'test warn', Logger.RESET])
			assert.deepStrictEqual(output[3], ['error', Logger.RED, 'test error', Logger.RESET])
		})

		it('should not log debug messages when level is info', () => {
			const { logger, console } = createTestLogger("info")
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')

			const output = console.output()
			assert.equal(output.length, 3)
			assert.deepStrictEqual(output[0], ['info', 'test info'])
			assert.deepStrictEqual(output[1], ['warn', Logger.YELLOW, 'test warn', Logger.RESET])
			assert.deepStrictEqual(output[2], ['error', Logger.RED, 'test error', Logger.RESET])
		})

		it('should only log errors when level is error', () => {
			const { logger, console } = createTestLogger({ level: "error", chromo: true })
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')

			const output = console.output()
			assert.equal(output.length, 1)
			assert.deepStrictEqual(output[0], ['error', 'test error'])
		})

		it('should not log anything when level is silent', () => {
			const { logger, console } = createTestLogger("silent")
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')
			logger.log('test log')

			const output = console.output()
			assert.ok(output.length === 0)
		})
	})

	describe('icons and colors', () => {
		it('should add icons when icons option is true', () => {
			const { logger, console } = createTestLogger({ level: 'debug', icons: true, chromo: false })

			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')
			logger.success('test success')

			const output = console.output()
			assert.deepStrictEqual(output[0], ['debug', Logger.DIM, '•', 'test debug', Logger.RESET])
			assert.deepStrictEqual(output[1], ['info', 'ℹ', 'test info'])
			assert.deepStrictEqual(output[2], ['warn', Logger.YELLOW, '∆', 'test warn', Logger.RESET])
			assert.deepStrictEqual(output[3], ['error', Logger.RED, '!', 'test error', Logger.RESET])
			assert.deepStrictEqual(output[4], ['info', Logger.GREEN, '✓', 'test success', Logger.RESET])
		})

		it('should not add colors when chromo option is false', () => {
			const { logger, console } = createTestLogger("debug")

			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')
			logger.success('test success')

			const output = console.output()
			assert.deepStrictEqual(output[0], ['debug', Logger.DIM, 'test debug', Logger.RESET])
			assert.deepStrictEqual(output[1], ['info', 'test info'])
			assert.deepStrictEqual(output[2], ['warn', Logger.YELLOW, 'test warn', Logger.RESET])
			assert.deepStrictEqual(output[3], ['error', Logger.RED, 'test error', Logger.RESET])
			assert.deepStrictEqual(output[4], ['info', Logger.GREEN, 'test success', Logger.RESET])
		})
	})
})
