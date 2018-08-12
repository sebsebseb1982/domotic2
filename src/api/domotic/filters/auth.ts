import {Request, Response} from "express";
import {Logger} from "../../../common/logger/logger";
import * as core from "express-serve-static-core";
import {Configuration} from "../../../configuration/configuration";
import * as _ from "lodash";
import auth = require("basic-auth");

export class Auth {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.logger = new Logger('Authentification API');
        this.configuration = new Configuration();
    }

    public filter(router: core.Router): void {
        router.use((req: Request, res: Response, next) => {
            let credentials = auth(req);

            if (credentials) {
                let user = _.find(this.configuration.api.users, {name: credentials.name, token: credentials.pass});
                if (user) {
                    this.logger.info(`Un appel API été réalisé sur ${req.path} (user=${credentials.name},user-agent=${req.headers['user-agent']})`)
                    next();
                } else {
                    this.logger.error('Appel API frauduleux', `Un appel API frauduleux été réalisé sur ${req.path} (user=${credentials.name},password=${credentials.pass},user-agent=${req.headers['user-agent']})`);
                    res.sendStatus(401);
                }
            } else {
                this.logger.error('Appel API non authentifié', `Un appel API non authentifié été réalisé sur ${req.path} (user-agent=${req.headers['user-agent']})`);
                res.sendStatus(401);
            }
        });
    }
}