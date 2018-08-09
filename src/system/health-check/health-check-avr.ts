import {DenonAVR, IAVRStatus} from "../../avr/denonAVR";
import {IApplianceStatus} from "./IApplianceStatus";

export class HealthCheckAVR {


    constructor(private avr: DenonAVR) {}

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