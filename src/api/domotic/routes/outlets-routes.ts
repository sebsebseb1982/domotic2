import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {RFXcom} from "../../../rfxcom/RFXcom";

let rfxcom = require('rfxcom');

export class OutletsRoutes {
    public routes(router: core.Router): void {
        router
            .get(
                '/on',
                (req: Request, res: Response) => {
                    let lighting1 = new rfxcom.Lighting1(RFXcom.getInstance(), rfxcom.lighting1.ENERGENIE_5_GANG);
                    lighting1.switchOn('A1');

                    res.status(200).send({
                        message: 'GET request successfulll!!!!'
                    })
                }
            ).get(
            '/off',
            (req: Request, res: Response) => {
                let lighting1 = new rfxcom.Lighting1(RFXcom.getInstance(), rfxcom.lighting1.ENERGENIE_5_GANG);
                lighting1.switchOff('A1');

                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            }
        )
    }
}