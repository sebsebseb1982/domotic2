import {Logger} from "../../common/logger/logger";
import {TemperatureDB} from "../../thermospi/db/TemperatureDB";

export class TemperatureSensor {
    logger: Logger;
    temperatureDB: TemperatureDB;
    constructor(private rfxcom: any){
        this.temperatureDB = new TemperatureDB();
        this.logger = new Logger('Sonde de température 433 MHz');
    }

    listen() {
        this.rfxcom.on("temperature1", (event) => {
            this.logger.debug(`Sonde de température ${event.id} (${event.temperature}°C, batterie = ${event.batteryLevel})`);
            console.log(event);
            this.temperatureDB.saveTemperatures([{
                value: event.temperature,
                probe: event.id,
                batteryLevel: event.batteryLevel,
                date: new Date()
            }]);
        });
    }
}