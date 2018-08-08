import {Configuration} from "../configuration/configuration";
import {Db, InsertOneWriteOpResult} from "mongodb";
import {ITorrent} from "./models/torrent";
import {MailService} from "../notifications/services/mailService";

let MongoClient = require('mongodb').MongoClient;

export class TorrentDB {
    configuration: Configuration;
    notifier: MailService;


    constructor() {
        this.configuration = new Configuration();
        this.notifier = new MailService('Torrent API');
    }

    private get db(): Promise<Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.thermospi.mongoURL, (err, db) => {
                if (err) {
                    this.notifier.send({
                        title: 'Erreur lors de la récupération d\'une connexion à la base Torrent',
                        description: err
                    });
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
                    {},
                    {
                        sort: [['date', 'desc']],
                        limit: limit
                    }
                ).toArray((err, results: ITorrent[]) => {
                    console.log(results);
                    if (err) {
                        this.notifier.send({
                            title: `Erreur lors de la lecture de la récupération des ${limit} derniers torrents`,
                            description: err.message
                        });
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
                            this.notifier.send({
                                title: `Erreur lors de l'insertion d'un torrent (${torrent.url})`,
                                description: err.message
                            });
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