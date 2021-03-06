import * as http from "http";
import {RequestOptions} from "http";
import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";
import {AbstractClientAPI} from "../common/abstract-client-api";

export class ClientPowerOutlet extends AbstractClientAPI {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        super();
        this.configuration = new Configuration();
        this.logger = new Logger('ClientPowerOutlet RFXcom');
    }

    setState(powerOutletCode: string, state: boolean) {
        let options: RequestOptions = {
            ...{
                path: `${this.configuration.api.root}/outlet/${powerOutletCode}`,
                method: 'POST'
            },
            ...this.domoticAPIRequestOptions
        };
        let errorMessage = `Impossible de passer la prise (code=${powerOutletCode}) à l'état ${state}.`;
        let request = http.request(options, (response) => {
            if (response.statusCode !== 200) {
                this.logger.error(errorMessage, errorMessage);
            } else {
                this.logger.info(`Prise '${powerOutletCode}' passée à l'état ${state}`);
            }
        });
        request.on('error', (e) => {
            this.logger.error(e.name, `${e.message}\n${e.stack}`);
        });
        request.write(`{"state":${state}}`);
        request.end();
    }

    on(powerOutletCode: string) {
        this.setState(powerOutletCode, true);
    }

    off(powerOutletCode: string) {
        this.setState(powerOutletCode, false);
    }

    impulse(powerOutletCode: string, durationInMs: number) {
        this.on(powerOutletCode);
        setTimeout(
            () => {
                this.off(powerOutletCode);
            },
            durationInMs
        )
    }
}