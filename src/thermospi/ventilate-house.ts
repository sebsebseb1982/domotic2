import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {TocToc} from "../toctoc/toctoc";
import {Logger} from "../common/logger/logger";
import {VentilationStatusDB} from "./db/VentilationStatusDB";
import {TemperatureDB} from "./db/TemperatureDB";

const maxInsideTemperature = 22;

export class VentilateHouse {
    googleHome: GoogleHomeService;
    toctoc: TocToc;
    ventilationStatusDB: VentilationStatusDB;
    temperatureDB: TemperatureDB;
    logger: Logger;

    constructor() {
        this.googleHome = new GoogleHomeService();
        this.toctoc = new TocToc();
        this.ventilationStatusDB = new VentilationStatusDB();
        this.temperatureDB = new TemperatureDB();
        this.logger = new Logger('Ventilate house');
    }

    check(): void {
        if (this.isSummer()) {
            this.logger.debug("Mode été");
            this.toctoc.ifPresent(() => {
                Promise.all([
                    this.temperatureDB.getCurrentInsideTemperature(),
                    this.temperatureDB.getCurrentOutsideTemperature(),
                    this.ventilationStatusDB.isWindowsOpened(),
                ]).then((temperatures) => {
                    let currentInsideTemperature = temperatures[0];
                    let currentOutsideTemperature = temperatures[1];
                    let windowsOpened = temperatures[2];

                    this.logger.info(`Températures intérieures : ${currentInsideTemperature}`);
                    this.logger.info(`Températures extérieures : ${currentOutsideTemperature}`);
                    this.logger.info(`Fenêtres ouvertes : ${windowsOpened}`);

                    if (currentInsideTemperature > maxInsideTemperature && currentInsideTemperature > currentOutsideTemperature) {
                        if (!windowsOpened) {
                            this.googleHome.say('Vous pouvez ouvrir les fenêtres pour aérer !');
                            this.ventilationStatusDB.setWindowsOpened(true);
                        }
                    } else {
                        if (windowsOpened) {
                            this.googleHome.say('Vous devrier fermer les fenêtres si ça n\'est pas déjà fait !');
                            this.ventilationStatusDB.setWindowsOpened(false);
                        }
                    }
                });
            });
        }else {
            this.logger.debug("Mode hiver, on ne fait rien");
        }
    }

    private isSummer() {
        let now = new Date();

        return now.getMonth() >= 4 || now.getMonth() <= 9;
    }
}