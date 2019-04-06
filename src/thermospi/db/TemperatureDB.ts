import {ITemperature} from "../models/temperature";
import {Configuration} from "../../configuration/configuration";
import * as _ from "lodash";
import {Db} from "mongodb";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";
import {SensorDB} from "../../sensors/db/sensor-db";
import {ISensor, SensorTag} from "../../sensors/sensor";

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
                    this.logger.debug(`Enregistrement de la température ${aTemperature.value} lue sur la sonde ${aTemperature.sensorId}`)
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
        return this.getCurrentTemperaturesBySensorTags(['maison']);
    }

    getCurrentOutsideTemperature(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getCurrentTemperaturesBySensorTags(['exterieur']).then((temperatures: number[]) => {
                resolve(temperatures[0]);
            });
        });
    }

    getCurrentTemperaturesBySensorTags(sensorTags: SensorTag[]): Promise<number[]> {
        return new Promise((resolve, reject) => {
            SensorDB.instance.getByTags(sensorTags).then((sensors: ISensor[]) => {
                MongoDB.domoticDB.then((db: Db) => {
                    db.collection('temperatures').find(
                        {
                            sensorId: {$in: _.map(sensors, 'id')}
                        },
                        {
                            sort: [['date', 'desc']],
                            limit: sensors.length
                        }
                    ).toArray((err, results: ITemperature[]) => {

                        this.logger.debug(JSON.stringify(results, undefined, 2));

                        if (err) {
                            this.logger.error(`Erreur lors de la lecture de la température "${sensorTags}"`, err.message);
                            reject(err);
                        } else {
                            resolve(_.map(results, 'value'));
                        }
                        (db as any).close();
                    });
                });
            });
        });
    }
}