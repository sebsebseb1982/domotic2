import {Alert} from "./alert";
import {MongoDB} from "../../common/mongo-db";
import {Db} from "mongodb";
import {Logger} from "../../common/logger/logger";

export class DB {
    logger: Logger;

    constructor() {
        this.logger = new Logger('DB alerte Internet');
    }

    getAlerts(): Promise<Alert[]> {
        return new Promise((resolve, reject) => {
            MongoDB.domoticDB.then((db: Db) => {
                db.collection('alerts').find(
                    {},
                    {}
                ).toArray((err, alerts: Alert[]) => {
                    if (err) {
                        this.logger.error('Erreur lors de la lecture des alertes', err.message);
                        reject(err);
                    } else {
                        resolve(alerts);
                    }
                    (db as any).close();
                });
            });
        });
    }

    updateAlert(alert: Alert) {
        MongoDB.domoticDB.then((db: Db) => {
            db.collection('alerts').replaceOne(
                {_id: alert._id},
                alert,
                {},
                (err) => {
                    if (err) {
                        this.logger.error(`Erreur lors du remplacement de l'alerte "${alert.name}"`, err.message);
                    }
                    (db as any).close();
                }
            );
        });
    }
}