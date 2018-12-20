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

                    URLMonitor.logger.debug(`Valeur lue depuis la page "${value}"`);

                    if (value != alert.lastValue) {
                        URLMonitor.notifyAlert(alert, value);
                    } else {
                        URLMonitor.logger.info(`L'alerte "${alert.name}" n'a pas détecté de changement${alert.announceChange ? ` (valeur=${alert.lastValue})` : ''}`);
                    }
                });
            })
        });
    }

    private static notifyAlert(alert: Alert, newValue: string) {
        let message = `L'alerte "${alert.name}" vient de détecter un changement de valeur${alert.announceChange ? ` : ${alert.lastValue} --> ${newValue}` : ''}`;
        URLMonitor.logger.info(message);
        this.googleHome.say(message, true);

        URLMonitor.logger.notify(message);

        alert.lastValue = newValue;
        this.db.updateAlert(alert);
    }

    private static readURLContent(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    uri: url,
                    encoding: 'binary'
                },
                (error, response, html) => {
                    if (error) {
                        URLMonitor.logger.error(error, error);
                        reject();
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