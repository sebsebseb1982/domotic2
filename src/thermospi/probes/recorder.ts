import {ProbeDB} from "./probe-db";
import {TemperatureDB} from "../db/TemperatureDB";
import {ITemperature} from "../models/temperature";

export class Recorder {
    private thermostatProbesSite: number = 1;
    temperatureDB: TemperatureDB;

    constructor() {
        this.temperatureDB = new TemperatureDB();
    }

    record() {
        ProbeDB.instance.getProbesBySite(this.thermostatProbesSite).then((probes) => {
            let temperaturesToRecord: ITemperature[];
            probes.forEach((probe) => {
                temperaturesToRecord.push({
                    probe: probe.id,
                    value: probe.temperature,
                    date: new Date()
                });
            });
            this.temperatureDB.saveTemperatures(temperaturesToRecord);
        });
    }
}