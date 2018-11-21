import {RequestOptions} from "http";
import {Configuration} from "../../../configuration/configuration";
import * as _ from "lodash";

export abstract class AbstractClientAPI {
    configuration: Configuration;

    protected constructor() {
        this.configuration = new Configuration();
    }

    get defaultRequestOptions(): RequestOptions {
        let systemUser = _.find(this.configuration.api.users, {name: 'System'});
        return {
            hostname: '192.168.1.52',
            port: this.configuration.api.port,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${new Buffer(`${systemUser.name}:${systemUser.token}`, 'utf8').toString("base64")}`
            }
        };
    }
}