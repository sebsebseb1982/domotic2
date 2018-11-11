import {Configuration} from "../../configuration/configuration";
import {Db} from "mongodb";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";
import {ISetPoint} from "../models/setpoint";

export class SetPointDB {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(SetPointDB.name);
    };

    getCurrentSetPoint(): Promise<ISetPoint> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('setPoints').find(
                    {},
                    {
                        sort: [['date', 'desc']],
                        limit: 1
                    }
                ).toArray((err, results: ISetPoint[]) => {
                    if (err) {
                        this.logger.error('Erreur lors de la récupération de la dernière consigne de chauffage', err.message);
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                    (db as any).close();
                });
            });
        });
    };

    addSetPoint(value: number): Promise<number> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('setPoints').insertOne(
                    {
                        value: value,
                        date: new Date()
                    },
                    {},
                    (err, b) => {
                        if (err) {
                            this.logger.error(`Erreur lors de l'ajout de la consigne de chauffage ${value}°C`, err.message);
                            reject(err);
                        } else {
                            this.logger.info(`La consigne de chauffage est définie à ${value}°C`);
                            resolve(b.result.n);
                        }
                        (db as any).close();
                    }
                );
            });
        });
    };

    increment(delta: number): Promise<ISetPoint> {
        return new Promise((resolve) => {
            this.getCurrentSetPoint().then((currentSetPoint: ISetPoint) => {
                this.addSetPoint(currentSetPoint.value + delta).then(() => {
                    resolve(this.getCurrentSetPoint());
                });
            });
        });
    };
}