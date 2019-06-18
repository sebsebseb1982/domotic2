import {MailService} from "../../notifications/services/mailService";

export class Logger {

    private session: string;
    private recordSession: boolean;

    constructor(private service: string) {
    }

    info(message: string) {
        let formattedMessage = `[${this.service}][INFO] : ${message}`;
        console.log('\x1b[34m%s\x1b[0m', formattedMessage);
        this.appendToSession(formattedMessage);
    }

    debug(message: string) {
        let formattedMessage = `[${this.service}][DEBUG]: ${message}`;
        console.log('\x1b[32m%s\x1b[0m', formattedMessage);
        this.appendToSession(formattedMessage);
    }

    notify(title: string, message?: string) {
        let mail = new MailService('Notify');
        mail.send({
            title: `[${this.service}] ${title}`,
            description: `${message ? message : title}`
        });
    }

    warn(message: string, warn: string) {
        let formattedMessage = `[${this.service}][WARN] : ${message}`;
        console.log('\x1b[33m%s\x1b[0m', formattedMessage);
        this.appendToSession(formattedMessage);
        let mail = new MailService('WARN');
        mail.send({
            title: `[${this.service}] ${message}`,
            description: `${warn}`
        });
    }

    error(message: string, err: string) {
        let formattedMessage = `[${this.service}][ERROR]: ${message}\n${err}`;
        console.log('\x1b[31m%s\x1b[0m', formattedMessage);
        this.appendToSession(formattedMessage);
        let mail = new MailService('ERROR');
        mail.send({
            title: `[${this.service}] ${message}`,
            description: `${err}<br/><br/>${this.getStackTrace().replace(/(?:\r\n|\r|\n)/g, '<br>')}`
        });
    }

    startRecordSession() {
        this.session = '';
        this.recordSession = true;
    }

    stopRecordSession() {
        this.recordSession = false;
        this.notify('Log', this.session);
    }

    private getStackTrace() {
        let obj = {};
        Error.captureStackTrace(obj, this.getStackTrace);
        return (obj as any).stack;
    };

    private appendToSession(message: string) {
        if (this.recordSession) {
            this.session = `${this.session}<br/>${message}`;
        }
    }
}