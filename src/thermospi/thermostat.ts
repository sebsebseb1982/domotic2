import {TocToc} from "../toctoc/toctoc";
import {Logger} from "../common/logger/logger";
import {ISetPoint} from "./models/setpoint";
import * as _ from "lodash";
import {Heater} from "./heater";
import {TemperatureDB} from "./db/TemperatureDB";
import {SetPointDB} from "./db/SetPointDB";
import {RealSetPointDB} from "./db/RealSetPointDB";

export class Thermostat {
    //googleHome: GoogleHomeService;
    toctoc: TocToc;
    temperatureDB: TemperatureDB;
    setPointDB: SetPointDB;
    realSetPointDB: RealSetPointDB;
    logger: Logger;
    heater: Heater;
    hysteresis: number = 1;

    constructor() {
        //this.googleHome = new GoogleHomeService();
        this.toctoc = new TocToc();
        this.temperatureDB = new TemperatureDB();
        this.setPointDB = new SetPointDB();
        this.realSetPointDB = new RealSetPointDB();
        this.logger = new Logger('Thermostat');
        this.heater = new Heater();
    }

    update() {
        Promise
            .all([
                this.setPointDB.getCurrentSetPoint(),
                this.temperatureDB.getCurrentInsideTemperature()
            ])
            .then((values) => {

                let currentSetPoint: number = values[0].value;
                let insideTemperature: number = values[1];

                this.logger.info(
                    `Il fait actuellement ${_.round(insideTemperature, 1)}°C dans la maison. Le thermostat est réglé à ${_.round(currentSetPoint, 1)}°C.`
                );

                this.toctoc.ifPresent(
                    () => {
                        this.updateRealSetPoint(currentSetPoint);

                        if (insideTemperature < currentSetPoint - (this.hysteresis / 2)) {
                            this.logger.info('Il fait trop froid dans la maison');
                            this.heater.on();
                        } else if (insideTemperature > currentSetPoint + (this.hysteresis / 2)) {
                            this.logger.info('Il fait trop chaud dans la maison');
                            this.heater.off();
                        } else {
                            this.logger.info('Il fait bon dans la maison');
                        }
                    },
                    () => {
                        this.updateRealSetPoint(0);
                        this.heater.off();
                    }
                );
            });
    }

    updateRealSetPoint(newSetPoint: number) {
        this.realSetPointDB.getCurrentRealSetPoint().then((lastRealSetPoint: ISetPoint) => {
            if (lastRealSetPoint.value !== newSetPoint) {
                this.logger.debug(`Ajout d'une consigne de chauffage réelle à ${newSetPoint}°C`);
                this.realSetPointDB.add(newSetPoint);
            } else {
                this.logger.debug(`Inutile d'ajouter une nouvelle consigne de chauffage réelle à ${newSetPoint}°C`);
            }
        });
    }
}