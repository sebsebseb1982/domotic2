import {PresenceDetector} from "./cctv/presence-detector";
import {Snapshot} from "./cctv/snapshot";
import * as _ from "lodash";
import {HueLampManager} from "../hue/hueLampManager";
import {lamps} from "../hue/hue-lamps";
import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {MailService} from "../notifications/services/mailService";
import {HTML} from "../common/html";
import * as yargs from  'yargs';
import {Logger} from "../common/logger/logger";
import {TocToc} from "../toctoc/toctoc";

export class Cerberos {
    presenceDetector: PresenceDetector;
    hue: HueLampManager;
    googleHome: GoogleHomeService;
    notifier: MailService;
    nLastMinutes: number;
    logger: Logger;
    toctoc: TocToc;

    constructor() {
        this.nLastMinutes = yargs.argv.nLastMinutes ? yargs.argv.nLastMinutes : 2;
        this.presenceDetector = new PresenceDetector();
        this.hue = new HueLampManager();
        this.googleHome = new GoogleHomeService();
        let service = 'Cerberos';
        this.notifier = new MailService(service);
        this.logger = new Logger(service);
        this.toctoc = new TocToc();
    }

    watch() {
        let snapshots = this.presenceDetector.getSnapshotForNLastMinutes(this.nLastMinutes);
        let snapshotsFromCamerasWhichCanTriggerLight = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerLight);
        let snapshotsFromCamerasWhichCanTriggerVoice = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerVoice);
        let snapshotsFromCamerasWhichCanTriggerNotification = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerNotification);

        this.toctoc.ifPresent(() => {
            if (snapshotsFromCamerasWhichCanTriggerLight.length > 0) {
                this.logger.info(`La lumière va être allumée par les caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerLight)}`);
                this.turnLightOn();
            }

            if (snapshotsFromCamerasWhichCanTriggerVoice.length > 0) {
                this.logger.info(`La parole va être activée par les caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerVoice)}`);
                this.speak();
            }

            if (snapshotsFromCamerasWhichCanTriggerNotification.length > 0) {
                this.logger.info(`Une notification va être envoyée suite à une détection des caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerNotification)}`);
                this.notify(snapshotsFromCamerasWhichCanTriggerNotification);
            }
        });
    }

    turnLightOn() {
        this.turnHueLightOn();
        this.turnFloorLampLightOn();
    }

    private turnFloorLampLightOn() {

    }

    private turnHueLightOn() {
        this.hue.setState(lamps.salon, {
            on: true,
            bri: 255,
            rgb: [255, 255, 255]
        });
        setTimeout(
            () => {
                this.hue.setState(lamps.salon, {
                    on: false
                });
            },
            2 * 60 * 1000
        );
    }

    speak() {
        this.googleHome.say("Il y a quelqu'un dehors, appelle la police !");
    }

    notify(snapshots: Snapshot[]) {
        this.notifier.send({
            title: `${snapshots.length} détection(s) de présence`,
            description: `<p>Présence détectée sur les caméras suivantes :</p>${new HTML().formatList(this.getCameraNamesFromSnapshots(snapshots))}`,
            attachments: _.map(snapshots, 'path')
        });
    }
    private getCameraNamesFromSnapshots(snapshots: Snapshot[]): string[] {
        return _.uniq(_.map(snapshots, 'camera.label'));
    }
}

new Cerberos().watch();