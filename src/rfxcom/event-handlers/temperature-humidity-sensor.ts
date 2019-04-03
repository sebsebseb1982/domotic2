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
            SensorDB.instance.getById(event.id).then((sensor: ISensor) => {
                if(sensor !== undefined){
                    this.logger.debug(`Réception d'un signal radio du capteur de température/humidité "${sensor.label}" ${event.temperature}°C/${event.humidity}% (batterie = ${event.batteryLevel})`);
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
                } else {
                    this.logger.notify(`Réception d'un signal radio d'un capteur de température/humidité inconnu (id=${event.id})`, `${event.temperature}°C/${event.humidity}%`);
                }
            });
        });
    }
}