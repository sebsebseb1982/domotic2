import {MailService} from "../../notifications/services/mailService";
import * as _ from "lodash";
import {Configuration} from "../../configuration/configuration";
import {HealthCheckCamera} from "./health-check-camera";
import {HTML} from "../../common/html";
import {Status} from "./status";
import {Camera} from "../../security/cctv/camera";

export class HealthCheck {
    mail: MailService;
    confifuration: Configuration;

    constructor() {
        this.mail = new MailService('Health Check');
        this.confifuration = new Configuration();
        this.start();
    }

    private start() {

        // Raspberry Pi Cabanon
        // Bridge Hue
        // NAS
        // AVR
        // Alarme
        this.getUnhealthyCameras().then((unhealthyCameras) => {
            if(!_.isEmpty(unhealthyCameras)) {
                console.log(`Il y a ${unhealthyCameras.length} appareil(s) défectueux`);
                console.log(unhealthyCameras);
                this.mail.send({
                    title: `${unhealthyCameras.length} appareil(s) défectueux`,
                    description: `<p>Le(s) appareil(s) suivants sont défectueux :</p>${new HTML().formatList(unhealthyCameras)}`
                })
            }
        });
    }

    private getUnhealthyCameras(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            Promise
                .all(_.map(this.confifuration.cameras, (camera) => {
                    return new HealthCheckCamera(camera).getStatus();
                }))
                .then((statuses: Status<Camera>[]) => {
                    resolve(
                        _.map(
                            _.filter(statuses, {status: false}),
                            'appliance.label'
                        )
                    );
                });
        });
    }
}