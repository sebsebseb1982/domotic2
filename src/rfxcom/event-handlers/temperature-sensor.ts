import {Logger} from "../../common/logger/logger";
import {TemperatureDB} from "../../thermospi/db/TemperatureDB";
import {MeasureHistory} from "../../sensors/measure-history";
import {SensorDB} from "../../sensors/db/sensor-db";
import {ISensor} from "../../sensors/sensor";

export class TemperatureSensor {
    logger: Logger;
    temperatureDB: TemperatureDB;

    constructor(private rfxcom: any) {
        this.temperatureDB = new TemperatureDB();
        this.logger = new Logger('Sonde de température 433 MHz');
    }

    listen() {
        this.rfxcom.on("temperature1", (event) => {
            this.logger.debug(`Sonde de température ${event.id} (${event.temperature}°C, batterie = ${event.batteryLevel})`);

            SensorDB.instance.getById(event.id).then((sensor: ISensor) => {
                MeasureHistory.instance.refreshIfPossible(sensor, () => {
                    this.temperatureDB.saveTemperatures([{
                        value: event.temperature,
                        sensorId: event.id,
                        date: new Date()
                    }]);
                });
            });
        });
    }
}