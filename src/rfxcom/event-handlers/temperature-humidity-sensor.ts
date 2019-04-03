import {Logger} from "../../common/logger/logger";
import {TemperatureDB} from "../../thermospi/db/TemperatureDB";
import {HumidityDB} from "../../thermospi/db/humidity-db";

export class TemperatureHumiditySensor{
    logger: Logger;
    temperatureDB: TemperatureDB;
    humidityDB: HumidityDB;

    constructor(private rfxcom: any){
        this.temperatureDB = new TemperatureDB();
        this.humidityDB = new HumidityDB();
        this.logger = new Logger('Sonde de température/humidité 433 MHz');
    }

    listen() {
        this.rfxcom.on("temperaturehumidity1", (event) => {
            this.logger.debug(`Sonde de température/humidité ${event.id} (${event.temperature}°C, batterie = ${event.batteryLevel})`);

            this.temperatureDB.saveTemperatures([{
                value: event.temperature,
                probe: event.id,
                batteryLevel: event.batteryLevel,
                date: new Date()
            }]);

            this.humidityDB.saveMeasures([{
                value: event.humidity,
                probe: event.id,
                batteryLevel: event.batteryLevel,
                status: event.humidityStatus,
                date: new Date()
            }]);
        });
    }
}