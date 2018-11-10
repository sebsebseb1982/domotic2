import {Db} from "mongodb";
import {Configuration} from "../configuration/configuration";
import {Logger} from "./logger/logger";

let MongoClient = require('mongodb').MongoClient;

export class MongoDB {

    private static configuration: Configuration = new Configuration();
    private static logger: Logger = new Logger('MongoDB');

    static get domoticDB(): Promise<Db> {
        return this.getDB(this.configuration.thermospi.mongoURL);
    }

    static get lbcDB(): Promise<Db> {
        return this.getDB(this.configuration.lbc.mongoURL);
    }

    private static getDB(connectionURL:string) {
        return new Promise<Db>((resolve, reject) => {
            MongoClient.connect(
                connectionURL,
                (err, db) => {
                    if (err) {
                        this.logger.error('Erreur lors de la récupération d\'une connexion MongoDB', err);
                        reject(err);
                    } else {
                        resolve(db);
                    }
                });
        });
    }
}