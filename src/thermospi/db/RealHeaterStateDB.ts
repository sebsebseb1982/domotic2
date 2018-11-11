import {ITemperature} from "../models/temperature";
import {Configuration} from "../../configuration/configuration";
import * as _ from "lodash";
import {Db} from "mongodb";
import {IVentilationStatus} from "../models/ventilation-status";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";
import {ISetPoint} from "../models/setpoint";
import {IHeaterState} from "../models/heater-status";

export class RealHeaterStateDB {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(RealHeaterStateDB.name);
    };

    getCurrentHeaterRealStatus(): Promise<IHeaterState> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('realStatus').find(
                    {},
                    {
                        sort: [['date', 'desc']],
                        limit: 1
                    }
                ).toArray((err, results: IHeaterState[]) => {
                    if (err) {
                        this.logger.error('Erreur lors de la récupération du dernier état réel du chauffage', err.message);
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                    (db as any).close();
                });
            });
        });
    };

    add(status: boolean): Promise<number> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('realStatus').insertOne(
                    {
                        value: status,
                        date: new Date()
                    },
                    {},
                    (err, b) => {
                        if (err) {
                            this.logger.error(`Erreur lors de l'ajout d'un nouvel état réel du chauffage "${status}"`, err.message);
                            reject(err);
                        } else {
                            this.logger.info(`Insertion d'un nouvel état réel du chauffage "${status}"`);
                            resolve(b.result.n);
                        }
                        (db as any).close();
                    }
                );
            });
        });
    };
}