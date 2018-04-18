import {Configuration} from "../../configuration/configuration";
import {MyNotification} from "../myNotification";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport";


export class MailService {
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
    }

    send(notification: MyNotification, mailAddressesToNotify?: string[]) {
        let mailOptions:SendmailTransport.Options = {
            from: 'Maison <noreply@maison.fr>',
            to: mailAddressesToNotify ? mailAddressesToNotify : this.configuration.adminMailAddress,
            subject: notification.title,
            html: `<p>${notification.description}</p>`,
            sendmail: true
        };

        let mailTransport = new SendmailTransport(mailOptions);
    }
}