# @nan0web/log

|Назва пакета|[Статус](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Документація|Покриття тестами|Функції|Версія Npm|
|---|---|---|---|---|---|
 |[@nan0web/log](https://github.com/nan0web/logger/) |🟢 `98.7%` |🧪 [Англійською 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/logger/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/logger/blob/main/docs/uk/README.md) |🟢 `94.1%` |✅ d.ts 📜 system.md 🕹️ playground |— |

Кросплатформний клас Logger, що обгортає методи console для Node.js і браузерів
з узгодженим інтерфейсом та підтримкою потокового запису.

## Опис

Пакет `@nan0web/log` надає мінімальний, але потужний фундамент для систем логування.
Основні класи:

- `Logger` — головний клас логування з підтримкою рівнів, іконок, кольорів, часу та потоків
- `LogConsole` — обгортає методи консолі для узгодженого кросплатформного логування
- `LoggerFormat` — визначає формат для рівня логування (іконка, колір, фон)
- `NoLogger` — зберігає логи в пам'яті, ідеально для тестування
- `NoConsole` — зберігає вивід консолі в пам'яті, ідеально для тестування

Ці класи чудово підходять для створення CLI-інструментів, шарів відладки, уніфікованих записів і потокової передачі даних до файлів або зовнішніх сервісів.

## Встановлення

Як встановити через npm?
```bash
npm install @nan0web/log
```

Як встановити через pnpm?
```bash
pnpm add @nan0web/log
```

Як встановити через yarn?
```bash
yarn add @nan0web/log
```

## Використання

### Базовий Logger

Logger можна створити з рівнем або опціями і він буде виводити усе що нижче цього рівня

Як створити екземпляр Logger з рівнем?
```js
import Logger from '@nan0web/log'
const logger = new Logger('debug')
logger.info(typeof logger.debug) // ← function
logger.info(logger.level) // ← debug
```

Як створити екземпляр Logger з опціями?
```js
import Logger from '@nan0web/log'
const logger = new Logger({
	level: 'info',
	icons: true,
	chromo: true,
	time: true,
})
logger.info("Привіт з опціями") // ← TIME-HH-IIT... ℹ Привіт з опціями
```

### Кастомні формати

Logger підтримує власні формати для різних рівнів

Як використовувати власні формати для різних рівнів?
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
logger.debug("Налагодження")     // ← \x1b[36m🔍 Налагодження\x1b[0m
logger.info("Інформація")         // ← \x1b[32mℹ️  Інформація\x1b[0m
logger.warn("Попередження")       // ← \x1b[33m⚠️  Попередження\x1b[0m
logger.error("Помилка")           // ← \x1b[31m❌ Помилка\x1b[0m
logger.success("Успіх")           // ← \x1b[32m✅ Успіх\x1b[0m
```

### Потокове логування

Logger дозволяє передавати логи у файли або зовнішні сервіси

Як передати логи у файл?
```js
import Logger from '@nan0web/log'
let streamOutput = ""
const logger = new Logger({
	stream: async (message) => {
		streamOutput += message
	}
})
logger.broadcast("Потокове повідомлення")
// Зачекайте трохи для асинхронної операції
await new Promise(resolve => setTimeout(resolve, 10))
console.log(streamOutput) // ← Потокове повідомлення
```

### Логування в пам'ять з NoLogger

NoLogger зберігає логи в пам'яті замість виводу — ідеально для тестів

Як зберігати логи в пам'яті з NoLogger?
```js
import { NoLogger } from '@nan0web/log'
const logger = new NoLogger({ level: "debug" })
logger.debug("Налагодження")
logger.info("Інформація")
logger.warn("Попередження")
logger.error("Помилка")
logger.success("Успіх")
const logs = logger.output()
console.log(logs) // ← [ [ "debug", "Налагодження" ], [ "info", "Інформація" ], ... ]
```

### Додаткові можливості

Logger має корисні хелпери для форматування, таблиць, прогресу тощо

Як створити та показати таблицю?
```js
import Logger from '@nan0web/log'
const logger = new Logger()
const data = [
	{ name: "Йван", age: 30, city: "Нью-Йорк" },
	{ name: "Олена", age: 25, city: "Лос-Анджелес" },
	{ name: "Богдан", age: 35, city: "Чикаго" }
]
// Захопити вивід таблиці шляхом моку console методів
logger.table(data, ["name", "age", "city"], { padding: 2, border: 1 })
```

Як стилізувати текст з кольорами та фоном?
```js
import Logger from '@nan0web/log'
const styled = Logger.style("Стилізований текст", {
	color: Logger.MAGENTA,
	bgColor: "white"
})
console.info(styled) // ← \x1b[35m\x1b[47mСтилізований текст\x1b[0m
```

Як працювати з курсором і очищенням рядків для прогресу?
```js
import Logger from '@nan0web/log'
const logger = new Logger()
logger.info(logger.cursorUp(2)) // ← \x1b[2A
logger.info(logger.cursorDown(1)) // ← \x1b[1B
logger.info(logger.clearLine()) // ← \x1b[2K\r

const logs = logger.output()
```

## API

### Logger

* **Властивості**
	* `level` – мінімальний рівень логування (debug|info|warn|error|silent)
	* `console` – Console екземпляр для виводу
	* `icons` – чи показувати іконки
	* `chromo` – чи застосовувати кольори
	* `time` – формат для часу (default: false)
	* `spent` – чи виводити різницю у часі виконання (default: false)
	* `stream` – функція передачі виводу (default: null)
	* `formats` – карта форматів для різних рівнів

* **Методи**
	* `debug(...args)` – налагодження
	* `info(...args)` – інформування
	* `warn(...args)` – попередження
	* `error(...args)` – помилки
	* `success(...args)` – успіх (використовує інфо канал)
	* `log(...args)` – загальне повідомлення
	* `setFormat(target, opts)` – формат для рівня
	* `setStream(streamFunction)` – запис логів у функцію
	* `table(data, columns, options)` – таблиця даних
	* `write(str)` – запис прямо в stdout
	* `cursorUp(lines)` – перемістити курсор у верх
	* `cursorDown(lines)` – перемістити курсор униз
	* `clear()` – очистити консоль
	* `clearLine()` – очистити поточний рядок
	* `getWindowSize()` – [колонки, рядки] термінала
	* `cut(str, width)` – обрізати рядок до ширини термінала
	* `static from(input)` – створити Logger з рядка або опцій
	* `static detectLevel(argv)` – визначити рівень з аргументів CLI
	* `static createFormat(name, value)` – створити LoggerFormat
	* `static style(value, styleOptions)` – стилізувати значення
	* `static stripANSI(str)` – видалити ANSI коди з рядка
	* `static progress(i, len, fixed)` – відсотковий прогрес
	* `static spent(checkpoint, fixed)` – час з моменту checkpoint
	* `static bar(i, len, width, char, space)` – полоса прогресу

### LogConsole

* **Властивості**
	* `console` – об'єкт консолі
	* `prefix` – префікс для кожного логу

* **Методи**
	* `debug(...args)` – налагодження
	* `info(...args)` – інформування
	* `warn(...args)` – попередження
	* `error(...args)` – помилки
	* `log(...args)` – загальне повідомлення
	* `clear()` – очистити консоль
	* `assert(condition, ...args)` – перевірити умову
	* `count(label)` – лічильник викликів з міткою
	* `countReset(label)` – скинути лічильник
	* `dir(obj)` – показати властивості об’єкта
	* `dirxml(obj)` – показати дерево об’єкта
	* `group(...args)` – група
	* `groupCollapsed(...args)` – згорнута група
	* `groupEnd()` – закрити поточну групу
	* `profile(label)` – почати профілювання
	* `profileEnd(label)` – закінчити профілювання
	* `time(label)` – почати таймер
	* `timeStamp(label)` – позначка часу
	* `timeEnd(label)` – зупинити таймер і записати час
	* `timeLog(label)` – показати стан таймера
	* `table(data, columns)` – відобразити таблицю
	* `trace()` – трасування стеку

### LoggerFormat

* **Властивості**
	* `icon` – іконка
	* `color` – ANSI код кольору
	* `bgColor` – ANSI код фону

* **Методи**
	* `static from(input)` – створити з об’єкта або екземпляра

### NoLogger

Розширює `Logger`.

* **Властивості**
	* `console` – екземпляр NoConsole для зберігання

* **Методи**
	* `output()` – отримати всі збережені повідомлення

### NoConsole

* **Властивості**
	* `silent` – чи придушувати вивід

* **Методи**
	* `debug(...args)` – зберегти повідомлення налагодження
	* `info(...args)` – зберегти інфо-повідомлення
	* `warn(...args)` – зберегти попередження
	* `error(...args)` – зберегти помилку
	* `log(...args)` – зберегти загальне повідомлення
	* `clear()` – очистити всі збережені
	* `output(type)` – повідомлення (всі або відфільтровані за типом)
	* `static from(input)` – створити або повернути NoConsole

/**
@docs
## Java•Script

Використовує `d.ts` файли для автодоповнення

## CLI Playground

Як запустити демо-скрипт?
```bash
# Клонуйте репозиторій і запустіть CLI-демо
git clone https://github.com/nan0web/log.git
cd log
npm install
npm run playground
```

## Внески

Як зробити внесок? - [читати тут](./CONTRIBUTING.md)

## Ліцензія

Як ліцензія ISC? - [читати тут](./LICENSE)
