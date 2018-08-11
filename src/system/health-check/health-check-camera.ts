import {Camera} from "../../security/cctv/camera";
import * as http from 'http';
import {RequestOptions} from "http";
import {IApplianceStatus} from "./IApplianceStatus";
import {Logger} from "../../common/logger/logger";

export class HealthCheckCamera {

    logger: Logger;

    constructor(private camera: Camera) {
        this.logger = new Logger('Health Check');
    }

    getStatus(): Promise<IApplianceStatus<Camera>> {
        return new Promise<IApplianceStatus<Camera>>((resolve, reject) => {
            let options: RequestOptions = {
                host: this.camera.hostname,
                port: this.camera.port,
                path: this.camera.stillImagePath,
                headers: {
                    'Authorization': 'Basic ' + new Buffer(this.camera.user + ':' + this.camera.password).toString('base64')
                }
            };
            this.logger.debug(`Test de la caméra ${this.camera.label} sur l'url http://${this.camera.hostname}:${this.camera.port}${this.camera.stillImagePath}`);
            http.get(options, (response) => {
                if (response.statusCode === 200) {
                    resolve({
                        appliance: this.camera,
                        status: true
                    });
                }else {
                    resolve({
                        appliance: this.camera,
                        status: false
                    });
                }
            }).on('error', (e) => {
                resolve({
                    appliance: this.camera,
                    status: false
                });
            });
        });
    }
}