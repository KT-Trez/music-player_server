import moment from 'moment';

/**
 * Public class for better console logging management.
 */
export default class Logger {
    /**
     * Creates timestamp in selected format.
     * @param format - format in which timestamp will be created.
     * @return timestamp - created timestamp.
     */
    static getTimestamp(format?: string): string {
        let timestamp: string;
        switch (format) {
            case 'd':
                timestamp = moment(new Date()).format('DD/MM/YYYY');
                break;
            case 'dhf':
                timestamp = moment(new Date()).format('DD/MM/YYYY HH:mm:ss.SSS');
                break;
            case 'dhs':
                timestamp = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
                break;
            case 'hf':
                timestamp = moment(new Date()).format('HH:mm:ss.SSS');
                break;
            case 'hs':
                timestamp = moment(new Date()).format('HH:mm:ss');
                break;
            default:
                timestamp = '';
        }
        return timestamp;
    }

    // public log(message: string, logLayout: string, timeStamp?: 'd' | 'dhf' | 'dhs' | 'hf' | 'hs'): string { // TODO: Multipurpose log command.
    //     return this.getTimestamp(timeStamp) + '\u001b[31m [INFO] \u001b[0m' + message +'.';
    // }

    /**
     * Logs nicely formatted message, (of error status), possibly with timestamp.
     * @param message - a message that will be logged.
     * @param timeStamp - a timestamp that will be added to the message.
     */
    static error(message: string, timeStamp?: 'd' | 'dhf' | 'dhs' | 'hf' | 'hs'): void {
        console.log(this.getTimestamp(timeStamp) + '\u001b[31m [ERROR] \u001b[0m' + message);
    }

    /**
     * Logs nicely formatted message, (of info status), possibly with timestamp.
     * @param message - a message that will be logged.
     * @param timeStamp - a timestamp that will be added to the message.
     */
    static info(message: string, timeStamp?: 'd' | 'dhf' | 'dhs' | 'hf' | 'hs'):void {
        console.log(this.getTimestamp(timeStamp) + ' \u001b[36m[INFO]\u001b[0m ' + message);
    }

    /**
     * Logs nicely formatted message, (of success status), possibly with timestamp.
     * @param message - a message that will be logged.
     * @param timeStamp - a timestamp that will be added to the message.
     */
    static success(message: string, timeStamp?: 'd' | 'dhf' | 'dhs' | 'hf' | 'hs'): void {
        console.log(this.getTimestamp(timeStamp) + ' \u001b[32m[SUCCESS]\u001b[0m ' + message);
    }

    /**
     * Logs nicely formatted message, (of warning status), possibly with timestamp.
     * @param message - a message that will be logged.
     * @param timeStamp - a timestamp that will be added to the message.
     */
    static warning(message: string, timeStamp?: 'd' | 'dhf' | 'dhs' | 'hf' | 'hs'): void {
        console.log(this.getTimestamp(timeStamp) + ' \u001b[35m[WARNING]\u001b[0m ' + message);
    }

    /**
     * Logs nicely formatted message, (of working status), possibly with timestamp.
     * @param message - a message that will be logged.
     * @param timeStamp - a timestamp that will be added to the message.
     */
    static working(message: string, timeStamp?: 'd' | 'dhf' | 'dhs' | 'hf' | 'hs'): void {
        console.log(this.getTimestamp(timeStamp) + ' \u001b[33m[WORKING]\u001b[0m ' + message);
    }
}