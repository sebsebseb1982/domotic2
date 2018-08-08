import {Configuration} from "../../configuration/configuration";
import {MyNotification} from "../myNotification";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport";
import * as Mail from "nodemailer/lib/mailer";

let nodemailer = require('nodemailer');

export class MailService {
    configuration: Configuration;
    mailTransport: Mail;
    service: string;

    constructor(service: string) {
        this.configuration = new Configuration();
        this.service = service;
        this.mailTransport = nodemailer.createTransport(this.configuration.smtp);
    }

    send(notification: MyNotification, mailAddressesToNotify?: string[]) {
        let mailOptions:SendmailTransport.Options = {
            from: 'Maison <noreply@maison.fr>',
            to: mailAddressesToNotify ? mailAddressesToNotify : this.configuration.adminMailAddress,
            subject: `[${this.service}] ${notification.title}`,
            html: `<span>${notification.description}</span>`,
            sendmail: true
        };

        this.mailTransport.sendMail(mailOptions);
    }
}