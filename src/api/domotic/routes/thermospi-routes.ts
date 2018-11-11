import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";
import {SetPointDB} from "../../../thermospi/db/SetPointDB";
import {Thermostat} from "../../../thermospi/thermostat";
import {GoogleHomeService} from "../../../notifications/services/googleHomeService";
import {ISetPoint} from "../../../thermospi/models/setpoint";

export class ThermospiRoutes implements IRoutable {

    setPointDB: SetPointDB;
    thermostat: Thermostat;
    googleHomeService: GoogleHomeService;

    constructor() {
        this.setPointDB = new SetPointDB();
        this.thermostat = new Thermostat();
        this.googleHomeService = new GoogleHomeService();
    }

    public routes(router: core.Router): void {
        router
            .put(
                '/thermostat/setpoint',
                (req: Request, res: Response) => {
                    let temperatureDelta = parseFloat(req.body.value);
                    this.setPointDB.increment(temperatureDelta).then((newSetPoint: ISetPoint) => {
                        this.googleHomeService.say(`La consigne du chauffage est à ${newSetPoint.value}°C`);
                    });
                    this.thermostat.update();
                }
            );
    }
}