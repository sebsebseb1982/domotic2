import {Configuration} from "../configuration/configuration";
import {SurveillanceStation} from "../synology/surveillanceStation";
import {Logger} from "../common/logger/logger";
import {VentilationStatusDB} from "../thermospi/db/VentilationStatusDB";
import {Alarm} from "../security/alarm/alarm";
import {VirtualService} from "../jeedom/VirtualService";


let exec = require('child_process').exec;
let MongoClient = require('mongodb').MongoClient;

export class TocToc {
    configuration: Configuration;
    surveillanceStation: SurveillanceStation;
    ventilationStatusDB: VentilationStatusDB;
    alarm: Alarm;
    logger: Logger;
    virtualService: VirtualService;

    constructor() {
        this.configuration = new Configuration();
        this.surveillanceStation = new SurveillanceStation();
        this.ventilationStatusDB = new VentilationStatusDB();
        this.alarm = new Alarm();
        this.logger = new Logger('Toc Toc');
        this.virtualService = new VirtualService();
    }

    updatePresence(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getCurrentPresence().then((lastPresenceStatus: boolean) => {
                let child = exec(`${this.configuration.toctoc.scriptPath}toctoc.sh ${this.configuration.toctoc.mailAccount.address} ${this.configuration.toctoc.mailAccount.password}`);
                child.stdout.on('data', (data) => {
                    this.logger.debug('stdout: ' + data);
                });
                child.stderr.on('data', (data) => {
                    this.logger.debug('stdout: ' + data);
                });
                child.on('close', (code) => {
                    let currentPresenceStatus = code == 1;
                    this.logger.debug(`Current presence getStatus : ${currentPresenceStatus}`);

                    if (lastPresenceStatus != currentPresenceStatus) {
                        this.saveNewPresenceStatus(currentPresenceStatus);
                        this.virtualService.updateVirtual(
                            {
                                id: 224,
                                name: 'Alarme'
                            },
                            currentPresenceStatus
                        );
                    }

                    resolve(currentPresenceStatus);
                });
            });
        });
    }

    ifPresent(ifCallback, elseCallback?) {
        this.execIf(true, ifCallback, elseCallback);
    }

    ifAbsent(ifCallback, elseCallback?) {
        this.execIf(false, ifCallback, elseCallback);
    }

    private execIf(expectedPresenceStatus, ifCallback, elseCallback) {
        this.getCurrentPresence().then((currentPresenceStatus: boolean) => {
            if (currentPresenceStatus === expectedPresenceStatus) {
                ifCallback();
            } else if (elseCallback !== undefined) {
                elseCallback();
            } else {
                this.logger.debug('Can\'t execute anything !')
            }
        });
    }

    private saveNewPresenceStatus(presenceStatus: boolean) {
        this.surveillanceStation.setHomeMode(!presenceStatus);
        if (!presenceStatus) {
            this.ventilationStatusDB.setWindowsOpened(false);
        }

        MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
            if (err) {
                this.logger.error('Erreur lors de la vérification de présence, on considère que la maison est fermée',
                    err
                );
            } else {
                db.collection('presences').insertOne(
                    {
                        status: presenceStatus,
                        date: new Date()
                    },
                    (err, result) => {
                        if (err) {
                            this.logger.error(
                                'Erreur lors de la vérification de présence, on considère que la maison est fermée',
                                err
                            );
                        } else {
                            this.logger.debug('Presence (getStatus=' + presenceStatus + ') inserted.');
                            db.close();
                        }
                    }
                );
            }
        });
    }

    private getCurrentPresenceWithAlarmFallback(initialError): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.alarm.isArmed().then((isArmed: boolean) => {
                this.logger.error(
                    `Erreur lors de la vérification de présence en base, présence récupérée auprès de l'alarme : Maison ${isArmed ? 'fermée' : 'ouverte'}`,
                    initialError
                );
                resolve(!isArmed);
            })
        });
    }

    getCurrentPresence(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                if (err) {
                    this.getCurrentPresenceWithAlarmFallback(err).then((isPresent) => {
                        resolve(isPresent);
                    });
                    this.logger.error(
                        `Erreur lors de la vérification de présence en base.`,
                        err
                    );
                } else {
                    db.collection('presences').findOne(
                        {},
                        {
                            sort: [['date', 'desc']]
                        },
                        (err, result) => {
                            if (err) {
                                this.getCurrentPresenceWithAlarmFallback(err).then((isPresent) => {
                                    resolve(isPresent);
                                });
                                this.logger.error(
                                    `Erreur lors de la vérification de présence en base.`,
                                    err
                                );
                            } else {
                                this.logger.debug(`Maison ${result.status ? 'ouverte' : 'fermée'}`);
                                resolve(result.status);
                            }
                            db.close();
                        }
                    );
                }
            });
        });
    }

    notifyIfDisarmed() {
        this.ifPresent(() => {
            this.logger.notify('Oubli ?', `L'alarme n'est pas enclenchée, est-ce normal ?`);
        });
    }
}