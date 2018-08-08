import {MailService} from "../../notifications/services/mailService";
import {MyNotification} from "../../notifications/myNotification";

export class NotifyDeleteCCTVArchive {
    mail: MailService;

    constructor() {
        this.mail = new MailService('CCTV');
    }

    notify() {
        let message = `Suppression de l'archive ${process.argv[1]}`;
        let myNotification = new MyNotification(message, message);
        this.mail.send(myNotification);
    }
}