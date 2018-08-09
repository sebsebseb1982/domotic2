import {IApplianceStatus} from "./IApplianceStatus";
import {GenericAppliance} from "../../common/appliance";

let ping = require('ping');

export class HealthCheckPing {
    constructor(private label: string, private hostname: string) {
    }

    getStatus(): Promise<IApplianceStatus<GenericAppliance>> {
        return new Promise<IApplianceStatus<GenericAppliance>>((resolve, reject) => {
            ping.sys.probe(this.hostname, (isAlive: boolean) => {
                resolve({
                    appliance: {
                        label: this.label
                    },
                    status:isAlive
                })
            });
        });
    }
}