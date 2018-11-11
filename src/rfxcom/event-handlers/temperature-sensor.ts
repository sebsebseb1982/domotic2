import {Logger} from "../../common/logger/logger";
import {ThermospiDB} from "../../thermospi/db/SetPointDB";

export class TemperatureSensor {
    logger: Logger;
    thermospiDB: ThermospiDB;
    constructor(private rfxcom: any){
        this.thermospiDB = new ThermospiDB();
        this.logger = new Logger('Sonde de température 433 MHz');
    }

    listen() {
        this.rfxcom.on("temperature1", (event) => {
            this.logger.debug(`Sonde de température ${event.id} (${event.temperature}°C, batterie = ${event.batteryLevel})`);
            this.thermospiDB.saveTemperatures([{
                value: event.temperature,
                probe: event.id,
                batteryLevel: event.batteryLevel,
                date: new Date()
            }]);
        });
    }
}