import {Db} from "mongodb";
import {Configuration} from "../configuration/configuration";
import {Logger} from "./logger/logger";

let MongoClient = require('mongodb').MongoClient;

export class MongoDB {

    private static configuration: Configuration = new Configuration();
    private static logger: Logger = new Logger('MongoDB');

    static get db(): Promise<Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(
                this.configuration.thermospi.mongoURL,
                (err, db) => {
                    if (err) {
                        this.logger.error('Erreur lors de la récupération d\'une connexion à la DB Thermospi', err);
                        reject(err);
                    } else {
                        resolve(db);
                    }
                });
        });
    }
}