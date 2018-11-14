import {IRelay} from "./relayType";
import {MongoDB} from "../common/mongo-db";
import {Db} from "mongodb";
import {Logger} from "../common/logger/logger";
import {Relay} from "./relay";
import * as _ from "lodash";

export class RelayDB {

    logger: Logger;
    static db: RelayDB;
    relays: Promise<Relay[]>;

    private constructor() {
        this.logger = new Logger('BDD relais');
    }

    static get instance(): RelayDB {
        if(!RelayDB.db) {
            RelayDB.db = new RelayDB();
        }

        return RelayDB.db;
    }

    getByCode(code: string): Promise<Relay> {
        return new Promise<Relay>((resolve, reject) => {
            this.getAll().then((relays) => {
                resolve(_.find(relays, { 'code': code }));
            });
        });
    }

    getAll(): Promise<Relay[]> {
        if(!this.relays) {
            this.logger.debug('Chargement initial de la liste des relais');
            this.relays = new Promise<Relay[]>((resolve, reject) => {
                MongoDB.domoticDB.then((db: Db) => {
                    db.collection('relays').find(
                        {},
                        {}
                    ).toArray((err, results: IRelay[]) => {
                        if (err) {
                            this.logger.error('Erreur lors de la récupération des relais', err.message);
                            reject(err);
                        } else {
                            resolve(_.map(results, (aResult) => new Relay(aResult)));
                        }
                        (db as any).close();
                    });
                });
            });
        }

        return this.relays;
    }
}