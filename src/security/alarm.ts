import {TocToc} from "../toctoc/toctoc";
import {MailService} from "../notifications/services/mailService";
import {MyNotification} from "../notifications/myNotification";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";

export class Alarm {
    toctoc: TocToc;
    mail: MailService;
    nma: NotifyMyAndroidNotifierService;

    constructor() {
        this.toctoc = new TocToc();
        this.mail = new MailService();
        this.nma = new NotifyMyAndroidNotifierService('Alarme');
    }

    notifyIfDisarmed() {
        this.toctoc.ifPresent(() => {
            let notification = new MyNotification('Oubli ?', `L'alarme n'est pas enclenchée, est-ce normal ?`);
            this.mail.send(notification);
            this.nma.notify(notification);
        });
    }
}