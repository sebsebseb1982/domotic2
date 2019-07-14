import {IRelay} from "./relayType";
import {exec} from "child_process";
import {Logger} from "../common/logger/logger";
import {GPIO} from "../gpio/gpio";

export class Relay implements IRelay {
    code: string;
    gpioPinNumber: number;
    gpio: GPIO;
    label: string;
    pin: number;

    logger: Logger;

    constructor(relay: IRelay) {
        this.code = relay.code;
        this.gpioPinNumber = relay.gpioPinNumber;
        this.gpio = new GPIO(relay.gpioPinNumber, 'out');
        this.label = relay.label;
        this.pin = relay.pin;
        this.logger = new Logger(`Relais ${this.label}`);
    }

    impulse(durationInMs: number) {
        this.setState(true);
        setTimeout(
            () => {
                this.setState(false);
            },
            durationInMs
        );
    }

    setState(state: boolean) {
        this.gpio.setState(state);
    }

    private executeScript(script: string) {
        exec(script, (error, stdout, stderr) => {
            this.logger.debug(stdout);
            if (error) {
                this.logger.error(error.message, stderr);
            }
        });
    };
}