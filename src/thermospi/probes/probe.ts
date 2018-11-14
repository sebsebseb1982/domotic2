import * as fs from "fs";
import {Logger} from "../../common/logger/logger";
import * as _ from "lodash";

interface IProbeRawValue {
    crcOK: boolean;
    temperature: number;
}

export interface IProbe {
    id: number;
    label: string;
    path: string;
    site: number;
}

export class Probe implements IProbe {
    id: number;
    label: string;
    path: string;
    site: number;
    logger: Logger;

    constructor(probe: IProbe) {
        this.id = probe.id;
        this.label = probe.label;
        this.path = probe.path;
        this.site = probe.site;
        this.logger = new Logger(`Sonde de température "${this.label}"`);
    }

    get temperature(): number {
        let probeRawValue: IProbeRawValue;
        do {
            probeRawValue = this.read();
        } while (!probeRawValue.crcOK || probeRawValue.temperature > 75);

        this.logger.info(`La sonde "${this.label}" lit une température de ${_.round(probeRawValue.temperature, 1)}°C `)
        return probeRawValue.temperature;
    }

    private extractCRCStatus(crcLine) {
        let chunks = crcLine.split(' ');
        return chunks[chunks.length - 1] === "YES";
    }

    private extractTemperature(temperatureLine) {
        let chunks = temperatureLine.split('=');
        return parseFloat(chunks[1]) / 1000;
    }

    private read(): IProbeRawValue {
        let lines;
        try {
            lines = fs.readFileSync(this.path).toString().split('\n');
        } catch (e) {
            this.logger.error(`Impossible de lire les informations de la sonde "${this.label}"`, e);
        }

        return {
            crcOK: this.extractCRCStatus(lines[0]),
            temperature: this.extractTemperature(lines[1])
        }
    }
}