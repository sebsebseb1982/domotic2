import {IRelay} from "./relayType";
import {MongoDB} from "../common/mongo-db";
import {Db} from "mongodb";
import {Logger} from "../common/logger/logger";
import {Relay} from "./relay";

export class DB {

    logger: Logger;

    constructor() {
        this.logger = new Logger('DB Relay');
    }

    getByCode(code: string): Promise<Relay> {
        return new Promise<Relay>((resolve, reject) => {
            MongoDB.db.then((db: Db) => {
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

        });
    }
}