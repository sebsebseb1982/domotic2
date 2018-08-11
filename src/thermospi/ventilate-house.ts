import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {TocToc} from "../toctoc/toctoc";
import {ThermospiDB} from "./db";
import {Logger} from "../common/logger/logger";

const maxInsideTemperature = 22;

export class VentilateHouse {
    googleHome: GoogleHomeService;
    toctoc: TocToc;
    db: ThermospiDB;
    logger: Logger;

    constructor() {
        this.googleHome = new GoogleHomeService();
        this.toctoc = new TocToc();
        this.db = new ThermospiDB();
        this.logger = new Logger('Ventilate house');
    }

    check(): void {
        this.toctoc.ifPresent(() => {
            Promise.all([
                this.db.getCurrentInsideTemperature(),
                this.db.getCurrentOutsideTemperature(),
                this.db.isWindowsOpened(),
            ]).then((temperatures) => {
                let currentInsideTemperature = temperatures[0];
                let currentOutsideTemperature = temperatures[1];
                let windowsOpened = temperatures[2];

                this.logger.info(`Températures intérieures : ${currentInsideTemperature}`);
                this.logger.info(`Températures extérieures : ${currentOutsideTemperature}`);
                this.logger.info(`Fenêtres ouvertes : ${windowsOpened}`);

                if(currentInsideTemperature > maxInsideTemperature && currentInsideTemperature > currentOutsideTemperature) {
                    if(!windowsOpened) {
                        this.googleHome.say('Vous pouvez ouvrir les fenêtres pour aérer !');
                        this.db.setWindowsOpened(true);
                    }
                } else {
                    if(windowsOpened) {
                        this.googleHome.say('Vous devrier fermer les fenêtres si ça n\'est pas déjà fait !');
                        this.db.setWindowsOpened(false);
                    }
                }
            });
        });
    }
}