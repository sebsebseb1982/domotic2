import * as request from 'request';
import {MailService} from "../../notifications/services/mailService";
import {DB} from "./db";
import {IAlert, IScheduledTask} from "./alert";
import * as cheerio from 'cheerio';
import {Logger} from "../../common/logger/logger";
import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import * as cron from 'node-cron';

export class URLMonitor {
    mail: MailService;
    googleHome: GoogleHomeService;
    logger: Logger;
    db: DB;
    scheduledTasks: IScheduledTask[];

    constructor() {
        this.mail = new MailService('Surveillance URL');
        this.googleHome = new GoogleHomeService();
        this.logger = new Logger('Surveillance URL');
        this.db = new DB();
    }

    start() {
        cron.schedule('* * * * *', () => {
            this.deletePreviousScheduledTasks();
            this.updateCrons();
        });
    }

    private updateCrons() {
        this.db.getAlerts().then((alerts) => {
            alerts.forEach((alert: IAlert) => {
                if (cron.validate(alert.schedule)) {
                    this.scheduledTasks.push({
                        alert: alert,
                        task: cron.schedule(alert.schedule, () => {
                            this.monitor(alert);
                        })
                    });
                    this.logger.info(`Planification (${alert.schedule}) de l'alerte "${alert.name}"`);
                } else {
                    this.logger.error(`Syntaxe CRON incorrecte`, `Syntaxe CRON ${alert.schedule} incorrecte pour l'alerte "${alert.name}"`);
                }
            })
        });
    }

    private deletePreviousScheduledTasks() {
        this.scheduledTasks.forEach((scheduledTask: IScheduledTask) => {
            scheduledTask.task.destroy();
        });
    }

    private notifyAlert(alert: IAlert, newValue: string) {
        let title = `L'alerte "${alert.name}" vient de détecter un changement de valeur${alert.announceChange ? ` : ${alert.lastValue} --> ${newValue}` : ''}`;
        let message = `L'alerte <a href="${alert.url}">${alert.name}</a> vient de détecter un changement de valeur${alert.announceChange ? ` : ${alert.lastValue} --> ${newValue}` : ''}`;
        this.logger.info(title);
        this.googleHome.say(title, true);

        this.logger.notify(title, message);

        alert.lastValue = newValue;
        this.db.updateAlert(alert);
    }

    private readURLContent(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    uri: url,
                    encoding: 'binary'
                },
                (error, response, html) => {
                    if (error) {
                        this.logger.error(error, error);
                        reject();
                    }
                    resolve(html);
                }
            );
        });
    }

    private extractValueFromHTML(html: string, selector: string): string {
        let $ = cheerio.load(html);
        return $(selector).text();
    }

    private monitor(alert: IAlert) {
        this.readURLContent(alert.url).then((content: string) => {
            let value;

            if (alert.cssSelector) {
                value = this.extractValueFromHTML(content, alert.cssSelector);
            } else if (alert.field) {
                value = content[alert.field];
            } else {
                value = content;
            }

            this.logger.debug(`Valeur lue depuis la page "${value}"`);

            if (value != alert.lastValue) {
                this.notifyAlert(alert, value);
            } else {
                this.logger.info(`L'alerte "${alert.name}" n'a pas détecté de changement${alert.announceChange ? ` (valeur=${alert.lastValue})` : ''}`);
            }
        })
    }
}