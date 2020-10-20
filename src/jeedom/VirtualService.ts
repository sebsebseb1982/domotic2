import {RequestOptions} from "http";
import * as request from "request";
import {Configuration} from "../configuration/configuration";
import {Virtual} from "./virtual";
import {Logger} from "../common/logger/logger";

export class VirtualService {

    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('Virtual Service');
    }

    updateVirtual(virtual:Virtual, value:any) {
        this.logger.info(`Mise à jour du virtual Jeedom ${virtual.name} (ID=${virtual.id}) avec la valeur ${value}`);
        let options: RequestOptions = {
            protocol: 'http',
            host: this.configuration.jeedom.hostname,
            port: this.configuration.jeedom.port,
            path: `/core/api/jeeApi.php?plugin=virtual&apikey=${this.configuration.jeedom.apiKey}&type=virtual&id=${virtual.id}&value=${value}`
        };
        request.get(
            {
                uri: `${options.protocol}://${options.host}:${options.port}${options.path}`
            },
            (error, response: request.Response) => {
                if (error || response.statusCode !== 200) {
                    this.logger.error(`Erreur lors de la mise à jour du virtual Jeedom ${virtual.name}`, error);
                }
            }
        );
    }
}