import {INotifier} from "../notifier";
import {MyNotification} from "../myNotification";
import {Configuration} from "../../configuration/configuration";

let http = require("http");

export class NotifyMyAndroidNotifier implements INotifier{
    configuration: Configuration;

    constructor(private application: string) {
        this.configuration = new Configuration();
    }

    notify(notification: MyNotification) {
        var options = {
            hostname: this.configuration.nma.hostname,
            port: this.configuration.nma.port,
            path: `/publicapi/notify?apikey=${this.configuration.nma.apiKey}${this.getQueryParams(notification)}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': '0'
            }
        };
        var req = http.request(options, function(res) {
            console.log('Status: ' + res.statusCode);
            res.setEncoding('utf8');
            res.on('data', function (nmaResponse) {
                console.log('nmaResponse=' + nmaResponse);
            });
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        req.end();
    }

    private getQueryParams(notification: MyNotification) {

        let queryParams = '&application=' + encodeURI(this.application);
        queryParams += '&event=' + encodeURI(notification.title);
        if(notification.description) {
            queryParams += '&description=' + encodeURI(notification.description);
        }
        if(notification.url) {
            queryParams += '&url=' + notification.url;
        }
        queryParams += '&priority=1';

        return queryParams;
    }
}