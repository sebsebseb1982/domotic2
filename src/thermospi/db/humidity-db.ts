import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";
import {Db} from "mongodb";
import * as _ from "lodash";
import {IHumidity} from "../models/humidity";

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
}