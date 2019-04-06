import {TemperatureDB} from "../thermospi/db/TemperatureDB";
import {ITemperature} from "../thermospi/models/temperature";
import {SensorDB} from "./db/sensor-db";
import {ISensor, SensorTag} from "./sensor";
import * as _ from "lodash";
import {WiredTemperatureSensor} from "./wired-temperature-sensor";
import * as yargs from 'yargs';

class WiredTemperatureSensorsRecorder {
    temperatureDB: TemperatureDB;
    location: SensorTag;

    constructor() {
        this.temperatureDB = new TemperatureDB();
        this.location = yargs.argv.location;
    }

    record() {
        SensorDB.instance.getByTags(['wired','temperature', this.location]).then((sensors: ISensor[]) => {
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

new WiredTemperatureSensorsRecorder().record();