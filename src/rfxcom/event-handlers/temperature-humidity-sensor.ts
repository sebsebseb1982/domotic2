import {Logger} from "../../common/logger/logger";
import {TemperatureDB} from "../../thermospi/db/TemperatureDB";

export class TemperatureHumiditySensor{
    logger: Logger;
    temperatureDB: TemperatureDB;
    constructor(private rfxcom: any){
        this.temperatureDB = new TemperatureDB();
        this.logger = new Logger('Sonde de température/humidité 433 MHz');
    }

    listen() {
        this.rfxcom.on("temperaturehumidity1", (event) => {
            console.log(event);
            this.logger.debug(`Sonde de température/humidité ${event.id} (${event.temperature}°C, batterie = ${event.batteryLevel})`);
        });
    }
}