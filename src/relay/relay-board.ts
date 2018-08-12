import {DB} from "./db";
import {Relay} from "./relay";
import {exec} from "child_process";
import * as _ from "lodash";
import {Logger} from "../common/logger/logger";

export class RelayBoard {
    private static logger: Logger = new Logger('Carte relais');

    static initialize() {
        this.logger.info('Initialisation de la carte relais');
        let db = new DB();
        db.getAll().then((relays: Relay[]) => {
            _.forEach(relays, (relay) => {
                this.executeScript(`sudo gpio mode ${relay.gpio} out`);
                this.executeScript(`sudo gpio write ${relay.gpio} 0`);
            });
        });
    }

    static executeScript(script: string) {
        exec(script, (error, stdout, stderr) => {
            this.logger.debug(stdout);
            this.logger.error(error.message, stderr);
        });
    };
}