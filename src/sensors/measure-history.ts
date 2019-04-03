import {ISensor} from "./sensor";
import * as moment from 'moment';
import {Logger} from "../common/logger/logger";

export class MeasureHistory {
    static staticInstance: MeasureHistory;
    logger: Logger;
    lastUpdates: { [sensorId: string]: Date };
    refreshPeriodInMinutes: number = 15;

    private constructor() {
        this.logger = new Logger(`Gestionnaire de rafraîchissement des capteurs`);
        this.lastUpdates = {};
    }

    static get instance(): MeasureHistory {
        if (!MeasureHistory.staticInstance) {
            MeasureHistory.staticInstance = new MeasureHistory();
        }

        return MeasureHistory.staticInstance;
    }

    refreshIfPossible(sensor: ISensor, callback: Function) {

        let nMinutesAgo = moment().add(this.refreshPeriodInMinutes * -1, 'minutes');

        if (moment(this.lastUpdates[sensor.id]).isBefore(nMinutesAgo)) {
            this.logger.debug(`Le capteur "${sensor.label}" a déjà été mesuré dans les ${this.refreshPeriodInMinutes} dernières minutes`);
        } else {
            this.logger.debug(`Le capteur "${sensor.label}" peut être de nouveau mesuré`);
            this.lastUpdates[sensor.id] = new Date();
            callback();
        }
    }
}