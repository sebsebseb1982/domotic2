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
import * as fswatch from 'node-watch';
import {Configuration} from "../configuration/configuration";
import * as fs from "fs";

export class Cerberos2 {
    presenceDetector: PresenceDetector;
    googleHome: GoogleHomeService;
    notifier: MailService;
    nLastMinutes: number;
    logger: Logger;
    toctoc: TocToc;
    lampSalon: HueLamp;
    configuration: Configuration;
    snapshots: Snapshot[] = [];

    constructor() {
        this.nLastMinutes = yargs.argv.nLastMinutes ? yargs.argv.nLastMinutes : 2;
        this.presenceDetector = new PresenceDetector();
        this.googleHome = new GoogleHomeService();
        let service = 'Cerberos';
        this.notifier = new MailService(service);
        this.logger = new Logger(service);
        this.toctoc = new TocToc();
        this.lampSalon = new HueLamp('salon', service);
        this.configuration = new Configuration();
    }


    watch() {

        let debounceWait = 10 * 1000;

        let speakDebounced = _.debounce(
            this.speak.bind(this),
            debounceWait
        );

        let notifyDebounced = _.debounce(
            this.notify.bind(this),
            debounceWait
        );

        let turnLightOnDebounced = _.debounce(
            this.turnLightOn.bind(this),
            debounceWait
        );

        this.configuration.cameras.forEach(camera => {
            fswatch(
                camera.snapshotPath,
                {
                    recursive: true,
                    filter: /\.jpg$/
                },
                (evt, snapshotPath) => {
                    if (evt == 'update') {
                        this.logger.debug(`La caméra ${camera.label} vient de détecter quelquechose (${snapshotPath}).`);

                        this.snapshots.push({
                            camera: camera,
                            path: snapshotPath,
                            date: fs.statSync(snapshotPath).birthtime
                        });

                        if (camera.canTriggerLight) {
                            turnLightOnDebounced();
                        }

                        if (camera.canTriggerNotification) {
                            notifyDebounced();
                        }

                        if (camera.canTriggerVoice) {
                            speakDebounced();
                        }
                    }
                }
            );
        });
    }

    turnLightOn() {
        this.executeIfAbsent(() => {
            this.turnHueLightOn();
            this.turnFloorLampLightOn();
        });
    }

    private turnFloorLampLightOn() {

    }

    private turnHueLightOn() {
        this.logger.info(`Allumage lumière pour simuler une présence`);
        this.lampSalon.setState({
            on: true,
            bri: 254,
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
        this.executeIfAbsent(() => {
            this.googleHome.say("Il y a quelqu'un dehors, appelle la police !");
        });
    }

    notify() {
        this.executeIfAbsent(
            () => {
                this.logger.info(`Envoi par mail de ${this.snapshots.length} photo(s).`);
                this.notifier.send({
                    title: `${this.snapshots.length} détection(s) de présence`,
                    description: `<p>Présence détectée sur les caméras suivantes :</p>${new HTML().formatList(this.getCameraNamesFromSnapshots(this.snapshots))}`,
                    attachments: _.map(this.snapshots, 'path')
                });
                this.snapshots = [];
            },
            () => {
                this.snapshots = [];
            }
        );
    }

    executeIfAbsent(ifCallback: Function, elseCallback?: Function): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.toctoc.updatePresence().then(() => {
                this.toctoc.ifAbsent(ifCallback, elseCallback);
            });
        });
    }

    private getCameraNamesFromSnapshots(snapshots: Snapshot[]): string[] {
        return _.uniq(_.map(snapshots, 'camera.label'));
    }
}

new Cerberos2().watch();