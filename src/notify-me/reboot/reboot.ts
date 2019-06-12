import {PushoverService} from "../../notifications/services/pushover-service";
import {Logger} from "../../common/logger/logger";

let pushover = new PushoverService();

setTimeout(() => {
    pushover.send({
        title: 'Domotic',
        description: 'Reboot',
        priority: 0
    });
}, 20 * 1000);

let logger = new Logger('Domotic');
logger.notify('Reboot');
