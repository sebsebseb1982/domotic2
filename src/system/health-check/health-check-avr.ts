import {DenonAVR, IAVRStatus} from "../../avr/denonAVR";
import {IApplianceStatus} from "./IApplianceStatus";
import {Logger} from "../../common/logger/logger";

export class HealthCheckAVR {
    logger: Logger;

    constructor(private avr: DenonAVR) {
        this.logger = new Logger('Health Check AVR');
    }

    getStatus(): Promise<IApplianceStatus<DenonAVR>> {
        return new Promise<IApplianceStatus<DenonAVR>>((resolve, reject) => {
            this.avr.getStatus().then(
                (status: IAVRStatus) => {
                    resolve({
                        appliance: this.avr,
                        status: true
                    })
                },
                () => {
                    resolve({

                        appliance: this.avr,
                        status: false
                    })
                });
        });

    }
}