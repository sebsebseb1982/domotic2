import {Logger} from "../common/logger/logger";
import {DB} from "../relay/db";
import {lamps} from "../hue/hue-lamps";
import {HueLampManager} from "../hue/hueLampManager";
import {RealHeaterStateDB} from "./db/RealHeaterStateDB";
import {IHeaterState} from "./models/heater-status";

export class Heater {

    logger: Logger;
    relayDB: DB;
    realHeaterStateDB: RealHeaterStateDB;
    hue: HueLampManager;
    animationDuration: number = 4 * 1000 /* ms */;
    heaterRelayCode: string = 'k4';

    constructor() {
        this.logger = new Logger('Commande chauffage');
        this.relayDB = new DB();
        this.realHeaterStateDB = new RealHeaterStateDB();
        this.hue = new HueLampManager();
    }

    on() {
        this.setHeaterState(true);
    }

    off() {
        this.setHeaterState(false);
    }

    private setHeaterState(newHeaterState: boolean) {
        this.relayDB.getByCode(this.heaterRelayCode).then((relay) => {
            relay.setState(newHeaterState);
        });
        this.realHeaterStateDB.getCurrentHeaterRealStatus().then((lastHeaterState: IHeaterState) => {
            if (newHeaterState != lastHeaterState.value) {
                this.realHeaterStateDB.add(newHeaterState);
                if(newHeaterState) {
                    this.logger.info('Allumage du chauffage');
                    this.rampUpLight();
                } else {
                    this.logger.info('Extinction du chauffage');
                    this.rampDownLight();
                }
            }
        });
    }

    private rampUpLight() {
        this.hue.setState(lamps.salon, {
            "on": true,
            bri: 255,
            rgb: [255, 0, 0],
            transition: this.animationDuration
        });

        setTimeout(() => {
            this.hue.setState(lamps.salon, {
                "on": false,
                transition: 0
            });
        }, this.animationDuration + 1000);
    }

    private rampDownLight() {
        this.hue.setState(lamps.salon, {
            "on": true,
            bri: 255,
            rgb: [255, 0, 0],
            transition: 0
        });

        setTimeout(() => {
            this.hue.setState(lamps.salon, {
                "on": false,
                transition: this.animationDuration
            });
        }, 1000);
    }
}