import {ITemperature} from "./temperature";
import {Configuration} from "../configuration/configuration";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";
import * as _ from "lodash";

let MongoClient = require('mongodb').MongoClient;

export class ThermospiDB {
    configuration: Configuration;
    notifier: NotifyMyAndroidNotifierService;

    constructor() {
        this.configuration = new Configuration();
        this.notifier =  new NotifyMyAndroidNotifierService('DB Thermospi');
    }

    get currentInsideTemperature():Promise<number> {
        let probes = [2,3];
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                let error = 'Erreur lors de la lecture de la température intérieure de la maison : ';
                if (err) {
                    this.notifier.notifyError(error, err);
                    reject(err);
                } else {
                    db.collection('temperatures').find(
                        {
                            probe:{$in: probes}
                        },
                        {
                            sort: [['date','desc']],
                            limit: probes.length
                        }
                    ).toArray((err2, results:ITemperature[]) => {
                        if (err2) {
                            this.notifier.notifyError(error, err2);
                            reject(err2);
                        } else {
                            resolve(_.mean(_.map(results, 'temperature')));
                        }
                        db.close();
                    });
                }
            });
        });
    }

    get currentOutsideTemperature():Promise<number> {
        let probes = [1];
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                let error = 'Erreur lors de la lecture de la température intérieure de la maison : ';
                if (err) {
                    this.notifier.notifyError(error, err);
                    reject(err);
                } else {
                    db.collection('temperatures').find(
                        {
                            probe:{$in: probes}
                        },
                        {
                            sort: [['date','desc']],
                            limit: probes.length
                        }
                    ).toArray((err2, results:ITemperature[]) => {
                        if (err2) {
                            this.notifier.notifyError(error, err2);
                            reject(err2);
                        } else {
                            resolve(_.mean(_.map(results, 'temperature')));
                        }
                        db.close();
                    });
                }
            });
        });
    }
}