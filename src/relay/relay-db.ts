import {IRelay} from "./relayType";
import {MongoDB} from "../common/mongo-db";
import {Db} from "mongodb";
import {Logger} from "../common/logger/logger";
import {Relay} from "./relay";
import * as _ from "lodash";

export class RelayDB {

    logger: Logger;

    constructor() {
        this.logger = new Logger('DB Relay');
    }

    getByCode(code: string): Promise<Relay> {
        return new Promise<Relay>((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('relays').findOne(
                    {"code": code},
                    {},
                    (err, readRelay: IRelay) => {
                        if (err) {
                            this.logger.error(`Erreur lors de la récupération du relais ${code}`, `${err.name}<br/>${err.message}<br/>${err.stack}`);
                            reject(err);
                        } else {
                            this.logger.debug(`Relais "${readRelay.label}" récupéré`);
                            resolve(new Relay(readRelay));
                        }
                        (db as any).close();
                    }
                );
            });
        });
    }

    getAll(): Promise<Relay[]> {
        return new Promise<Relay[]>((resolve, reject) => {
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
}