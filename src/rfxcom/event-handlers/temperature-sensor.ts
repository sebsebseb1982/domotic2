import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import {Logger} from "../../common/logger/logger";

export class TemperatureSensor {
    logger: Logger;
    constructor(private rfxcom: any){
        this.logger = new Logger('Sonde de température');
    }

    listen() {
        this.rfxcom.on("temp2", (evt) => {
            this.logger.debug(`Sonde de température ${evt.id} (${evt.temperature}°C, batterie = ${evt.batteryLevel})`);
        });
    }
}