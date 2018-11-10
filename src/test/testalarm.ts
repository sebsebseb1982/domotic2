import {Alarm} from "../security/alarm/alarm";

let alarm = new Alarm();
alarm.isArmed().then((isArmed) => {
    console.log(isArmed);
});
