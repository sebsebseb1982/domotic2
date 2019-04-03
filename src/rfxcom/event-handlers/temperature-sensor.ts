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
            SensorDB.instance.getById(event.id).then((sensor: ISensor) => {
                if(sensor !== undefined){
                    this.logger.debug(`Réception d'un signal radio du capteur de température "${sensor.label}" (${event.temperature}°C, batterie = ${event.batteryLevel})`);
                    MeasureHistory.instance.refreshIfPossible(sensor, () => {
                        this.temperatureDB.saveTemperatures([{
                            value: event.temperature,
                            sensorId: sensor.id,
                            date: new Date()
                        }]);
                    });
                } else {
                    this.logger.notify(`Réception d'un signal radio d'un capteur de température inconnu (id=${event.id})`, `température=${event.temperature}°C`);
                }
            });
        });
    }
}