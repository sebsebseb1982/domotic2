import {IAVRStatus, DenonAVR} from "../avr/denonAVR";
import {IConfiguration} from "../configuration/configurationType";
import {Configuration} from "../configuration/configuration";
import {TocToc} from "../toctoc/toctoc";

export class Radio {
    avr: DenonAVR;
    configuration: IConfiguration;
    toctoc: TocToc;

    constructor() {
        this.configuration = new Configuration();
        this.avr = new DenonAVR(this.configuration.avr.hostname);
        this.toctoc = new TocToc();
    }

    startTunerOnlyIfPresent(duration?: number) {
        this.avr.getStatus().then((status:IAVRStatus) => {
            if (status.item.Power.value === 'ON') {
                console.log('AVR is already in use !');
            } else {
                let duration2 = duration || parseInt(process.argv[1]) || 1;
                console.log(`AVR started for ${duration2} minutes`);
                let retry = 10 * 1000 /* ms */;
                let ellapsedTime = 0;
                let isPresent = false;
                for (let ellapsedTime = 0; ellapsedTime < duration2 * 60 * 1000 /* ms */; ellapsedTime += retry) {
                    setTimeout(() => {
                        this.toctoc.ifPresent(
                            // Présent
                            () => {
                                if (!isPresent) {
                                    this.turnONRadio();
                                    isPresent = true;
                                }
                            },
                            // Absent
                            () => {
                                if (isPresent) {
                                    this.avr.off();
                                    isPresent = false;
                                }
                            }
                        );
                    }, ellapsedTime);
                }

                setTimeout(() => {
                    this.avr.off();
                }, duration2 * 60 * 1000 /* ms */);
            }
        });
    }

    turnONRadio() {
        this.avr.on();

        // Position Tuner
        setTimeout(() => {
            this.avr.tuner();
            this.avr.setVolume(-30);
        }, 10 * 1000);
    }
}