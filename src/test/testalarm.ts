import {Alarm} from "../security/alarm/alarm";

let alarm = new Alarm();
alarm.arm().then(() => {
    alarm.disarm();
});
