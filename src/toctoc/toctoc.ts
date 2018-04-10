import {Configuration} from "../configuration/configuration";
import {NotifyMyAndroidNotifier} from "../notifications/services/notifyMyAndroid";
import {INotifier} from "../notifications/notifier";
import {SurveillanceStation} from "../synology/surveillanceStation";

let exec = require('child_process').exec;
let MongoClient = require('mongodb').MongoClient;

export class TocToc {
    configuration: Configuration;
    notifier: NotifyMyAndroidNotifier;
    surveillanceStation: SurveillanceStation;

    console() {
        this.configuration = new Configuration();
        this.notifier =  new NotifyMyAndroidNotifier('Toc Toc');
        this.surveillanceStation = new SurveillanceStation();
    }

    updatePresence() {
        this.getCurrentPresence().then((lastPresenceStatus: boolean) => {
            let child = exec(`${this.configuration.toctoc.scriptPath}toctoc.sh ${this.configuration.toctoc.mailAccount.address} ${this.configuration.toctoc.mailAccount.password}`);
            child.stdout.on('data', (data) => {
                console.log('stdout: ' + data);
            });
            child.stderr.on('data', (data) => {
                console.log('stdout: ' + data);
            });
            child.on('close', (code) => {
                let currentPresenceStatus = code == 1;
                console.log('Current presence status :', currentPresenceStatus);

                if (lastPresenceStatus != currentPresenceStatus) {
                    this.saveNewPresenceStatus(currentPresenceStatus);
                }
            });
        });
    }

    ifPresent(ifCallback, elseCallback) {
        this.execIf(true, ifCallback, elseCallback);
    }

    ifAbsent(ifCallback, elseCallback) {
        this.execIf(false, ifCallback, elseCallback);
    }

    private execIf(expectedPresenceStatus, ifCallback, elseCallback) {
        this.getCurrentPresence().then((currentPresenceStatus: boolean) => {
            if (currentPresenceStatus === expectedPresenceStatus) {
                ifCallback();
            } else if (elseCallback !== undefined) {
                elseCallback();
            } else {
                console.log('Can\'t execute anything !')
            }
        });
    }

    private saveNewPresenceStatus(presenceStatus: boolean) {

        this.surveillanceStation.setHomeMode(!presenceStatus);

        MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
            if (err) {
                this.notifier.notifyError('Erreur lors de la vérification de présence, on considère que la maison est fermée : ', err);
            } else {
                db.collection('presences').insertOne(
                    {
                        status: presenceStatus,
                        date: new Date()
                    },
                    (err2, result) => {
                        if (err2) {
                            this.notifier.notifyError('Erreur lors de la vérification de présence, on considère que la maison est fermée : ', err2);
                        } else {
                            console.log('Presence (status=' + presenceStatus + ') inserted.');
                            db.close();
                        }
                    }
                );
            }
        });
    }

    private getCurrentPresence(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                if (err) {
                    this.notifier.notifyError('Erreur lors de la vérification de présence, on considère que la maison est fermée : ', err);
                    resolve(false);
                } else {
                    db.collection('presences').findOne(
                        {},
                        {
                            sort: [['date', 'desc']]
                        },
                        (err2, result) => {
                            if (err2) {
                                this.notifier.notifyError('Erreur lors de la vérification de présence, on considère que la maison est fermée : ', err2);
                                resolve(false);
                            } else {
                                console.log('Maison', result.status ? 'ouverte' : 'fermée');
                                resolve(result.status);
                            }
                            db.close();
                        }
                    );
                }
            });
        });
    }
}