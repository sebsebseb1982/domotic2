import {Alarm} from "../security/alarm/alarm";

let alarm = new Alarm();


alarm.arm().then(() => {
    setTimeout(() => {
        alarm.disarm();
    }, 3000);
});
/*
alarm.arm().then(() => {
    setTimeout(() => {
        alarm.disarm();
    }, 3000);
});




alarm.isArmed().then((isArmed) => {
    console.log(isArmed);
});
*/
