import {HumidityDB} from "../thermospi/db/humidity-db";
import {ClientPowerOutlet} from "../api/domotic/client-power-outlet";
import {Logger} from "../common/logger/logger";
import * as yargs from "yargs";
import {SensorTag} from "../sensors/sensor";

export class Humidifier {
    private humidityDB: HumidityDB;
    private powerOutlet: ClientPowerOutlet;
    private logger: Logger;
    private sensor: SensorTag;
    private setPoint: number;

    constructor() {
        this.sensor = yargs.argv.sensor ? yargs.argv.sensor : 'chambre';
        this.setPoint = yargs.argv.setPoint ? yargs.argv.setPoint : 58;
        this.logger = new Logger('Humidifieur');
        this.humidityDB = new HumidityDB();
        this.powerOutlet = new ClientPowerOutlet();
    }

    updateStatus() {
        this.humidityDB.getCurrentHumidityValueBySensorTags([this.sensor, 'humidity']).then((humidityMeasures) => {
            let humidityMeasure = humidityMeasures[0];
            this.logger.debug(`Humidité mesurée par le capteur '${this.sensor}' : ${humidityMeasure.value}%`);
            this.powerOutlet.setState('A2', humidityMeasure.value < this.setPoint);
        });
    }
}

new Humidifier().updateStatus();