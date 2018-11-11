import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";
import {SetPointDB} from "../../../thermospi/db/SetPointDB";
import {Thermostat} from "../../../thermospi/thermostat";

export class ThermospiRoutes implements IRoutable {

    setPointDB: SetPointDB;
    thermostat: Thermostat;

    constructor() {
        this.setPointDB = new SetPointDB();
        this.thermostat = new Thermostat();
    }

    public routes(router: core.Router): void {
        router
            .put(
                '/thermostat/setpoint',
                (req: Request, res: Response) => {
                    let temperatureDelta = parseFloat(req.body.value);
                    this.setPointDB.increment(temperatureDelta);
                    this.thermostat.update();
                }
            );
    }
}