import {Logger} from "../../common/logger/logger";

export class ElectricRoller {
    logger: Logger;

    constructor(private rfxcom: any) {
        this.logger = new Logger('Volet roulant');
    }

    listen() {
        this.rfxcom.on("temperature1", (event) => {
            this.logger.debug(`event`);
        });
    }
}