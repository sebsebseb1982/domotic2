import {ITemperature} from "./temperature";
import {Configuration} from "../configuration/configuration";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";

let MongoClient = require('mongodb').MongoClient;

export class ThermospiDB {
    configuration: Configuration;
    notifier: NotifyMyAndroidNotifierService;

    constructor() {
        this.configuration = new Configuration();
        this.notifier =  new NotifyMyAndroidNotifierService('DB Thermospi');
    }

    get currentInsideTemperature():Promise<number> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                let error = 'Erreur lors de la lecture de la température intérieure de la maison : ';
                if (err) {
                    this.notifier.notifyError(error, err);
                    reject(err);
                } else {
                    db.collection('temperatures').find(
                        {
                            "probe":{$in:[2,3]}
                        },
                        {
                            sort: [['date','desc']],
                            limit: 2
                        }
                    ).toArray((err2, result) => {
                        if (err2) {
                            this.notifier.notifyError(error, err2);
                            resolve(err2);
                        } else {
                            console.log('result:', result);
                            resolve(result);
                        }
                        db.close();
                    });
                }
            });
        });
    }
}