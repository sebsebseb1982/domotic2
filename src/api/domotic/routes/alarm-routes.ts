import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";
import {Alarm} from "../../../security/alarm/alarm";

export class AlarmRoutes implements IRoutable {

    alarm: Alarm;

    constructor() {
        this.alarm = new Alarm();
    }

    public routes(router: core.Router): void {
        router
            .post(
                '/alarm',
                (req: Request, res: Response) => {
                    this.alarm.arm();
                }
            );
    }
}