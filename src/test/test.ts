import {TemperatureDB} from "../thermospi/db/TemperatureDB";

let temperatureDB = new TemperatureDB();

temperatureDB.getCurrentOutsideTemperature().then((out) => {
    console.log(out);
});