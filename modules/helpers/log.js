var winston = require('winston');
var customLogLevels = {
    levels: {
        error: 0,
        warn: 1,
        debug: 2,
        info: 3,
        access: 4
    },
    colors: {
        error: 'red',
        warn: 'orange',
        debug: 'white',
        info: 'blue',
        access: 'green'
    }
};
winston.addColors(customLogLevels.colors);
winston.emitErrs = true;


var logger = new(winston.Logger)({
    levels: customLogLevels.levels,
    transports: [
        new(winston.transports.Console)({
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        }),
        /*
        new winston.transports.File ({
            name: 'TaxiStop Info',
            level: "info",
            filename: __dirname + '/../logs/TaxiStop.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true,
            timestamp: true,
            tailable: true
        }),
        new winston.transports.File ({
            name: 'TaxiStop Access',
            level: "access",
            //filename: __dirname + '/../logs/access.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true,
            timestamp: true,
            tailable: true
        }),
        new(winston.transports.DailyRotateFile)({
            name: 'file',
            datePattern: '.yyyy-MM-ddT',
            filename: "log_file.log"
        })
        */
    ],
    exceptionHandlers: [
        new(winston.transports.Console)({
            json: false,
            timestamp: true
        }),
        /*
        new(winston.transports.File)({
            filename: __dirname + '/exceptions.log',
            json: false
        })
        */
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding) {
        logger.info(message);
    }
};
