import {TocToc} from "../../toctoc/toctoc";
import {MailService} from "../../notifications/services/mailService";
import {MyNotification} from "../../notifications/myNotification";
import {WebUILibraries} from "./web-ui-libraries";
import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import * as request from 'request';
import * as _ from "lodash";

export class Alarm {
    toctoc: TocToc;
    mail: MailService;
    webUILibraries: WebUILibraries;
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.toctoc = new TocToc();
        let service = "Alarme";
        this.mail = new MailService(service);
        this.webUILibraries = new WebUILibraries();
        this.configuration = new Configuration();
        this.logger = new Logger(service);
    }

    notifyIfDisarmed() {
        this.toctoc.ifPresent(() => {
            let notification = new MyNotification('Oubli ?', `L'alarme n'est pas enclenchée, est-ce normal ?`);
            this.mail.send(notification);
        });
    }

    isArmed(): Promise<boolean> {
        return this.executeCallback((): Promise<boolean> => {
            return new Promise<boolean>((resolve, reject) => {
                let uri = `http://${this.configuration.alarm.hostname}:80/statuslive.html`;
                this.logger.debug(`Ouverture de ${uri}`);
                request.get(
                    {
                        uri: uri
                    },
                    (error, response: request.Response, html) => {
                        if (error) {
                            this.logger.error(`Erreur lors de la lecture du statut de l'alarme (${uri})`, error);
                            resolve(true);
                        } else {
                            resolve(_.includes(html, 'new Array(2,0);'))
                        }
                    }
                );
            });
        });
    }

    arm(): Promise<void> {
        this.logger.info('Armement alarme');
        return this.execute('r');
    }

    disarm(): Promise<void> {
        this.logger.info('Désarmement alarme');
        return this.execute('d');
    }

    test() {
        this.logout().then(() => {
            this.login().then(() => {
                let interval = setInterval(() => {
                    let uri = `http://${this.configuration.alarm.hostname}:80/waitlive.html`;
                    this.logger.debug(`Ouverture de ${uri}`);
                    request.get(
                        {
                            uri: uri
                        },
                        (error, response: request.Response, html) => {
                            this.logger.debug(_.includes(html, 'prg=4').toString());
                            if (_.includes(html, 'prg=4')) {
                                clearInterval(interval);
                                let uri = `http://${this.configuration.alarm.hostname}:80/statuslive.html?area=00&value=${'d'}`;
                                this.logger.debug(`Ouverture de ${uri}`);
                                request.get(
                                    {
                                        uri: uri
                                    },
                                    (error, response: request.Response, html) => {
                                        if (error) {
                                            this.logger.error(`Erreur lors de l'éxécutuion d'une commande (${uri})`, error);
                                        } else {
                                        }
                                    }
                                );
                            }
                        }
                    );
                }, 1500);
            });
        });
    }

    private execute(command: string): Promise<void> {
        return this.executeCallback(() => {
            return new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    let uri = `http://${this.configuration.alarm.hostname}:80/statuslive.html?area=00&value=${command}`;
                    this.logger.debug(`Ouverture de ${uri}`);
                    request.get(
                        {
                            uri: uri
                        },
                        (error, response: request.Response, html) => {
                            if (error) {
                                reject(response.statusCode);
                                this.logger.error(`Erreur lors de l'éxécutuion d'une commande (${uri})`, error);
                            } else {
                                resolve();
                            }
                        }
                    );
                }, 15 * 1000);
            })
        });
    }

    private generateSES(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let uri = `http://${this.configuration.alarm.hostname}:80/login_page.html`;
            this.logger.info(`Login`);
            this.logger.debug(`Ouverture de ${uri}`);
            request.get(
                {
                    uri: uri
                },
                (error, response: request.Response, html) => {
                    if (error) {
                        reject(null);
                        this.logger.error(`Erreur lors du login (${uri})`, error);
                    } else {
                        let myRegexp = /loginaff\("([A-Z0-9]*)"/g;
                        let match = myRegexp.exec(html);
                        if (match) {
                            let ses = match[1];
                            this.logger.info(`Génération d'un jeton SES (${ses})`);
                            resolve(ses);
                        } else {
                            reject(null);
                            this.logger.error(`Impossible de générer un jeton SES à partir de la page de login (${uri}) de l'alarme`, html);
                        }
                    }
                }
            );
        });
    }

    private executeCallback(callback: () => Promise<any>): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            this.logout().then(() => {
                this.login().then(() => {
                    this.waitForWEBUI().then(() => {
                        callback().then((valueReturned) => {
                            this.logout().then(() => {
                                resolve(valueReturned);
                            });
                        });
                    });
                });
            });
        });
    }

    private login(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.generateSES().then((ses) => {
                let credentials = this.webUILibraries.getCredentials(
                    this.configuration.alarm.user,
                    this.configuration.alarm.password,
                    ses
                );

                this.logger.info(`Encodage du user/password (u=${credentials.u}, p=${credentials.p})`);

                let uri = `http://${this.configuration.alarm.hostname}:80/default.html?u=${credentials.u}&p=${credentials.p}`;
                this.logger.info(`Authentification`);
                this.logger.debug(`Ouverture de ${uri}`);
                request.get(
                    {
                        uri: uri
                    },
                    (error, response: request.Response, html) => {
                        if (error) {
                            reject();
                            this.logger.error(`Erreur lors de l'authentification (${uri})`, error);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        })
    }

    private logout(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let uri = `http://${this.configuration.alarm.hostname}:80/logout.html`;
            this.logger.info(`Logout`);
            this.logger.debug(`Ouverture de ${uri}`);
            request.get(
                {
                    uri: uri
                },
                (error, response: request.Response, html) => {
                    if (error) {
                        reject();
                        this.logger.error(`Erreur lors du logout (${uri})`, error);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    private waitForWEBUI(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let interval = setInterval(() => {
                let uri = `http://${this.configuration.alarm.hostname}:80/waitlive.html`;
                this.logger.debug(`Authentification en cours ...`);
                request.get(
                    {
                        uri: uri
                    },
                    (error, response: request.Response, html) => {
                        if (_.includes(html, 'prg=4')) {
                            clearInterval(interval);
                            resolve();
                        }
                    }
                );
            }, 1500);
        });
    }
}