import {Configuration} from "../../configuration/configuration";
import {MyNotification} from "../myNotification";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport";

let nodemailer = require('nodemailer');

export class MailService {
    configuration: Configuration;
    mailTransport: SendmailTransport;

    constructor() {
        this.configuration = new Configuration();
        this.mailTransport = nodemailer.createTransport(this.configuration.adminMailAddress);
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