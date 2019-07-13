import {Logger} from "../common/logger/logger";

let exec = require('child_process').execSync;

export class GPIO {
    private logger: Logger ;

    constructor(private pinNumber: number, mode: string) {
        this.logger= new Logger(`GPIO ${pinNumber} (${mode})`);
        this.executeCommand(`sudo gpio mode ${pinNumber} ${mode}`);
    }

    setState(state: number) {
        this.executeCommand(`sudo gpio write ${this.pinNumber} ${state}`);
    }

    readState(): number {
        return parseInt(this.executeCommand(`sudo gpio read ${this.pinNumber}`));
    }

    private executeCommand(command : string): string {
        this.logger.debug(command);
        return exec(command, (error, stdout, stderr) => {
            this.logger.debug(stdout);
            if (error) {
                this.logger.error(error.message, stderr);
            }
        }).toString();
    }
}