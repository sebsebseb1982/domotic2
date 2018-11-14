import {Relay} from "./relay";
import * as _ from "lodash";
import {Logger} from "../common/logger/logger";
import {RelayDB} from "./relay-db";

let exec = require('child_process').execSync;

export class RelayBoard {
    private static logger: Logger = new Logger('Carte relais');

    static initialize() {
        this.logger.info('Initialisation de la carte relais');
        RelayDB.instance.getAll().then((relays: Relay[]) => {
            _.forEach(relays, (relay) => {
                this.executeCommand(`sudo gpio mode ${relay.gpio} out`);
                this.executeCommand(`sudo gpio write ${relay.gpio} 0`);
            });
        });
    }

    static executeCommand(command: string) {
        this.logger.debug(command);
        exec(command, (error, stdout, stderr) => {
            this.logger.debug(stdout);
            if(error) {
                this.logger.error(error.message, stderr);
            }
        });
    };
}