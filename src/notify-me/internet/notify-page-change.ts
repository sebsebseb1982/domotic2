import * as request from 'request';
import {MailService} from "../../notifications/services/mailService";
import {GoogleHomeService} from "../../notifications/services/googleHomeService";

export class NotifyPageChange {
    mail: MailService;
    googleHome: GoogleHomeService;

    constructor(private alertName: string, private url:string, private predicate: (html: string) => boolean) {
        this.mail = new MailService('Alertes HTML');
        this.googleHome = new GoogleHomeService();
        this.checkPage().then((hasChanged: boolean) => {
            if(hasChanged) {
                this.mail.send({
                    title: this.alertName,
                    description: `La page ${this.url} a changé !`
                });
                this.googleHome.say(`Alerte ${this.alertName} activée !`);
            }
        });
    }

    private checkPage(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    uri: this.url,
                    encoding: 'binary'
                },
                (error, response, html) => {
                    resolve(this.predicate(html));
                }
            );
        });
    }
}