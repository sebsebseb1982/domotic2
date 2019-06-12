import {PushoverService} from "../../notifications/services/pushover-service";
import {Logger} from "../../common/logger/logger";

let pushover = new PushoverService();

pushover.send({
    title: 'Domotic',
    description: 'Reboot',
    priority: 0
});

let logger = new Logger('Domotic');
logger.notify('Reboot');
