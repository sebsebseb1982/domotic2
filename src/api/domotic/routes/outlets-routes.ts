import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {RFXcom} from "../../../rfxcom/RFXcom";
import {IRoutable} from "./routes";
import {DB} from "../../../power-outlet/db";
import {Logger} from "../../../common/logger/logger";

let rfxcom = require('rfxcom');

export class OutletsRoutes implements IRoutable {

    db: DB;
    logger: Logger;

    constructor() {
        this.db = new DB();
        this.logger = new Logger('Endpoint prises connectées');
    }

    public routes(router: core.Router): void {
        router
            .post(
                '/outlet/:code',
                (req: Request, res: Response) => {
                    let state = Boolean(req.body.state);
                    let code = req.params.code;

                    this.logger.debug(`/outlet/${code} state=${state}`);
                    console.log(req.body);

                    this.db.getByCode(code).then((powerOutlet) => {
                       powerOutlet.setState(state);
                       res.sendStatus(200);
                    });
                }
            );
    }
}