import {SunAPI} from "../../meteo/data/sun-api";
import moment = require("moment");
import {Logger} from "../../common/logger/logger";
import {TocToc} from "../../toctoc/toctoc";
import {PowerOutletDB} from "../../power-outlet/power-outlet-db";
import {ClientAPIDomotic} from "../../api/domotic/client-api-domotic";

export class TvSimulator {
    sunApi: SunAPI;
    logger: Logger;
    toctoc: TocToc;
    isTVSimulatorOn: boolean = true;
    clientAPIDomotic: ClientAPIDomotic;

    minutesInADay: number = 24 * 60;
    tvSimulatorPowerOutletCode: string = 'A4';

    constructor() {
        this.sunApi = new SunAPI();
        this.logger = new Logger('Simulateur TV');
        this.toctoc = new TocToc();
        this.clientAPIDomotic = new ClientAPIDomotic();
        this.turnTVSimulatorOff();
    }

    start() {
        this.sunApi.phases.then((sunPhases) => {
            this.logger.notify(`lever=${sunPhases.sunrise}, coucher=${sunPhases.sunset}`);
            for (let index = 0; index < this.minutesInADay; index++) {
                setTimeout(
                    () => {
                        this.toctoc.ifAbsent(
                            () => {
                                let now = moment();
                                if (!now.isBetween(sunPhases.sunrise, sunPhases.sunset)) {
                                    this.turnTVSimulatorOn();
                                } else {
                                    this.turnTVSimulatorOff();
                                }
                            },
                            () => {
                                this.turnTVSimulatorOff();
                            }
                        );
                    },
                    index * 60 * 1000
                );
            }
        });
    }

    turnTVSimulatorOn() {
        if (!this.isTVSimulatorOn) {
            this.isTVSimulatorOn = true;
            this.logger.notify(`Allumage du simulateur de TV`);
            this.clientAPIDomotic.setPowerOutletState(this.tvSimulatorPowerOutletCode, true);
        }
    }

    turnTVSimulatorOff() {
        if (this.isTVSimulatorOn) {
            this.isTVSimulatorOn = false;
            this.logger.notify(`Extinction du simulateur de TV`);
            this.clientAPIDomotic.setPowerOutletState(this.tvSimulatorPowerOutletCode, false);
        }
    }
}

new TvSimulator().start();
