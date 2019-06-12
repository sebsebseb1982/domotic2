import * as request from 'request';
import {MailService} from "../../notifications/services/mailService";
import {DB} from "./db";
import {IAlert, IScheduledTask} from "./alert";
import * as cheerio from 'cheerio';
import {Logger} from "../../common/logger/logger";
import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import * as cron from 'node-cron';
import * as _ from "lodash";
import {PushoverService} from "../../notifications/services/pushover-service";


class URLMonitor {
    mail: MailService;
    googleHome: GoogleHomeService;
    pushover: PushoverService;
    logger: Logger;
    db: DB;
    scheduledTasks: IScheduledTask[];

    constructor() {
        this.mail = new MailService('Surveillance URL');
        this.googleHome = new GoogleHomeService();
        this.pushover = new PushoverService();
        this.logger = new Logger('Surveillance URL');
        this.db = new DB();
        this.scheduledTasks = [];
    }

    start() {
        cron.schedule('* * * * *', () => {
            this.updateCrons();
        });
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
                        if (JSON.stringify(alert) === JSON.stringify(previouslyScheduledTask.alert)) {
                            this.logger.info(`[MAJ surveillances] L'alerte "${alert.name}" est déjà surveillée`);
                        } else {
                            this.logger.info(`[MAJ surveillances] La surveillance de l'alerte "${alert.name}" doit être mise à jour`);
                            previouslyScheduledTask.task.destroy();
                            previouslyScheduledTask.task = cron.schedule(alert.schedule, () => {
                                this.monitor(alert);
                            });
                            previouslyScheduledTask.alert = alert;

                            this.pushover.send({
                                title: `Mise à jour de l'alerte "${alert.name}"`,
                                description: JSON.stringify(alert),
                                priority: 0
                            });
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

            if (alert.announceChange) {
                this.logger.debug(`[Surveillance] Valeur lue depuis la page "${value}"`);
            }

            if (!value || value === '') {
                let messageErreur = `[Surveillance] L'alerte "${alert.name}" ne renvoit plus aucune valeur`;
                this.logger.error(messageErreur, messageErreur);
            } else if (value != alert.lastValue) {
                this.notifyAlert(alert, value);
            } else {
                this.logger.info(`[Surveillance] L'alerte "${alert.name}" n'a pas détecté de changement${alert.announceChange ? ` (valeur=${alert.lastValue})` : ''}`);
            }
        })
    }

    private notifyAlert(alert: IAlert, newValue: string) {
        let title = `L'alerte "${alert.name}" vient de détecter un changement de valeur${alert.announceChange ? ` : ${alert.lastValue} --> ${newValue}` : ''}`;
        let message = `L'alerte <a href="${alert.url}">${alert.name}</a> vient de détecter un changement de valeur${alert.announceChange ? ` : ${alert.lastValue} --> ${newValue}` : ''}`;
        this.logger.info(`[Surveillance] ${title}`);
        this.googleHome.say(title, true);

        this.logger.notify(title, message);

        this.pushover.send({
            title: title,
            description: message,
            priority: 0
        });


        alert.lastValue = newValue;
        this.db.updateAlert(alert);
    }

    private extractValueFromHTML(html: string, selector: string): string {
        let $ = cheerio.load(html);
        return $(selector).text();
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
}

new URLMonitor().start();