import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {IRoutable} from "./routes";
import {SetPointDB} from "../../../thermospi/db/SetPointDB";
import {Thermostat} from "../../../thermospi/thermostat";
import {GoogleHomeService} from "../../../notifications/services/googleHomeService";
import {ISetPoint} from "../../../thermospi/models/setpoint";
import {TemperatureDB} from "../../../thermospi/db/TemperatureDB";
import * as _ from "lodash";

export class ThermospiRoutes implements IRoutable {

    setPointDB: SetPointDB;
    temperatureDB: TemperatureDB;
    thermostat: Thermostat;
    googleHomeService: GoogleHomeService;

    constructor() {
        this.setPointDB = new SetPointDB();
        this.temperatureDB = new TemperatureDB();
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
            )
            .get(
                '/thermostat/temperatures',
                (req: Request, res: Response) => {
                    Promise.all([
                        this.temperatureDB.getCurrentInsideTemperature(),
                        this.temperatureDB.getCurrentOutsideTemperature(),
                        this.setPointDB.getCurrentSetPoint()
                    ]).then((temperatures) => {
                        let currentInsideTemperature = temperatures[0];
                        let currentOutsideTemperature = temperatures[1];
                        let currentSetPoint = temperatures[2];

                        this.googleHomeService.say(`Actuellement, il fait ${_.round(currentInsideTemperature, 1)}°C à l'intérieur de la maison, ${_.round(currentOutsideTemperature, 1)}°C à l'extérieur et la consigne du chauffage est réglée à ${_.round(currentSetPoint.value, 1)}°C.`);

                        res.send({
                            inside: currentInsideTemperature,
                            outside: currentOutsideTemperature,
                            setPoint: currentSetPoint.value
                        });
                    });
                }
            );
    }
}