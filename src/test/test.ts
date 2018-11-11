import {SetPointDB} from "../thermospi/db/SetPointDB";
import {Thermostat} from "../thermospi/thermostat";

new SetPointDB().increment(-6).then(() => {
    new Thermostat().update();
});

