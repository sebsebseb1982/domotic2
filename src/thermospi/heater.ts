import {Logger} from "../common/logger/logger";
import {RealHeaterStateDB} from "./db/RealHeaterStateDB";
import {IHeaterState} from "./models/heater-status";
import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {RelayDB} from "../relay/relay-db";
import {HueLamp} from "../hue/hue-lamp";

export class Heater {

    logger: Logger;
    realHeaterStateDB: RealHeaterStateDB;
    googleHomeService: GoogleHomeService;
    lampSalon: HueLamp;

    animationDuration: number = 4 * 1000 /* ms */;
    heaterRelayCode: string = 'k4';

    constructor() {
        this.logger = new Logger('Commande chauffage');
        this.realHeaterStateDB = new RealHeaterStateDB();
        this.googleHomeService = new GoogleHomeService();
        this.lampSalon = new HueLamp('salon');
    }

    on() {
        this.setHeaterState(true);
    }

    off() {
        this.setHeaterState(false);
    }

    private setHeaterState(newHeaterState: boolean) {
        RelayDB.instance.getByCode(this.heaterRelayCode).then((relay) => {
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
        this.lampSalon.setState({
            "on": true,
            bri: 255,
            rgb: [255, 0, 0],
            transition: this.animationDuration
        });

        setTimeout(() => {
            this.lampSalon.off();
        }, this.animationDuration + 1000);
    }

    private rampDownLight() {
        this.lampSalon.setState({
            "on": true,
            bri: 255,
            rgb: [255, 0, 0],
            transition: 0
        });

        setTimeout(() => {
            this.lampSalon.setState({
                "on": false,
                transition: this.animationDuration
            });
        }, 1000);
    }
}