import {TemperatureDB} from "../thermospi/db/TemperatureDB";
import {ITemperature} from "../thermospi/models/temperature";
import {SensorDB} from "./db/sensor-db";
import {ISensor} from "./sensor";
import * as _ from "lodash";
import {WiredTemperatureSensor} from "./wired-temperature-sensor";

export class WiredTemperatureSensorsRecorder {
    temperatureDB: TemperatureDB;

    constructor() {
        this.temperatureDB = new TemperatureDB();
    }

    record() {
        SensorDB.instance.getByTypeAndLocation('wired-temperature', 'maison').then((sensors: ISensor[]) => {
            let temperaturesToRecord: ITemperature[] = [];

            _.map(sensors, (sensor: ISensor) => {
              return new WiredTemperatureSensor(sensor);
            }).forEach((wiredTemperatureSensor: WiredTemperatureSensor) => {
                temperaturesToRecord.push({
                    sensorId: wiredTemperatureSensor.id,
                    value: wiredTemperatureSensor.temperature,
                    date: new Date()
                });
            });
            this.temperatureDB.saveTemperatures(temperaturesToRecord);
        });
    }
}