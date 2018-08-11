import {Configuration} from "../configuration/configuration";
import {Logger} from "../common/logger/logger";

let http = require('http');

export class SurveillanceStation {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger('Surveillance Station');
    }

    setHomeMode(state) {
        this.getSid()
            .then((sid) => {
                let options = {
                    hostname: this.configuration.synology.hostname,
                    port: this.configuration.synology.port,
                    path: `/webapi/entry.cgi?api=SYNO.SurveillanceStation.HomeMode&version=1&method=Switch&on=${state ? 'true' : 'false'}&_sid=${sid}`,
                    method: 'GET'
                };

                let req = http.request(options);
                req.end();
            });
    }

    private getSid() {
        return new Promise((resolve, reject) => {
            let options = {
                hostname: this.configuration.synology.hostname,
                port: this.configuration.synology.port,
                path: `/webapi/auth.cgi?api=SYNO.API.Auth&method=Login&version=3&account=${this.configuration.synology.user}&passwd=${this.configuration.synology.password}&session=SurveillanceStation&format=sid`,
                method: 'GET'
            };

            let req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (body) {
                    resolve(JSON.parse(body).data.sid);
                });
            });
            req.on('error', function(err) {
                this.logger.error('Erreur lors de la récupération du SID pour Surveillance Station', err);
                reject(err);
            });
            req.end();
        });
    }
}