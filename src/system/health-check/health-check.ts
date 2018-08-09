import {MailService} from "../../notifications/services/mailService";
import * as _ from "lodash";
import {Configuration} from "../../configuration/configuration";
import {HealthCheckCamera} from "./health-check-camera";
import {HTML} from "../../common/html";
import {IApplianceStatus} from "./IApplianceStatus";
import {Camera} from "../../security/cctv/camera";
import {HealthCheckAVR} from "./health-check-avr";
import {DenonAVR} from "../../avr/denonAVR";
import {IAppliance} from "../../common/appliance";

export class HealthCheck {
    mail: MailService;
    configuration: Configuration;

    constructor() {
        this.mail = new MailService('Health Check');
        this.configuration = new Configuration();
        this.start();
    }

    private start() {

        // Raspberry Pi Cabanon
        // Bridge Hue
        // NAS
        // Alarme
        // Google Home


        Promise
            .all([
                    this.getUnhealthyCameras(),
                    this.getUnhealthyAVR()
                ]
            )
            .then((promisesResults) => {
                let unhealthyAppliances = _.flatten(promisesResults)
                if(!_.isEmpty(unhealthyAppliances)) {
                    this.mail.send({
                        title: `${unhealthyAppliances.length} appareil(s) défectueux`,
                        description: `<p>Le(s) appareil(s) suivants sont défectueux :</p>${new HTML().formatList(_.map(unhealthyAppliances, 'label'))}`
                    })
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
}