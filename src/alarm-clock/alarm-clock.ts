import {TocToc} from "../toctoc/toctoc";
import {HueLampManager} from "../hue/hueLampManager";
import {lamps} from "../hue/hue-lamps";

const greenDelay = 30;
const blueDelay = 100;

export class AlarmClock {

    progressiveWakeUpDuration: number;
    wakeUpDuration: number;
    startTime: number;

    toctoc: TocToc;
    hueLampManager: HueLampManager;

    constructor() {
        console.log(process.argv, process.argv[2], process.argv[3]);
        this.progressiveWakeUpDuration = (process.argv[2] ? parseInt(process.argv[2]) : 45) * 60 * 1000;
        this.wakeUpDuration = (process.argv[3] ? parseInt(process.argv[3]) : 10) * 60 * 1000;
        this.startTime = 0;

        this.toctoc = new TocToc();

        this.hueLampManager = new HueLampManager();
    }

    private red(index) {
        return 255;
    }

    private green(index) {
        return Math.max(0, Math.min(200, index - greenDelay));
    }

    private blue(index) {
        return Math.max(0, Math.min(200, index - blueDelay));
    }

    wakeMeUp() {
        this.toctoc.ifAbsent(() => {
            console.log('Nobody to wake up !');
        }, () => {
            for (let i = 0; i < 256 + blueDelay; i++) {
                setTimeout(() => {
                    this.hueLampManager.setState(lamps.chevetSebastien, {
                        on: true,
                        bri: Math.round(Math.max(0, Math.min(255, i * (256 / (256 + blueDelay))))),
                        rgb: [
                            this.red(i),
                            this.green(i),
                            this.blue(i)
                        ]
                    });
                }, this.startTime);

                this.startTime = i * Math.round(this.progressiveWakeUpDuration / (256 + blueDelay));
            }

            setTimeout(() => {
                this.hueLampManager.setState(lamps.simulateurAube, {
                    on: false
                });
            }, this.progressiveWakeUpDuration + this.wakeUpDuration);
        });
    }
}