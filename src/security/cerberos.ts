import {PresenceDetector} from "./cctv/presence-detector";
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


        console.log(`Can trigger light: ${snapshotsFromCamerasWhichCanTriggerLight.length}`);
        console.log(`Can trigger voice: ${snapshotsFromCamerasWhichCanTriggerVoice.length}`);
        console.log(`Can trigger notification: ${snapshotsFromCamerasWhichCanTriggerNotification.length}`);
    }
}