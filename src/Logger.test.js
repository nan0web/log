import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Logger from './Logger.js'
import NoLogger from './NoLogger.js'

suite('Logger', () => {
	/** @type {Logger} */
	let logger
	/** @type {NoLogger} */
	let mockConsole

	describe('log levels', () => {
		it('should log debug messages when level is debug', () => {
			const level = "debug"
			mockConsole = new NoLogger({ level })
			logger = new Logger({ level, console: mockConsole })
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')

			const output = mockConsole.output()
			assert.equal(output.length, 4)
			assert.deepStrictEqual(output[0], ['debug', 'test debug'])
			assert.deepStrictEqual(output[1], ['info', 'test info'])
			assert.deepStrictEqual(output[2], ['warn', 'test warn'])
			assert.deepStrictEqual(output[3], ['error', 'test error'])
		})

		it('should not log debug messages when level is info', () => {
			const level = "info"
			mockConsole = new NoLogger({ level })
			logger = new Logger({ level, console: mockConsole })
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')

			const output = mockConsole.output()
			assert.equal(output.length, 3)
			assert.deepStrictEqual(output[0], ['info', 'test info'])
			assert.deepStrictEqual(output[1], ['warn', 'test warn'])
			assert.deepStrictEqual(output[2], ['error', 'test error'])
		})

		it('should only log errors when level is error', () => {
			const level = "error"
			mockConsole = new NoLogger({ level })
			logger = new Logger({ level, console: mockConsole })
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')

			const output = mockConsole.output()
			assert.equal(output.length, 1)
			assert.deepStrictEqual(output[0], ['error', 'test error'])
		})

		it('should not log anything when level is silent', () => {
			const level = "silent"
			mockConsole = new NoLogger({ level })
			logger = new Logger({ level, console: mockConsole })
			logger.debug('test debug')
			logger.info('test info')
			logger.warn('test warn')
			logger.error('test error')
			logger.log('test log')

			const output = mockConsole.output()
			assert.ok(output.length === 0)
		})
	})
})
