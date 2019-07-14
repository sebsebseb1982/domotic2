import {Logger} from "../common/logger/logger";

let exec = require('child_process').execSync;

export class GPIO {
    private logger: Logger;

    constructor(private pinNumber: number, mode: string) {
        this.logger = new Logger(`GPIO ${pinNumber} (${mode})`);
        this.executeCommand(`sudo gpio mode ${pinNumber} ${mode}`);
    }

    setState(state: boolean) {
        this.executeCommand(`sudo gpio write ${this.pinNumber} ${state ? 1 : 0}`);
    }

    readState(): boolean {
        return this.executeCommand(`sudo gpio read ${this.pinNumber}`) == '1';
    }

    private executeCommand(command: string): string {
        this.logger.debug(command);
        return exec(command, (error, stdout, stderr) => {
            this.logger.debug(stdout);
            if (error) {
                this.logger.error(error.message, stderr);
            }
        }).toString();
    }
}