import * as core from "express-serve-static-core";
import {Request, Response} from "express";
import {Logger} from "../../../common/logger/logger";
import {IRoutable} from "../../common/routes";

export class HealthRoutes implements IRoutable {

    logger: Logger;

    constructor() {
        this.logger = new Logger(`Health endpoint`);
    }

    routes(router: core.Router): void {
        router
            .get(
                '/health',
                (req: Request, res: Response) => {
                                res.sendStatus(200);
                }
            );
    }
}