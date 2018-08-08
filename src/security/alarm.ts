import {TocToc} from "../toctoc/toctoc";
import {MailService} from "../notifications/services/mailService";
import {MyNotification} from "../notifications/myNotification";

export class Alarm {
    toctoc: TocToc;
    mail: MailService;

    constructor() {
        this.toctoc = new TocToc();
        this.mail = new MailService('Alarme');
    }

    notifyIfDisarmed() {
        this.toctoc.ifPresent(() => {
            let notification = new MyNotification('Oubli ?', `L'alarme n'est pas enclenchée, est-ce normal ?`);
            this.mail.send(notification);
        });
    }

    arm() {

    }

    disarm() {
        
    }

    getStatus(): Promise<boolean> {
        return this.toctoc.getCurrentPresence();
    }
}