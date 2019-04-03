import {Logger} from "../../common/logger/logger";
import * as _ from "lodash";
import {MongoDB} from "../../common/mongo-db";
import {Db} from "mongodb";
import {SensorLocation, ISensor, SensorType} from "../sensor";

export class SensorDB {
    logger: Logger;
    static db: SensorDB;
    sensors: Promise<ISensor[]>;

    private constructor() {
        this.logger = new Logger('BDD capteurs');
    }

    static get instance(): SensorDB {
        if(!SensorDB.db) {
            SensorDB.db = new SensorDB();
        }

        return SensorDB.db;
    }

    /*getByCode(code: string): Promise<ISensor> {
        return new Promise<Relay>((resolve, reject) => {
            this.getAll().then((sensors) => {
                resolve(_.find(sensors, { 'id': code }));
            });
        });
    }*/

    getById(id: string): Promise<ISensor> {
        return new Promise<ISensor>((resolve, reject) => {
            this.getAll().then((sensors) => {
                resolve(_.filter(sensors, {
                   id:id
                })[0]);
            });
        });
    }

    getByTypeAndLocation(type: SensorType, location: SensorLocation): Promise<ISensor[]> {
        return new Promise<ISensor[]>((resolve, reject) => {
            this.getAll().then((sensors) => {
                resolve(_.filter(sensors, {
                    type: type,
                    location: location
                }));
            });
        });
    }

    getByLocation(location: SensorLocation): Promise<ISensor[]> {
        return new Promise<ISensor[]>((resolve, reject) => {
            this.getAll().then((sensors) => {
                resolve(_.filter(sensors, {
                    location: location
                }));
            });
        });
    }

    getAll(): Promise<ISensor[]> {
        if(!this.sensors) {
            this.logger.debug('Chargement initial de la liste des capteurs');
            this.sensors = new Promise<ISensor[]>((resolve, reject) => {
                MongoDB.domoticDB.then((db: Db) => {
                    db.collection('sensors').find(
                        {},
                        {}
                    ).toArray((err, results: ISensor[]) => {
                        if (err) {
                            this.logger.error('Erreur lors de la récupération des capteurs', err.message);
                            reject(err);
                        } else {
                            resolve(results);
                        }
                        (db as any).close();
                    });
                });
            });
        }

        return this.sensors;
    }
}