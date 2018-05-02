import {MailService} from "../notifications/services/mailService";
import * as child from 'child_process';
import {MyNotification} from "../notifications/myNotification";

export class Backup {
    mail: MailService;

    constructor() {
        this.mail = new MailService();
    }

    backupCron() {
        let childProcess = child.exec('crontab -l');

        childProcess.stdout.on('data', (data) => {
            let mailBackup = new MyNotification('Backup CRON', data.toString().replace(/[\r\n]/gi, '\r\n'));
            this.mail.send(mailBackup);
        });
    }
}