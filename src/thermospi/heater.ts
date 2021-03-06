import {Logger} from "../common/logger/logger";
import {RealHeaterStateDB} from "./db/RealHeaterStateDB";
import {IHeaterState} from "./models/heater-status";
import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {RelayDB} from "../relay/relay-db";
import {HueLamp} from "../hue/hue-lamp";
import {VirtualService} from "../jeedom/VirtualService";

export class Heater {

    logger: Logger;
    realHeaterStateDB: RealHeaterStateDB;
    googleHomeService: GoogleHomeService;
    lampSalon: HueLamp;
    virtualService: VirtualService;

    animationDuration: number = 4 * 1000 /* ms */;
    heaterRelayCode: string = 'k4';

    constructor() {
        let service = 'Commande chauffage';
        this.logger = new Logger(service);
        this.realHeaterStateDB = new RealHeaterStateDB();
        this.googleHomeService = new GoogleHomeService();
        this.lampSalon = new HueLamp('salon', service);
        this.virtualService = new VirtualService();
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
                if (newHeaterState) {
                    message = 'Allumage du chauffage';
                    this.rampUpLight();
                    this.virtualService.updateVirtual(
                        {
                            id: 288,
                            name: "Chaudière"
                        },
                        true
                    );
                } else {
                    message = 'Extinction du chauffage';
                    this.rampDownLight();
                    this.virtualService.updateVirtual(
                        {
                            id: 288,
                            name: "Chaudière"
                        },
                        false
                    );
                }
                this.logger.info(message);
                //this.googleHomeService.say(message, true);
            }
        });
    }

    private rampUpLight() {
        this.lampSalon.setState({
            "on": true,
            bri: 254,
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
            bri: 254,
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