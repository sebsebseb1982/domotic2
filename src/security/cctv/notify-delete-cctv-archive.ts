import {MailService} from "../../notifications/services/mailService";
import {MyNotification} from "../../notifications/myNotification";

export class NotifyDeleteCCTVArchive {
    mail: MailService;

    constructor() {
        this.mail = new MailService();
    }

    notify() {
        let message = `Suppression de l'archive ${process.argv[1]}`;
        let myNotification = new MyNotification(`[CCTV] ${message}`, message);
        this.mail.send(myNotification);
    }
}