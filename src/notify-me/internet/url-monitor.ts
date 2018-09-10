import * as request from 'request';
import {MailService} from "../../notifications/services/mailService";
import {DB} from "./db";
import {Alert} from "./alert";
import * as cheerio from 'cheerio';
import {Logger} from "../../common/logger/logger";
import {GoogleHomeService} from "../../notifications/services/googleHomeService";

export class URLMonitor {
    static mail: MailService = new MailService('Surveillance URL');
    static googleHome: GoogleHomeService = new GoogleHomeService();
    static logger: Logger = new Logger('Surveillance URL');
    static db: DB = new DB();

    static lookForChange() {
        URLMonitor.db.getAlerts().then((alerts) => {
            alerts.forEach((alert: Alert) => {
                URLMonitor.readURLContent(alert.url).then((content: string) => {
                    let value;

                    if (alert.cssSelector) {
                        value = URLMonitor.readValueFromHTML(content, alert.cssSelector);
                    } else if (alert.field) {
                        value = content[alert.field];
                    } else {
                        value = content;
                    }

                    if (value != alert.lastValue) {
                        let message = `L'alerte "${alert.name}" vient de détecter un changement de valeur${alert.announceChange ? ` : ${alert.lastValue} --> ${value}` : ''}`;
                        URLMonitor.logger.info(message);
                        this.googleHome.say(message, true);
                        alert.lastValue = value;
                        this.db.updateAlert(alert);
                    } else {
                        URLMonitor.logger.info(`L'alerte "${alert.name}" n'a pas détecté de changement${alert.announceChange ? ` (valeur=${alert.lastValue})` : ''}`);
                    }
                });
            })
        });
    }

    private static readURLContent(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    uri: url,
                    encoding: 'binary'
                },
                (error, response, html) => {
                    if(error) {
                        URLMonitor.mail.send({
                           title:error,
                           description:error
                        });
                    }
                    resolve(html);
                }
            );
        });
    }

    private static readValueFromHTML(html: string, selector: string): string {
        let $ = cheerio.load(html);
        return $(selector).text();
    }
}