import * as cheerio from 'cheerio';
import * as request from 'request';
import {MailService} from "../../notifications/services/mailService";
import {GoogleHomeService} from "../../notifications/services/googleHomeService";

export class NotifyPageChange {
    mail: MailService;
    url: string;
    googleHome: GoogleHomeService;

    constructor() {
        this.url = 'http://www.micromania.fr/ps4/consoles/editions-speciales.html';
        this.mail = new MailService('Alertes HTML');
        this.googleHome = new GoogleHomeService();
        this.checkPage().then((hasChanged: boolean) => {
            if(hasChanged) {
                let message = `La page ${this.url} a changé !`;
                this.mail.send({
                    title: message,
                    description: message
                })
                this.googleHome.say('Alerte PS4 édition limitée 500 millions activée !')
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
                    let $ = cheerio.load(html);
                    resolve($('.products-grid li').length !== 5);
                }
            );
        });
    }
}