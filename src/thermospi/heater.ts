import {Logger} from "../common/logger/logger";
import {lamps} from "../hue/hue-lamps";
import {HueLampManager} from "../hue/hueLampManager";
import {RealHeaterStateDB} from "./db/RealHeaterStateDB";
import {IHeaterState} from "./models/heater-status";
import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {RelayDB} from "../relay/relay-db";

export class Heater {

    logger: Logger;
    relayDB: RelayDB;
    realHeaterStateDB: RealHeaterStateDB;
    hue: HueLampManager;
    googleHomeService: GoogleHomeService;

    animationDuration: number = 4 * 1000 /* ms */;
    heaterRelayCode: string = 'k4';

    constructor() {
        this.logger = new Logger('Commande chauffage');
        this.relayDB = new RelayDB();
        this.realHeaterStateDB = new RealHeaterStateDB();
        this.hue = new HueLampManager();
        this.googleHomeService = new GoogleHomeService();
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
                let message;
                if(newHeaterState) {
                    message = 'Allumage du chauffage';
                    this.rampUpLight();
                } else {
                    message = 'Extinction du chauffage';
                    this.rampDownLight();
                }
                this.logger.info(message);
                this.googleHomeService.say(message);
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