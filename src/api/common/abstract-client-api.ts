import {RequestOptions} from "http";
import * as _ from "lodash";
import {Configuration} from "../../configuration/configuration";

export abstract class AbstractClientAPI {
    configuration: Configuration;

    protected constructor() {
        this.configuration = new Configuration();
    }

    get domoticAPIRequestOptions(): RequestOptions {
        let systemUser = _.find(this.configuration.api.users, {name: 'System'});
        return {
            hostname: '192.168.1.52',
            port: this.configuration.api.port,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${systemUser.name}:${systemUser.token}`, 'utf8').toString("base64")}`
            }
        };
    }

    get randomTuneAPIRequestOptions(): RequestOptions {
        let systemUser = _.find(this.configuration.api.users, {name: 'System'});
        return {
            hostname: '192.168.1.52',
            port: this.configuration.doorBell.randomTune.port,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${systemUser.name}:${systemUser.token}`, 'utf8').toString("base64")}`
            }
        };
    }
}