import app from "./app";
import {Logger} from "../../common/logger/logger";
import {Configuration} from "../../configuration/configuration";

let configuration = new Configuration();
app.listen(configuration.api.port, () => {
    new Logger('API').info(`L'API Thermospi écoute sur le port ${configuration.api.port}`);
});