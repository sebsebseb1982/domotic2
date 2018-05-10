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
            Promise.all([
                this.db.getCurrentInsideTemperature(),
                this.db.getCurrentOutsideTemperature(),
                this.db.isWindowsOpened(),
            ]).then((temperatures) => {
                let currentInsideTemperature = temperatures[0];
                let currentOutsideTemperature = temperatures[1];
                let windowsOpened = temperatures[2];

                console.log('Températures intérieures : ', currentInsideTemperature);
                console.log('Températures extérieures : ', currentOutsideTemperature);
                console.log('Fenêtres ouvertes : ', windowsOpened);

                if(currentInsideTemperature > maxInsideTemperature && currentInsideTemperature > currentOutsideTemperature) {
                    if(!windowsOpened) {
                        let somethingToSay = 'Vous pouvez ouvrir les fenêtres pour aérer !';
                        console.log(somethingToSay);
                        //this.googleHome.say(somethingToSay);
                        this.db.setWindowsOpened(true);
                    }
                } else {
                    if(windowsOpened) {
                        let somethingToSay = 'Vous devrier fermer les fenêtres si ça n\'est pas déjà fait !';
                        console.log(somethingToSay);
                        //this.googleHome.say(somethingToSay);
                        this.db.setWindowsOpened(false);
                    }
                }
            });
        });
    }
}