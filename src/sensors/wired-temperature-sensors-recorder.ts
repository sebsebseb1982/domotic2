import {TemperatureDB} from "../thermospi/db/TemperatureDB";
import {ITemperature} from "../thermospi/models/temperature";
import {SensorDB} from "./db/sensor-db";
import {ISensor, SensorTag} from "./sensor";
import * as _ from "lodash";
import {WiredTemperatureSensor} from "./wired-temperature-sensor";
import * as yargs from 'yargs';
import {VirtualService} from "../jeedom/VirtualService";

class WiredTemperatureSensorsRecorder {
    temperatureDB: TemperatureDB;
    location: SensorTag;
    virtualService: VirtualService;

    constructor() {
        this.temperatureDB = new TemperatureDB();
        this.location = yargs.argv.location;
        this.virtualService = new VirtualService();
    }

    record() {
        SensorDB.instance.getByTags(['wired', 'temperature', this.location]).then((sensors: ISensor[]) => {
            let temperaturesToRecord: ITemperature[] = [];

            _.map(sensors, (sensor: ISensor) => {
                return new WiredTemperatureSensor(sensor);
            }).forEach((wiredTemperatureSensor: WiredTemperatureSensor) => {
                temperaturesToRecord.push({
                    sensorId: wiredTemperatureSensor.id,
                    value: wiredTemperatureSensor.temperature,
                    date: new Date()
                });
                this.virtualService.updateVirtual(
                    {
                        id: wiredTemperatureSensor.virtualID,
                        name: wiredTemperatureSensor.label
                    },
                    wiredTemperatureSensor.temperature
                );
            });
            this.temperatureDB.saveTemperatures(temperaturesToRecord);
        });
    }
}

new WiredTemperatureSensorsRecorder().record();