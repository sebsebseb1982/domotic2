import {MongoDB} from "../common/mongo-db";
import {Db} from "mongodb";
import {Logger} from "../common/logger/logger";
import {IPowerOutlet, PowerOutlet} from "./power-outlet";

export class PowerOutletDB {

    logger: Logger;

    constructor() {
        this.logger = new Logger('DB Prise 433 MHz');
    }

    getByCode(code: string): Promise<PowerOutlet> {
        return new Promise<PowerOutlet>((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('outlets').findOne(
                    {"code": code},
                    {},
                    (err, readPowerOutlet: IPowerOutlet) => {
                        if (err) {
                            this.logger.error(`Erreur lors de la récupération de la prise "${code}"`, `${err.name}<br/>${err.message}<br/>${err.stack}`);
                            reject(err);
                        } else {
                            this.logger.debug(`Prise "${readPowerOutlet.label}" récupérée`);
                            resolve(new PowerOutlet(readPowerOutlet));
                        }
                        (db as any).close();
                    }
                );
            });
        });
    }

    getAll(): Promise<PowerOutlet[]> {
        return new Promise<PowerOutlet[]>((resolve, reject) => {

        });
    }
}