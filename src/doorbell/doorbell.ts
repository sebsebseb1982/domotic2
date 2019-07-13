import {Logger} from "../common/logger/logger";

let exec = require('child_process').execSync;

export class Doorbell {

    private static logger: Logger = new Logger('Sonnette');

    constructor() {
        Doorbell.executeCommand(`sudo gpio mode 3 in`);

        setInterval(() => {
            Doorbell.executeCommand(`sudo gpio read 3`);
        }, 100);
    }

    static executeCommand(command: string) {
        this.logger.debug(command);
        console.log(exec(command, (error, stdout, stderr) => {
            this.logger.debug(stdout);
            if (error) {
                this.logger.error(error.message, stderr);
            }
        }).toString());
    };
}