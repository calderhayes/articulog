# articulog
Simple typescript/javascript logging wrapper. Inspired by:

- [Common.Logging](https://github.com/net-commons/common-logging)
- [LogLevel](https://github.com/pimterry/loglevel)
- [Winston](https://github.com/winstonjs/winston)

The goals of this project is to do the following:

- Have a swappable typescript interface for logging
- Have several log levels that can be adjusted dynamically
- Have several categories of logs
- Allow for easy crafting of different log targets
- Enable a top level control to allow for configuring of logs dynamically, and as a group
- Create with little to no dependencies (for simple logging)
- Have this be useful for both browser and nodejs environments

## Installation

```
npm install --save articulog
```

## Usage

### Get a basic console log

```
import {log, LoggerLevel} from 'articulog'

log.info('Hello World!');

log.setLevel(LoggerLevel.SILENT);

log.error('This won't show up');

log.setLevel(LoggerLevel.ERROR);

log.debug('This won't show up either');

log.error('This will show up');

```

## More advanced logs

```
import {ConsoleLoggerFactory, LoggerLevel} from 'articulog';

ConsoleLoggerFactory.createLog({
  name: 'APILog',
  level: LoggerLevel.WARN,
  methodFactory: (rawMethod: (...msg : Array<any>) => void, methodName: string, level: LoggerLevel, loggerName: string) => {
    return (...msg : Array<any>) => {
      fetch(`http://localhost/logger?msg=${msg[0]}&methodName=${methodName}`);
      rawMethod(...msg);
    };
  }
});
```

## Top level log control

```
import {LogControl, LoggerLevel}

// Sets the loggers to silent
LogControl.turnOffAllLogs();

// Sets all logs to INFO
LogControl.setAllLogsToLevel(LoggerLevel.INFO);

let logger = LogControl.getLog('APILog');
logger.error('An error occured!');
```

### File logger

On a production nodejs application I would create a custom LoggerFactory that wraps
winston functionality. I will add an example soon, but it is just a matter of creating a special factory.

## Development

### Local Install

```
npm install
```

### Build

```
npm run build
```

### Test

```
npm test
```
