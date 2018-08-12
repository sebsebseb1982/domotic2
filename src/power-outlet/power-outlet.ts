import {RFXcom} from "../rfxcom/RFXcom";
import {Logger} from "../common/logger/logger";

let rfxcom = require('rfxcom');

export interface IPowerOutlet {
    code: string;
    label: string;
}

export class PowerOutlet implements IPowerOutlet {

    code: string;
    label: string;
    instance: any;
    logger: Logger;

    constructor(powerOutlet: IPowerOutlet) {
        this.code = powerOutlet.code;
        this.label = powerOutlet.label;
        this.instance = new rfxcom.Lighting1(
            RFXcom.getInstance(),
            rfxcom.lighting1.ENERGENIE_5_GANG
        );
        this.logger = new Logger(`Prise 433 MHz "${this.label}"`);
    }

    on() {
        this.instance.switchOn(this.code);
        this.logger.info(`Allumage de la prise "${this.label}"`);
    }

    off() {
        this.instance.switchOff(this.code);
        this.logger.info(`Extinction de la prise "${this.label}"`);
    }

    setState(state: boolean) {
        if (state) {
            this.on();
        } else {
            this.off();
        }
    }

    impulse(durationInMs: number) {
        this.on();
        setTimeout(
            () => {
                this.off();
            },
            durationInMs
        );
    }
}