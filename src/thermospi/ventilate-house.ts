import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {TocToc} from "../toctoc/toctoc";
import {ThermospiDB} from "./db";

const maxInsideTemperature = 22;

export class VentilateHouse {
    googleHome: GoogleHomeService;
    toctoc: TocToc;
    db: ThermospiDB;

    constructor() {
        this.googleHome = new GoogleHomeService();
        this.toctoc = new TocToc();
        this.db = new ThermospiDB();
    }

    check(): void {
        this.toctoc.ifPresent(() => {
            Promise.all([this.db.currentInsideTemperature, this.db.currentOutsideTemperature]).then((temperatures) => {
                let currentInsideTemperature = temperatures[0];
                let currentOutsideTemperature = temperatures[1];

                console.log('Températures intérieures : ', currentInsideTemperature);
                console.log('Températures extérieures : ', currentOutsideTemperature);

                if(currentInsideTemperature > maxInsideTemperature && currentInsideTemperature > currentOutsideTemperature) {
                    this.googleHome.speak('Vous pouvez ouvrir les fenêtres pour aérer !');
                } else {
                    this.googleHome.speak('Vous devrier fermer les fenêtres si ça n\'est pas déjà fait !');
                }
            });
        });
    }
}