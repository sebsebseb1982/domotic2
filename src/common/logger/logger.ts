import {MailService} from "../../notifications/services/mailService";

export class Logger {

    constructor(private service: string) {}


    info(message: string) {
        console.log('\x1b[34m%s\x1b[0m', `[INFO] : ${message}`);
    }

    debug(message: string) {
        console.log('\x1b[32m%s\x1b[0m', `[DEBUG]: ${message}`);
    }

    warn(message: string, warn: string) {
        console.log('\x1b[33m%s\x1b[0m', `[WARN] : ${message}`);
        let mail = new MailService('WARN');
        mail.send({
            title: `[${this.service}] ${message}`,
            description: `${warn}`
        });
    }

    error(message: string, err: string) {
        console.log('\x1b[31m%s\x1b[0m', `[ERROR]: ${message}\n${err}`);
        let mail = new MailService('ERROR');
        mail.send({
            title: `[${this.service}] ${message}`,
            description: `${err}`
        });
    }
}