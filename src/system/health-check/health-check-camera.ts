import {Camera} from "../../security/cctv/camera";
import * as http from 'http';
import {RequestOptions} from "http";
import {Status} from "./status";

export class HealthCheckCamera {

    constructor(private camera: Camera) {
    }

    getStatus(): Promise<Status<Camera>> {
        return new Promise<Status<Camera>>((resolve, reject) => {
            let options: RequestOptions = {
                host: this.camera.hostname,
                port: this.camera.port,
                path: this.camera.stillImagePath,
                headers: {
                    'Authorization': 'Basic ' + new Buffer(this.camera.user + ':' + this.camera.password).toString('base64')
                }
            };
            http.get(options, (response) => {
                if (response.statusCode === 200) {
                    console.log(`${this.camera.label}:true`);
                    resolve({
                        appliance: this.camera,
                        status: true
                    });
                }else {
                    console.log(`${this.camera.label}:false`);
                    resolve({
                        appliance: this.camera,
                        status: false
                    });
                }
            }).on('error', (e) => {
                console.log(`${this.camera.label}:false`);
                resolve({
                    appliance: this.camera,
                    status: false
                });
            });
        });
    }
}