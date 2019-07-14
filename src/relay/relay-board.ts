import {Relay} from "./relay";
import * as _ from "lodash";
import {Logger} from "../common/logger/logger";
import {RelayDB} from "./relay-db";
import {GPIO} from "../gpio/gpio";

let exec = require('child_process').execSync;

export class RelayBoard {
    private static logger: Logger = new Logger('Carte relais');

    static initialize() {
        this.logger.info('Initialisation de la carte relais');
        RelayDB.instance.getAll().then((relays: Relay[]) => {
            _.forEach(relays, (relay) => {
                relay.gpio.setState(false);
            });
        });
    }
}