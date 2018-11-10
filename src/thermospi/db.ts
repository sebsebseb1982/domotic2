import {ITemperature} from "./models/temperature";
import {Configuration} from "../configuration/configuration";
import * as _ from "lodash";
import {Db} from "mongodb";
import {IVentilationStatus} from "./models/ventilation-status";
import {MailService} from "../notifications/services/mailService";
import {MyNotification} from "../notifications/myNotification";
import {Logger} from "../common/logger/logger";
import {MongoDB} from "../common/mongo-db";

export class ThermospiDB {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('Thermospi');
    }

    saveTemperatures(temperatures: ITemperature[]) {
        MongoDB.domoticDB.then((db: Db) => {
            let batch = db.collection('temperatures').initializeUnorderedBulkOp();

            _.forEach(
                temperatures,
                (aTemperature) => {
                    batch.insert(aTemperature);
                }
            );

            batch.execute((err, result) => {
                if (err) {
                    this.logger.error(`Erreur lors de l'enregistrement de températures`, err.message);
                } else {
                    this.logger.info(temperatures.length + ' temperature(s) enregistrées.');
                    (db as any).close();
                }
            });
        });
    };

    getCurrentInsideTemperature(): Promise<number> {
        let probes = [2, 3];
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('temperatures').find(
                    {
                        probe: {$in: probes}
                    },
                    {
                        sort: [['date', 'desc']],
                        limit: probes.length
                    }
                ).toArray((err, results: ITemperature[]) => {
                    if (err) {
                        this.logger.error('Erreur lors de la lecture de la température intérieure de la maison', err.message);
                        reject(err);
                    } else {
                        resolve(_.mean(_.map(results, 'temperature')));
                    }
                    (db as any).close();
                });
            });
        });
    }

    getCurrentOutsideTemperature(): Promise<number> {
        let probes = [1];
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('temperatures').find(
                    {
                        probe: {$in: probes}
                    },
                    {
                        sort: [['date', 'desc']],
                        limit: probes.length
                    }
                ).toArray((err, results: ITemperature[]) => {
                    if (err) {
                        this.logger.error('Erreur lors de la lecture de la température extérieure de la maison', err.message);
                        reject(err);
                    } else {
                        resolve(_.mean(_.map(results, 'temperature')));
                    }
                    (db as any).close();
                });
            });
        });
    }

    isWindowsOpened(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then(
                (db: Db) => {
                    db.collection('ventilationStatus').findOne(
                        {},
                        {},
                        (err, result: IVentilationStatus) => {
                            if (err) {
                                this.logger.error('Erreur lors de la lecture de l\'état de ventilation de la maison', err.message);
                                reject(err);
                            } else {
                                resolve(result.isWindowOpened);
                            }
                            (db as any).close();
                        }
                    );
                },
                (err) => {
                    this.logger.error('Erreur lors de la récupération d\'une connexion MongoDB', err.message);
                }
            );
        });
    }

    setWindowsOpened(status: boolean): void {
        MongoDB.domoticDB.then((db: Db) => {
            db.collection('ventilationStatus').update(
                {},
                {
                    $set: {
                        "isWindowOpened": status
                    }
                },
                {},
                (err, result) => {
                    if (err) {
                        this.logger.error('Erreur lors de la mise à jour de l\'état de ventilation de la maison', err.message);
                    }
                    (db as any).close();
                }
            );
        });
    }
}