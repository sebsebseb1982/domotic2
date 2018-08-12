import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";

export class ThermospiRoutes implements IRoutable {
    public routes(router: core.Router): void {
        router
            .post(
                '/thermostat/setpoint',
                (req: Request, res: Response) => {
                    let setPoint = parseFloat(req.body.value);
                }
            )
            .put(
                '/thermostat/setpoint',
                (req: Request, res: Response) => {
                    let setPoint = parseFloat(req.body.value);
                }
            );
    }
}