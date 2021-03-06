import * as request from 'request';
import {MailService} from "../../notifications/services/mailService";
import {DB} from "./db";
import {IAlert, IScheduledTask} from "./alert";
import * as cheerio from 'cheerio';
import {Logger} from "../../common/logger/logger";
//import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import * as cron from 'node-cron';
import * as _ from "lodash";
import {PushoverService} from "../../notifications/services/pushover-service";
import * as diff from "diff";


class URLMonitor {
    mail: MailService;
    //  googleHome: GoogleHomeService;
    pushover: PushoverService;
    logger: Logger;
    db: DB;
    scheduledTasks: IScheduledTask[];

    constructor() {
        this.mail = new MailService('Surveillance URL');
        //    this.googleHome = new GoogleHomeService();
        this.pushover = new PushoverService();
        this.logger = new Logger('Surveillance URL');
        this.db = new DB();
        this.scheduledTasks = [];
    }

    start() {
        this.updateCrons();
        cron.schedule(
            '*/15 * * * *',
            this.updateCrons
        );
    }

    private updateCrons() {
        this.logger.info(`[MAJ surveillances] Mise à jour des surveillances d'alertes`);
        this.db.getAlerts().then((alerts) => {
            alerts.forEach((alert: IAlert) => {
                if (cron.validate(alert.schedule)) {

                    let previouslyScheduledTask: IScheduledTask = _.find(this.scheduledTasks, (scheduledTask: IScheduledTask) => {
                        return JSON.stringify(alert._id) === JSON.stringify(scheduledTask.alert._id);
                    });

                    if (previouslyScheduledTask) {
                        if (this.isSameAlerts(alert, previouslyScheduledTask.alert)) {
                            this.logger.info(`[MAJ surveillances] L'alerte "${alert.name}" est déjà surveillée`);
                        } else {
                            this.logger.info(`[MAJ surveillances] La surveillance de l'alerte "${alert.name}" doit être mise à jour`);
                            previouslyScheduledTask.task.destroy();
                            previouslyScheduledTask.task = cron.schedule(alert.schedule, () => {
                                this.monitor(alert);
                            });
                            previouslyScheduledTask.alert = alert;

                            let message = `MAJ de l'alerte "${alert.name}"`;
                            this.pushover.send({
                                title: message,
                                description: message,
                                priority: 0
                            });

                            this.logger.notify(message, JSON.stringify(alert));
                        }
                    } else {
                        this.logger.info(`[MAJ surveillances] L'alerte "${alert.name}" est désormais surveillée`);
                        this.scheduledTasks.push({
                            alert: alert,
                            task: cron.schedule(alert.schedule, () => {
                                this.monitor(alert);
                            })
                        });
                    }
                } else {
                    this.logger.error(`[MAJ surveillances] Syntaxe CRON incorrecte`, `Syntaxe CRON ${alert.schedule} incorrecte pour l'alerte "${alert.name}"`);
                }
            })
        });
    }

    private monitor(alert: IAlert) {
        this.logger.info(`[Surveillance] Alerte "${alert.name}"`);
        this.readURLContent(alert.url).then((content: string) => {
            let value;

            if (alert.cssSelector) {
                value = this.extractValueFromHTML(content, alert.cssSelector);
            } else if (alert.field) {
                value = content[alert.field];
            } else {
                value = content;
            }

            if (!value || value === '') {
                let messageErreur = `[Surveillance] L'alerte "${alert.name}" (url=${alert.url},selecteur=${alert.cssSelector}) ne renvoit plus aucune valeur`;
                this.logger.error(messageErreur, messageErreur);
            } else if (value != alert.lastValue) {
                this.notifyAlert(alert, value);
            } else {
                this.logger.info(`[Surveillance] L'alerte "${alert.name}" n'a pas détecté de changement${alert.announceChange ? ` (valeur=${alert.lastValue})` : ''}`);
            }
        })
    }

    private notifyAlert(alert: IAlert, newValue: string) {

        let compareResultParts = diff.diffChars(alert.lastValue, newValue);
        let compareResult = '';
        compareResultParts.forEach((part) => {
            if (part.added) {
                compareResult += `<strong style="color:green;">${part.value}</strong>`;
            } else if (part.removed) {
                compareResult += `<del style="color:red;">${part.value}</del>`;
            } else {
                compareResult += part.value;
            }
        });


        let title = `L'alerte "${alert.name}" vient de detecter un changement de valeur${alert.announceChange ? ` : ${alert.lastValue} --> ${newValue}` : ''}`;
        let message = `L'alerte <a href="${alert.url}">${alert.name}</a> vient de détecter un changement de valeur : <br/>${compareResult}`;
        this.logger.info(`[Surveillance] ${title}`);
        //this.googleHome.say(title, true);

        this.logger.notify(title, message);

        this.pushover.send({
            title: 'Alerte',
            description: title,
            priority: 0
        });


        alert.lastValue = newValue;
        this.db.updateAlert(alert);
    }

    private isSameAlerts(alert1: IAlert, alert2: IAlert) {
        return JSON.stringify(alert1._id) === JSON.stringify(alert2._id)
            && JSON.stringify(alert1.name) === JSON.stringify(alert2.name)
            && JSON.stringify(alert1.url) === JSON.stringify(alert2.url)
            && JSON.stringify(alert1.schedule) === JSON.stringify(alert2.schedule)
            && JSON.stringify(alert1.announceChange) === JSON.stringify(alert2.announceChange)
            && JSON.stringify(alert1.cssSelector) === JSON.stringify(alert2.cssSelector)
            && JSON.stringify(alert1.field) === JSON.stringify(alert2.field);

    }

    private extractValueFromHTML(html: string, selector: string): string {
        let $ = cheerio.load(html);
        //this.logger.debug(JSON.stringify($(selector)));
        return $(selector).text();
    }

    private readURLContent(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    uri: url,
                    encoding: 'utf8',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0'
                    }
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
}

new URLMonitor().start();