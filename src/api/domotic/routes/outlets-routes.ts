import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {RFXcom} from "../../../rfxcom/RFXcom";
import {IRoutable} from "./routes";

let rfxcom = require('rfxcom');

export class OutletsRoutes implements IRoutable {
    public routes(router: core.Router): void {
        router
            .post(
                '/outlet/:id',
                (req: Request, res: Response) => {
                    let state = Boolean(req.body.state);
                    let id = req.params.id;
                }
            );
    }
}