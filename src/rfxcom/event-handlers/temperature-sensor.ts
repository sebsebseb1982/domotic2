import {Logger} from "../../common/logger/logger";

export class TemperatureSensor {
    logger: Logger;
    constructor(private rfxcom: any){
        this.logger = new Logger('Sonde de température');
    }

    listen() {
        this.rfxcom.on("temperature1", (event) => {
            this.logger.debug(`Sonde de température ${event.id} (${event.temperature}°C, batterie = ${event.batteryLevel})`);
        });
    }
}