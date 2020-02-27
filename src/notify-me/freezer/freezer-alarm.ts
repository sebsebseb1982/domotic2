import {TemperatureDB} from "../../thermospi/db/TemperatureDB";
import {Logger} from "../../common/logger/logger";
import {GoogleHomeService} from "../../notifications/services/googleHomeService";
import * as yargs from "yargs";
import {SensorTag} from "../../sensors/sensor";
import {PushoverService} from "../../notifications/services/pushover-service";

export class FreezerAlarm {

    temperature: TemperatureDB;
    logger: Logger;
    googleHome: GoogleHomeService;
    sensor: SensorTag;
    limitTemperature: number;
    pushover:PushoverService;

    constructor() {
        this.temperature = new TemperatureDB();
        this.sensor = yargs.argv.sensor ? yargs.argv.sensor : 'garage';
        this.limitTemperature = yargs.argv.limit ? yargs.argv.limit : -10;
        this.logger = new Logger(`Alarme congélateur '${this.sensor}'`);
        this.googleHome = new GoogleHomeService();
        this.pushover = new PushoverService();
    }

    check() {
        this.temperature.getCurrentTemperaturesBySensorTags(['congelateur', this.sensor]).then((temperatures) => {
            let temperature = temperatures[0];
            if (temperature >= this.limitTemperature) {
                let message = `Attention, la température du congélateur ${this.sensor} dépasse les ${this.limitTemperature}°C`;
                this.googleHome.say(message);
                this.logger.warn(message, message);
                this.pushover.send({
                    title:message,
                    priority:1
                });
            } else {
                this.logger.info(`Pas de souci, le congélateur '${this.sensor}' est en dessous de ${this.limitTemperature}°C`)
            }
        });
    }
}

new FreezerAlarm().check();