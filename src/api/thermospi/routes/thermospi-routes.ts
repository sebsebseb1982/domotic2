import {Request, Response} from "express";
import * as core from "express-serve-static-core";
import {SetPointDB} from "../../../thermospi/db/SetPointDB";
import {Thermostat} from "../../../thermospi/thermostat";
import {GoogleHomeService} from "../../../notifications/services/googleHomeService";
import {ISetPoint} from "../../../thermospi/models/setpoint";
import {TemperatureDB} from "../../../thermospi/db/TemperatureDB";
import * as _ from "lodash";
import {Logger} from "../../../common/logger/logger";
import {IRoutable} from "../../common/routes";
import {SensorTag} from "../../../sensors/sensor";

export class ThermospiRoutes implements IRoutable {

    setPointDB: SetPointDB;
    temperatureDB: TemperatureDB;
    thermostat: Thermostat;
    googleHomeService: GoogleHomeService;
    logger: Logger;

    constructor() {
        this.setPointDB = new SetPointDB();
        this.temperatureDB = new TemperatureDB();
        this.thermostat = new Thermostat();
        this.googleHomeService = new GoogleHomeService();
        this.logger = new Logger("Thermospi routes");
    }

    public routes(router: core.Router): void {
        router
            .put(
                '/thermostat/setpoint',
                (req: Request, res: Response) => {
                    this.logger.debug(`req.body=${JSON.stringify(req.body)}`);
                    let temperatureDelta = parseFloat(req.body.delta);
                    this.setPointDB.increment(temperatureDelta).then((newSetPoint: ISetPoint) => {
                        let message = `La consigne du chauffage est à ${newSetPoint.value}°C`;
                        this.googleHomeService.say(message);
                        this.thermostat.update();

                        res.status(200).send({
                            message: message
                        });
                    });
                }
            )
            .post(
                '/thermostat/setpoint',
                (req: Request, res: Response) => {
                    this.logger.debug(`req.body=${JSON.stringify(req.body)}`);
                    let temperature = parseFloat(req.body.value);
                    this.setPointDB.addSetPoint(temperature).then(() => {
                        let message = `La consigne du chauffage est à ${temperature}°C`;
                        this.googleHomeService.say(message);
                        this.thermostat.update();

                        res.status(200).send({
                            message: message
                        });
                    });
                }
            )
            .get(
                '/thermostat/temperatures',
                (req: Request, res: Response) => {
                    Promise.all([
                        this.temperatureDB.getCurrentInsideTemperatures(),
                        this.temperatureDB.getCurrentOutsideTemperature(),
                        this.setPointDB.getCurrentSetPoint()
                    ]).then((temperatures) => {
                        let currentInsideTemperatures = temperatures[0];
                        let currentOutsideTemperature = temperatures[1];
                        let currentSetPoint = temperatures[2];

                        this.googleHomeService.say(`Actuellement, il fait ${_.round(currentInsideTemperatures[0], 1)}°C au rez-de-chaussée, ${_.round(currentInsideTemperatures[1], 1)}°C à l'étage, ${_.round(currentOutsideTemperature, 1)}°C à l'extérieur et la consigne du chauffage est réglée à ${_.round(currentSetPoint.value, 1)}°C.`);

                        res.send({
                            inside: currentInsideTemperatures,
                            outside: currentOutsideTemperature,
                            setPoint: currentSetPoint.value
                        });
                    });
                }
            )
            .get(
                '/temperatures',
                (req: Request, res: Response) => {
                    let sensorTags: SensorTag[] = _.split(req.query.sensorTag, ',') as SensorTag[];

                    this.temperatureDB.getCurrentTemperaturesBySensorTags(sensorTags).then((temperatures) => {
                        res.send(temperatures);
                    });
                }
            );
    }
}