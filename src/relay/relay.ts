import {IRelay} from "./relayType";
import {exec} from "child_process";
import {Logger} from "../common/logger/logger";

export class Relay implements IRelay {
    code: string;
    gpio: number;
    label: string;
    pin: number;

    logger: Logger;

    constructor(relay: IRelay) {
        this.code = relay.code;
        this.gpio = relay.gpio;
        this.label = relay.label;
        this.pin = relay.pin;
        this.logger = new Logger(`Relais ${this.label}`);
    }

    on() {
        this.executeScript(`sudo gpio write ${this.gpio} 1`);
    }

    off() {
        this.executeScript(`sudo gpio write ${this.gpio} 0`);
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

    setState(state: boolean) {
        if (state) {
            this.on();
        } else {
            this.off();
        }
    }

    private executeScript(script: string) {
        exec(script, (error, stdout, stderr) => {
            this.logger.debug(stdout);
            this.logger.error(error.message, stderr);
        });
    };
}