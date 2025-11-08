#!/usr/bin/env node

import Logger from "../src/index.js"

// Create a logger with custom formats
const logger = new Logger({
	level: 'debug',
	icons: true,
	chromo: true,
	formats: [
		["debug", { icon: "🔍", color: Logger.CYAN }],
		["info", { icon: "ℹ️ ", color: Logger.GREEN }],
		["warn", { icon: "⚠️ ", color: Logger.YELLOW }],
		["error", { icon: "❌", color: Logger.RED }],
		["success", { icon: "✅", color: Logger.GREEN }],
		["custom", { icon: "💎", color: Logger.MAGENTA, bgColor: Logger.BG_WHITE }],
	]
})

// Use custom formats
logger.debug("Debug message with cyan color and magnifier icon")
logger.info("Info message with green color and info icon")
logger.warn("Warning message with yellow color and warning icon")
logger.error("Error message with red color and cross icon")
logger.success("Success message with green color and checkmark icon")

// Use custom format that was defined in constructor
const customFormat = Logger.createFormat({ icon: "💎", color: Logger.MAGENTA })
logger.info(customFormat, "Custom formatted message")

// Style a value with background and text colors
const styledText = Logger.style("This text is magenta on white background", {
	color: Logger.MAGENTA,
	bgColor: "white"
})
logger.log(styledText)

console.log("\nDone!")
