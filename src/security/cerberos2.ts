import {PresenceDetector} from "./cctv/presence-detector";
import {Snapshot} from "./cctv/snapshot";
import * as _ from "lodash";
import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {MailService} from "../notifications/services/mailService";
import {HTML} from "../common/html";
import * as yargs from 'yargs';
import {Logger} from "../common/logger/logger";
import {TocToc} from "../toctoc/toctoc";
import {HueLamp} from "../hue/hue-lamp";
import * as watch from 'node-watch';
import {Configuration} from "../configuration/configuration";

export class Cerberos2 {
    presenceDetector: PresenceDetector;
    googleHome: GoogleHomeService;
    notifier: MailService;
    nLastMinutes: number;
    logger: Logger;
    toctoc: TocToc;
    lampSalon: HueLamp;
    configuration: Configuration;

    constructor() {
        this.nLastMinutes = yargs.argv.nLastMinutes ? yargs.argv.nLastMinutes : 2;
        this.presenceDetector = new PresenceDetector();
        this.googleHome = new GoogleHomeService();
        let service = 'Cerberos';
        this.notifier = new MailService(service);
        this.logger = new Logger(service);
        this.toctoc = new TocToc();
        this.lampSalon = new HueLamp('salon');
        this.configuration = new Configuration();
    }

    coucou() {

        this.configuration.cameras.forEach(camera => {
            watch(
                camera.snapshotPath,
                {recursive: true},
                (evt, name) => {
                    this.logger.debug(`La caméra ${camera.label} vient de détecter quelquechose (${name}\n${evt}).`);
                }
            );
        });


        /* let snapshots = this.presenceDetector.getSnapshotForNLastMinutes(this.nLastMinutes);
         let snapshotsFromCamerasWhichCanTriggerLight = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerLight);
         let snapshotsFromCamerasWhichCanTriggerVoice = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerVoice);
         let snapshotsFromCamerasWhichCanTriggerNotification = _.filter(snapshots, (snapshot) => snapshot.camera.canTriggerNotification);

         if(snapshotsFromCamerasWhichCanTriggerLight.length > 0 || snapshotsFromCamerasWhichCanTriggerVoice.length > 0 || snapshotsFromCamerasWhichCanTriggerNotification.length > 0) {
             this.logger.debug('Il y a des photos à traiter');
             this.toctoc.updatePresence().then(() => {
                 this.toctoc.ifAbsent(() => {
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
             });
         } else {
             this.logger.debug(`Il n'y a aucune photo à traiter`);
         }*/
    }

    turnLightOn() {
        this.turnHueLightOn();
        this.turnFloorLampLightOn();
    }

    private turnFloorLampLightOn() {

    }

    private turnHueLightOn() {
        this.lampSalon.setState({
            on: true,
            bri: 255,
            rgb: [255, 255, 255]
        });
        setTimeout(
            () => {
                this.lampSalon.off();
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

new Cerberos2().coucou();