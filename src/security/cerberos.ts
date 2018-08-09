import {PresenceDetector} from "./cctv/presence-detector";
import {Snapshot} from "./cctv/snapshot";
import * as _ from "lodash";
import {HueLampManager} from "../hue/hueLampManager";
import {lamps} from "../hue/hue-lamps";
import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {MailService} from "../notifications/services/mailService";
import {HTML} from "../common/html";

export class Cerberos {
    presenceDetector: PresenceDetector;
    hue: HueLampManager;
    googleHome: GoogleHomeService;
    notifier: MailService;

    constructor() {
        this.presenceDetector = new PresenceDetector();
        this.hue = new HueLampManager();
        this.googleHome = new GoogleHomeService();
        this.notifier = new MailService('CCTV');
        this.watch();
    }

    watch() {
        let snapshots = this.presenceDetector.getSnapshotForNLastMinutes(5);
        let snapshotsFromCamerasWhichCanTriggerLight = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerLight);
        let snapshotsFromCamerasWhichCanTriggerVoice = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerVoice);
        let snapshotsFromCamerasWhichCanTriggerNotification = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerNotification);

        if (snapshotsFromCamerasWhichCanTriggerLight.length > 0) {
            console.log(`La lumière va être allumée par les caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerLight)}`);
            this.turnLightOn();
        }

        if (snapshotsFromCamerasWhichCanTriggerVoice.length > 0) {
            console.log(`La parole va être activée par les caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerVoice)}`);
            this.speak();
        }

        if (snapshotsFromCamerasWhichCanTriggerNotification.length > 0) {
            console.log(`Une notification va être envoyée suite à une détection des caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerNotification)}`);
            this.notify(snapshotsFromCamerasWhichCanTriggerNotification);
        }
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
        this.googleHome.say("Je crois qu'il y a quelqu'un dehors, appelle la police !");
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