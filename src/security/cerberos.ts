import {PresenceDetector} from "./cctv/presence-detector";
import {Snapshot} from "./cctv/snapshot";
import * as _ from "lodash";

export class Cerberos {
    presenceDetector: PresenceDetector;

    constructor() {
        this.presenceDetector = new PresenceDetector();
        this.watch();
    }

    watch() {
        let snapshots = this.presenceDetector.getSnapshotForNLastMinutes(999999);
        let snapshotsFromCamerasWhichCanTriggerLight = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerLight);
        let snapshotsFromCamerasWhichCanTriggerVoice = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerVoice);
        let snapshotsFromCamerasWhichCanTriggerNotification = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerNotification);

        if(snapshotsFromCamerasWhichCanTriggerLight.length > 0) {
            console.log(`La lumière va être allumée par les caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerLight)}`);
            this.turnLightOn();
        }

        if(snapshotsFromCamerasWhichCanTriggerVoice.length > 0) {
            console.log(`La parole va être activée par les caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerVoice)}`);
            this.speak();
        }

        if(snapshotsFromCamerasWhichCanTriggerNotification.length > 0) {
            console.log(`Une notification va être envoyée suite à une détection des caméras suivantes: ${this.getCameraNamesFromSnapshots(snapshotsFromCamerasWhichCanTriggerNotification)}`);
            this.notify(snapshotsFromCamerasWhichCanTriggerNotification);
        }
    }

    turnLightOn() {

    }

    speak() {

    }

    notify(snapshots: Snapshot[]) {

    }

    private getCameraNamesFromSnapshots(snapshots: Snapshot[]): String[] {
        return _.uniq(_.map(snapshots, 'camera.label'));
    }
}