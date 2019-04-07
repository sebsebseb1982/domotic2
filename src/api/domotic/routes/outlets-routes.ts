import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {Logger} from "../../../common/logger/logger";
import {PowerOutletDB} from "../../../power-outlet/power-outlet-db";
import {IRoutable} from "../../common/routes";

export class OutletsRoutes implements IRoutable {

    db: PowerOutletDB;
    logger: Logger;

    constructor() {
        this.db = new PowerOutletDB();
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