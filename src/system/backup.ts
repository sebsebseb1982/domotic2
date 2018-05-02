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
            console.log(((data.toString() || '').match(/\r\n/gi) || []).length);
            let mailBackup = new MyNotification('Backup CRON', data.toString().replace(/\n/gi, '<br />'));
            this.mail.send(mailBackup);
        });
    }
}