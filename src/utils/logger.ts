import { LogLevel } from '../types/logger';
import 'dotenv/config';

// Function to log messages to the console, with a log level to clean up the output
export function log(message: any, level: LogLevel = LogLevel.INFO): void {
    const LOG_LEVEL: LogLevel = process.env.LOG_LEVEL as LogLevel || LogLevel.INFO;

    if (LogLevel[level] >= LogLevel[LOG_LEVEL]) {
        console.log(`[${LogLevel[level]} - ${new Date().toLocaleTimeString()}] ${message}`);
    }
}