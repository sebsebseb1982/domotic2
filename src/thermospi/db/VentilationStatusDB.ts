import {Configuration} from "../../configuration/configuration";
import {Db} from "mongodb";
import {IVentilationStatus} from "../models/ventilation-status";
import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";

export class VentilationStatusDB {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger(VentilationStatusDB.name);
    };

    isWindowsOpened(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then(
                (db: Db) => {
                    db.collection('ventilationStatus').findOne(
                        {},
                        {},
                        (err, result: IVentilationStatus) => {
                            if (err) {
                                this.logger.error('Erreur lors de la lecture de l\'état de ventilation de la maison', err.message);
                                reject(err);
                            } else {
                                resolve(result.isWindowOpened);
                            }
                            (db as any).close();
                        }
                    );
                },
                (err) => {
                    this.logger.error('Erreur lors de la récupération d\'une connexion MongoDB', err.message);
                }
            );
        });
    }

    setWindowsOpened(status: boolean): void {
        MongoDB.domoticDB.then((db: Db) => {
            db.collection('ventilationStatus').update(
                {},
                {
                    $set: {
                        "isWindowOpened": status
                    }
                },
                {},
                (err, result) => {
                    if (err) {
                        this.logger.error('Erreur lors de la mise à jour de l\'état de ventilation de la maison', err.message);
                    }
                    (db as any).close();
                }
            );
        });
    }
}