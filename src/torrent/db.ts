import {Configuration} from "../configuration/configuration";
import {NotifyMyAndroidNotifierService} from "../notifications/services/notifyMyAndroidService";
import {Db, InsertOneWriteOpResult} from "mongodb";
import {ITorrent} from "./models/torrent";

let MongoClient = require('mongodb').MongoClient;

export class TorrentDB {
    configuration: Configuration;
    notifier: NotifyMyAndroidNotifierService;


    constructor() {
        this.configuration = new Configuration();
        this.notifier = new NotifyMyAndroidNotifierService('Torrent API');
    }

    private get db(): Promise<Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                if (err) {
                    this.notifier.notifyError('Erreur lors de la récupération d\'une connexion à la base Torrent', err);
                    reject(err);
                } else {
                    resolve(db);
                }
            });
        });
    }

    getLastTorrents(): Promise<ITorrent[]> {
        let limit = 20;
        return new Promise((resolve, reject) => {
            this.db.then((db: Db) => {
                db.collection('torrents').find(
                    {
                        sort: [['date', 'desc']],
                        limit: limit
                    }
                ).toArray((err, results: ITorrent[]) => {
                    console.log(results);
                    if (err) {
                        this.notifier.notifyError(`Erreur lors de la lecture de la récupération des ${limit} derniers torrents`, err.message);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                    (db as any).close();
                });
            });
        });
    }

    addTorrent(torrent: ITorrent): Promise<InsertOneWriteOpResult> {
        return new Promise((resolve, reject) => {
            this.db.then((db: Db) => {
                db.collection('torrents').insertOne(
                    torrent,
                    (err, result: InsertOneWriteOpResult) => {
                        if (err) {
                            this.notifier.notifyError(`Erreur lors de l'insertion d'un torrent (${torrent.url})`, err.message);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                        (db as any).close();
                    }
                );
            });
        });
    }
}