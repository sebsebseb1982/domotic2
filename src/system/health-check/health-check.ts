import * as _ from "lodash";
import {Configuration} from "../../configuration/configuration";
import {HealthCheckCamera} from "./health-check-camera";
import {HTML} from "../../common/html";
import {IApplianceStatus} from "./IApplianceStatus";
import {Camera} from "../../security/cctv/camera";
import {HealthCheckAVR} from "./health-check-avr";
import {DenonAVR} from "../../avr/denonAVR";
import {GenericAppliance, IAppliance} from "../../common/appliance";
import {HealthCheckPing} from "./health-check-ping";
import {Logger} from "../../common/logger/logger";

export class HealthCheck {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.logger = new Logger('Health Check');
        this.configuration = new Configuration();
        this.start();
    }

    private start() {
        Promise
            .all([
                    this.getUnhealthyCameras(),
                    this.getUnhealthyAVR(),
                    this.getUnhealthyPingableAppliance('Google Home', this.configuration.googleHome.hostname),
                    this.getUnhealthyPingableAppliance('Raspberry Pi Cabanon', '192.168.1.50'),
                    //this.getUnhealthyPingableAppliance('Bridge Hue', this.configuration.hue.),
                    this.getUnhealthyPingableAppliance('Synology DS416play', this.configuration.synology.hostname),
                    this.getUnhealthyPingableAppliance('Alarme', this.configuration.alarm.hostname)
                ]
            )
            .then((promisesResults) => {
                let unhealthyAppliances = _.flatten(promisesResults);
                this.logger.debug(`${unhealthyAppliances.length} appareil(s) défectueux`);
                if(!_.isEmpty(unhealthyAppliances)) {
                    this.logger.warn(
                        `${unhealthyAppliances.length} appareil(s) défectueux`,
                        `<p>Le(s) appareil(s) suivants sont défectueux :</p>${new HTML().formatList(_.map(unhealthyAppliances, 'label'))}`
                    )
                }
            });
    }

    private getUnhealthyCameras(): Promise<IAppliance[]> {
        return new Promise<IAppliance[]>((resolve, reject) => {
            Promise
                .all(_.map(this.configuration.cameras, (camera) => {
                    return new HealthCheckCamera(camera).getStatus();
                }))
                .then((statuses: IApplianceStatus<Camera>[]) => {
                    resolve(
                        _.map(
                            _.filter(statuses, {status: false}),
                            'appliance'
                        )
                    );
                });
        });
    }

    private getUnhealthyAVR(): Promise<IAppliance[]> {
        return new Promise<IAppliance[]>((resolve, reject) => {
            new HealthCheckAVR(new DenonAVR(this.configuration.avr)).getStatus().then((status: IApplianceStatus<DenonAVR>) => {
                if (status.status) {
                    resolve([]);
                } else {
                    resolve([status.appliance]);
                }
            });
        });
    }

    private getUnhealthyPingableAppliance(label:string, hostname:string): Promise<IAppliance[]> {
        return new Promise<IAppliance[]>((resolve, reject) => {
            new HealthCheckPing(label, hostname).getStatus().then((status: IApplianceStatus<GenericAppliance>) => {
                if (status.status) {
                    resolve([]);
                } else {
                    resolve([status.appliance]);
                }
            })
        });
    }
}