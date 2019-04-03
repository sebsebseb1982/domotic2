import {Logger} from "../../common/logger/logger";
import {TemperatureDB} from "../../thermospi/db/TemperatureDB";
import {HumidityDB} from "../../thermospi/db/humidity-db";
import {SensorDB} from "../../sensors/db/sensor-db";
import {ISensor} from "../../sensors/sensor";
import {MeasureHistory} from "../../sensors/measure-history";

export class TemperatureHumiditySensor {
    logger: Logger;
    temperatureDB: TemperatureDB;
    humidityDB: HumidityDB;

    constructor(private rfxcom: any) {
        this.temperatureDB = new TemperatureDB();
        this.humidityDB = new HumidityDB();
        this.logger = new Logger('Sonde de température/humidité 433 MHz');
    }

    listen() {
        this.rfxcom.on("temperaturehumidity1", (event) => {
            this.logger.debug(`Sonde de température/humidité ${event.id} (${event.temperature}°C, batterie = ${event.batteryLevel})`);

            SensorDB.instance.getById(event.id).then((sensor: ISensor) => {
                MeasureHistory.instance.refreshIfPossible(sensor, () => {
                    this.temperatureDB.saveTemperatures([{
                        value: event.temperature,
                        sensorId: sensor.id,
                        date: new Date()
                    }]);

                    this.humidityDB.saveMeasures([{
                        value: event.humidity,
                        sensorId: sensor.id,
                        status: event.humidityStatus,
                        date: new Date()
                    }]);
                });
            });
        });
    }
}