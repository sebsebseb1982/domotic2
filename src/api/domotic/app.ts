import * as express from "express";
import * as bodyParser from "body-parser";
import {Auth} from "./filters/auth";
import {Configuration} from "../../configuration/configuration";
import {RFXcom} from "../../rfxcom/RFXcom";
import {OutletsRoutes} from "./routes/outlets-routes";
import {GateRoutes} from "./routes/gate-routes";
import {AlarmRoutes} from "./routes/alarm-routes";
import {ThermospiRoutes} from "./routes/thermospi-routes";
import {HueRoutes} from "./routes/hue-routes";

class App {
    public app: express.Application;
    configuration: Configuration;

    constructor() {
        this.configuration = new Configuration();
        this.app = express();
        this.config();

        // Filters
        let router = express.Router();
        new Auth().filter(router);

        // Routes
        new OutletsRoutes().routes(router);
        new GateRoutes().routes(router);
        new AlarmRoutes().routes(router);
        new ThermospiRoutes().routes(router);
        new HueRoutes().routes(router);

        this.app.use(this.configuration.api.root, router);

        // TODO: Est-ce bien son rôle ?
        RFXcom.initialize();
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
export default new App().app;