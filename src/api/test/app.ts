import * as express from "express";
import * as bodyParser from "body-parser";
import {RandomTuneRoutes} from "../routes/random-tune-routes";

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();

        // Filters
        let router = express.Router();

        // Routes
        new RandomTuneRoutes().routes(router);

        this.app.use('/test', router);
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
export default new App().app;