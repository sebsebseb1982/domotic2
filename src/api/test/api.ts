import app from "./app";
import {Logger} from "../../common/logger/logger";

app.listen(1000, () => {
    new Logger('API').info(`L'API Domotic2 écoute sur le port 1000`);
});