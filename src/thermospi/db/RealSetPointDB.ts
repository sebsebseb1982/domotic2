import {Configuration} from "../../configuration/configuration";
import {Db} from "mongodb";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";
import {ISetPoint} from "../models/setpoint";

export class RealSetPointDB {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(RealSetPointDB.name);
    };

    getCurrentRealSetPoint(): Promise<ISetPoint> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('realSetPoints').find(
                    {},
                    {
                        sort: [['date', 'desc']],
                        limit: 1
                    }
                ).toArray((err, results: ISetPoint[]) => {
                    if (err) {
                        this.logger.error('Erreur lors de la récupération de la dernière consigne de chauffage réelle', err.message);
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                    (db as any).close();
                });
            });
        });
    };

    add(value: number): Promise<number> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('realSetPoints').insertOne(
                    {
                        value: value,
                        date: new Date()
                    },
                    {},
                    (err, b) => {
                        if (err) {
                            this.logger.error(`Erreur lors de l'ajout de la consigne de chauffage réelle ${value}°C`, err.message);
                            reject(err);
                        } else {
                            this.logger.info(`La consigne de chauffage réelle est définie à ${value}°C`);
                            resolve(b.result.n);
                        }
                        (db as any).close();
                    }
                );
            });
        });
    };
}