import {ITemperature} from "./models/temperature";
import {Configuration} from "../configuration/configuration";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";
import * as _ from "lodash";
import {Db} from "mongodb";
import {IVentilationStatus} from "./models/ventilation-status";

let MongoClient = require('mongodb').MongoClient;

export class ThermospiDB {
    configuration: Configuration;
    notifier: NotifyMyAndroidNotifierService;


    constructor() {
        this.configuration = new Configuration();
        this.notifier =  new NotifyMyAndroidNotifierService('DB Thermospi');
    }

    private get db(): Promise<Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                if (err) {
                    this.notifier.notifyError('Erreur lors de la récupération d\'une connexion à la base Thermospi', err);
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
    }

    getCurrentInsideTemperature(): Promise<number> {
        let probes = [2,3];
        return new Promise((resolve, reject) => {
            this.db.then((db: Db) => {
                db.collection('temperatures').find(
                    {
                        probe:{$in: probes}
                    },
                    {
                        sort: [['date','desc']],
                        limit: probes.length
                    }
                ).toArray((err, results:ITemperature[]) => {
                    if (err) {
                        this.notifier.notifyError('Erreur lors de la lecture de la température intérieure de la maison', err.message);
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
            this.db.then((db: Db) => {
                db.collection('temperatures').find(
                    {
                        probe:{$in: probes}
                    },
                    {
                        sort: [['date','desc']],
                        limit: probes.length
                    }
                ).toArray((err, results:ITemperature[]) => {
                    if (err) {
                        this.notifier.notifyError('Erreur lors de la lecture de la température extérieure de la maison', err.message);
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
            this.db.then((db: Db) => {
                db.collection('ventilationStatus').findOne(
                    {},
                    {},
                    (err, result:IVentilationStatus) => {
                        if (err) {
                            this.notifier.notifyError('Erreur lors de la lecture de l\'état de ventilation de la maison', err.message);
                            reject(err);
                        } else {
                            resolve(result.isWindowOpened);
                        }
                        (db as any).close();
                    }
                );
            });
        });
    }

    setWindowsOpened(status: boolean): void {
        this.db.then((db: Db) => {
            db.collection('ventilationStatus').update(
                {},
                {
                    $set : {
                        "isWindowOpened": status
                    }
                },
                {},
                (err, result) => {
                    this.notifier.notifyError('Erreur lors de la mise à jour de l\'état de ventilation de la maison', err.message);
                }
            );
        });
    }
}