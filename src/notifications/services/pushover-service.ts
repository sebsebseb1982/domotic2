import * as https from "https";
import {MyNotification} from "../myNotification";
import {Configuration} from "../../configuration/configuration";
import {Logger} from "../../common/logger/logger";

export class PushoverService {
    configuration: Configuration;
    logger: Logger;

    constructor() {
        this.configuration = new Configuration();
        this.logger = new Logger("Pushover");
    }

    send(notification: MyNotification) {
        this.logger.debug(`Envoi du message "${notification.title}"`);

        let postData = JSON.stringify({
            token: this.configuration.pushover.token,
            user: this.configuration.pushover.user,
            title: notification.title.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            message: notification.description.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            priority: notification.priority ? notification.priority : 0
        });

        console.log(postData)

        let options = {
            hostname: 'api.pushover.net',
            port: 443,
            path: '/1/messages.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=iso-8859-1',
                'Content-Length': postData.length
            }
        };

        let req = https.request(options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            console.log('message:', res.statusMessage);

            res.on('data', (d) => {
                process.stdout.write(d);
            });
        });

        req.on('error', (e) => {
            this.logger.error(e.name, e.message);
        });

        req.write(postData);
        req.end();
    }
}