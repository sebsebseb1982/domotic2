import {TocToc} from "../toctoc/toctoc";
import {HueLamp} from "../hue/hue-lamp";
import * as yargs from  'yargs';
import {Logger} from "../common/logger/logger";

const greenDelay = 30;
const blueDelay = 100;

export class AlarmClock {

    progressiveWakeUpDuration: number;
    wakeUpDuration: number;
    lampCode: string;
    lamp: HueLamp;
    toctoc: TocToc;
    logger: Logger;

    constructor() {
        this.progressiveWakeUpDuration = (yargs.argv.progressiveWakeUpDuration ? yargs.argv.progressiveWakeUpDuration : 45)* 60 * 1000;
        this.wakeUpDuration = (yargs.argv.wakeUpDuration ? yargs.argv.wakeUpDuration : 5)* 60 * 1000;
        this.lampCode = yargs.argv.lampCode ? yargs.argv.lampCode : 'bureau';
        this.lamp = new HueLamp(this.lampCode);
        this.toctoc = new TocToc();
        this.logger = new Logger(`Simulateur d'aube`);
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
            this.logger.info(`Il n'y a personne à réveiller dans la maison.`);
        }, () => {
            this.logger.info(`Lever du soleil pendant ${yargs.argv.progressiveWakeUpDuration} minute(s) sur la lampe "${this.lamp.label}"`);
            let startTime = 0;
            for (let i = 0; i < 256 + blueDelay; i++) {
                setTimeout(() => {
                    this.lamp.setState({
                        on: true,
                        bri: Math.round(Math.max(1, Math.min(254, i * (256 / (256 + blueDelay))))),
                        rgb: [
                            this.red(i),
                            this.green(i),
                            this.blue(i)
                        ]
                    });
                }, startTime);

                startTime = i * Math.round(this.progressiveWakeUpDuration / (256 + blueDelay));
            }

            setTimeout(() => {
                this.lamp.off();
            }, this.progressiveWakeUpDuration + this.wakeUpDuration);
        });
    }
}

new AlarmClock().wakeMeUp();