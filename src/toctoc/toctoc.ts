import {Configuration} from "../configuration/configuration";
import {SurveillanceStation} from "../synology/surveillanceStation";
import {ThermospiDB} from "../thermospi/db";
import {MailService} from "../notifications/services/mailService";

let exec = require('child_process').exec;
let MongoClient = require('mongodb').MongoClient;

export class TocToc {
    configuration: Configuration;
    notifier: MailService;
    surveillanceStation: SurveillanceStation;
    thermospiDB: ThermospiDB;

    constructor() {
        this.configuration = new Configuration();
        this.notifier = new MailService('Toc Toc');
        this.surveillanceStation = new SurveillanceStation();
        this.thermospiDB = new ThermospiDB();
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
                console.log('Current presence getStatus :', currentPresenceStatus);

                if (lastPresenceStatus != currentPresenceStatus) {
                    this.saveNewPresenceStatus(currentPresenceStatus);
                }
            });
        });
    }

    ifPresent(ifCallback, elseCallback?) {
        this.execIf(true, ifCallback, elseCallback);
    }

    ifAbsent(ifCallback, elseCallback?) {
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
        if (!presenceStatus) {
            this.thermospiDB.setWindowsOpened(false);
        }

        MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
            if (err) {
                this.notifier.send({
                    title: 'Erreur lors de la vérification de présence, on considère que la maison est fermée',
                    description: err
                });
            } else {
                db.collection('presences').insertOne(
                    {
                        status: presenceStatus,
                        date: new Date()
                    },
                    (err, result) => {
                        if (err) {
                            this.notifier.send({
                                title: 'Erreur lors de la vérification de présence, on considère que la maison est fermée',
                                description: err
                            });
                        } else {
                            console.log('Presence (getStatus=' + presenceStatus + ') inserted.');
                            db.close();
                        }
                    }
                );
            }
        });
    }

    getCurrentPresence(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                if (err) {
                    this.notifier.send({
                        title: 'Erreur lors de la vérification de présence, on considère que la maison est fermée',
                        description: err
                    });
                    resolve(false);
                } else {
                    db.collection('presences').findOne(
                        {},
                        {
                            sort: [['date', 'desc']]
                        },
                        (err, result) => {
                            if (err) {
                                this.notifier.send({
                                    title: 'Erreur lors de la vérification de présence, on considère que la maison est fermée',
                                    description: err
                                });
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