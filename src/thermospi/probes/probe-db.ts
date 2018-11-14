import {Logger} from "../../common/logger/logger";
import {MongoDB} from "../../common/mongo-db";
import {Db} from "mongodb";
import * as _ from "lodash";
import {IProbe, Probe} from "./probe";


export class ProbeDB {

    logger: Logger;
    static db: ProbeDB;
    allProbes: Promise<Probe[]>;

    private constructor() {
        this.logger = new Logger('BDD Sondes de température');
    }

    static get instance(): ProbeDB {
        if (!ProbeDB.db) {
            ProbeDB.db = new ProbeDB();
        }

        return ProbeDB.db;
    }


    getProbesBySite(site: number): Promise<Probe[]> {
        return new Promise<Probe[]>((resolve, reject) => {
            this.getAllProbes().then((probes) => {
                resolve(_.filter(probes, {site: site}));
            });
        });
    }

    getAllProbes(): Promise<Probe[]> {
        if (!this.allProbes) {
            this.logger.debug('Chargement initial de la liste des sondes de températures');
            this.allProbes = new Promise<Probe[]>((resolve, reject) => {
                MongoDB.domoticDB.then((db: Db) => {
                    db.collection('sensors').find(
                        {},
                        {}
                    ).toArray((err, results: IProbe[]) => {
                        if (err) {
                            this.logger.error('Erreur lors de la récupération des sondes de températures', err.message);
                            reject(err);
                        } else {
                            resolve(_.map(results, (aResult) => new Probe(aResult)));
                        }
                        (db as any).close();
                    });
                });
            });
        }

        return this.allProbes;
    }
}