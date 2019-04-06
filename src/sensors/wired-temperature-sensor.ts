import * as fs from "fs";
import {Logger} from "../common/logger/logger";
import * as _ from "lodash";
import {ISensor, SensorTag} from "./sensor";

interface IWiredTemperatureSensorRawValue {
    crcOK: boolean;
    temperature: number;
}

export class WiredTemperatureSensor implements ISensor {
    id: string;
    label: string;
    path?: string;
    tags: SensorTag[];
    radio: boolean;
    logger: Logger;

    constructor(sensor: ISensor) {
        this.id = sensor.id;
        this.label = sensor.label;
        this.path = sensor.path;
        this.tags = sensor.tags;
        this.radio = false;
        this.logger = new Logger(`Sonde de température "${this.label}" (${this.tags})`);
    }

    get temperature(): number {
        let sensorRawValue: IWiredTemperatureSensorRawValue;
        do {
            sensorRawValue = this.read();
        } while (!sensorRawValue.crcOK || sensorRawValue.temperature > 75);

        this.logger.info(`La sonde "${this.label}" lit une température de ${_.round(sensorRawValue.temperature, 1)}°C `)
        return sensorRawValue.temperature;
    }

    private extractCRCStatus(crcLine) {
        let chunks = crcLine.split(' ');
        return chunks[chunks.length - 1] === "YES";
    }

    private extractTemperature(temperatureLine) {
        let chunks = temperatureLine.split('=');
        return parseFloat(chunks[1]) / 1000;
    }

    private read(): IWiredTemperatureSensorRawValue {
        let lines;
        try {
            lines = fs.readFileSync(this.path).toString().split('\n');
        } catch (e) {
            this.logger.error(`Impossible de lire les informations du capteur "${this.label}"`, e);
        }

        return {
            crcOK: this.extractCRCStatus(lines[0]),
            temperature: this.extractTemperature(lines[1])
        }
    }
}