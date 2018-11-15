import * as http from "http";
import {RequestOptions} from "http";
import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import * as _ from "lodash";

export class ClientAPIDomotic {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('ClientAPIDomotic RFXcom');
    }

    setPowerOutletState(powerOutletCode: string, state: boolean) {
        let systemUser = _.find(this.configuration.api.users, {name: 'System'});
        let options: RequestOptions = {
            hostname: '192.168.1.52',
            port: this.configuration.api.port,
            path: `${this.configuration.api.root}/outlet/${powerOutletCode}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${new Buffer(`${systemUser.name}:${systemUser.token}`, 'utf8').toString("base64")}`
            }
        };
        let errorMessage = `Impossible de passer la prise (code=${powerOutletCode}) à l'état ${state}.`;
        let request = http.request(options, (response) => {
            if (response.statusCode !== 200) {
                this.logger.error(errorMessage, errorMessage);
            }
        });
        request.on('error', (e) => {
            this.logger.error(e.name, `${e.message}\n${e.stack}`);
        });
        request.write(`{"state":${state}}`);
        request.end();
    }
}