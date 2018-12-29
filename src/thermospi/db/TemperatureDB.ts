import {ITemperature} from "../models/temperature";
import {Configuration} from "../../configuration/configuration";
import * as _ from "lodash";
import {Db} from "mongodb";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";

export class TemperatureDB {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(TemperatureDB.name);
    };

    saveTemperatures(temperatures: ITemperature[]) {
        MongoDB.domoticDB.then((db: Db) => {
            let batch = db.collection('temperatures').initializeUnorderedBulkOp();

            _.forEach(
                temperatures,
                (aTemperature) => {
                    this.logger.debug(`Enregistrement de la température ${aTemperature.value} lue sur la sonde ${aTemperature.probe}`)
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
        return new Promise((resolve, reject) => {
            this.getCurrentInsideTemperatures().then((insideTemperatures: number[]) => {
                resolve(_.mean(insideTemperatures));
            });
        });
    }

    getCurrentInsideTemperatures(): Promise<number[]> {
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
                        resolve(_.map(results, 'value'));
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
                    //this.logger.debug(JSON.stringify(results));
                    if (err) {
                        this.logger.error('Erreur lors de la lecture de la température extérieure de la maison', err.message);
                        reject(err);
                    } else {
                        resolve(_.mean(_.map(results, 'value')));
                    }
                    (db as any).close();
                });
            });
        });
    }
}