import {PushoverService} from "../notifications/services/pushover-service";
import {Alarm} from "../security/alarm/alarm";

let pushover = new PushoverService();

let alarm = new Alarm();
alarm.disarm();