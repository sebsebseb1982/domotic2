import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";
import {Db} from "mongodb";
import * as _ from "lodash";
import {IHumidity} from "../models/humidity";
import {ISensor, SensorTag} from "../../sensors/sensor";
import {SensorDB} from "../../sensors/db/sensor-db";
import {ITemperature} from "../models/temperature";

export class HumidityDB {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(HumidityDB.name);
    };

    saveMeasures(humidityMeasures: IHumidity[]) {
        MongoDB.domoticDB.then((db: Db) => {
            let batch = db.collection('humidityMeasures').initializeUnorderedBulkOp();

            _.forEach(
                humidityMeasures,
                (aHumidityMeasure) => {
                    this.logger.debug(`Enregistrement de la mesure d'humidité ${aHumidityMeasure.value}% lue sur la sonde ${aHumidityMeasure.sensorId}`)
                    batch.insert(aHumidityMeasure);
                }
            );

            batch.execute((err, result) => {
                if (err) {
                    this.logger.error(`Erreur lors de l'enregistrement de la mesure d'humidité`, err.message);
                } else {
                    this.logger.info(`${humidityMeasures.length} mesure(s) d'humidité enregistrées.`);
                    (db as any).close();
                }
            });
        });
    };

    getCurrentHumidityValueBySensorTags(sensorTags: SensorTag[]): Promise<IHumidity[]> {
        return new Promise((resolve, reject) => {
            SensorDB.instance.getByTags(sensorTags).then((sensors: ISensor[]) => {
                MongoDB.domoticDB.then((db: Db) => {
                    db.collection('humidityMeasures').find(
                        {
                            sensorId: {$in: _.map(sensors, 'id')}
                        },
                        {
                            sort: [['date', 'desc']],
                            limit: sensors.length
                        }
                    ).toArray((err, results: IHumidity[]) => {

                        this.logger.debug(JSON.stringify(results, undefined, 2));

                        if (err) {
                            this.logger.error(`Erreur lors de la lecture de la température "${sensorTags}"`, err.message);
                            reject(err);
                        } else {
                            resolve(results);
                        }
                        (db as any).close();
                    });
                });
            });
        });
    }
}