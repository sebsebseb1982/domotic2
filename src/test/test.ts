import {PushoverService} from "../notifications/services/pushover-service";

new PushoverService().send({
    title: 'test',
    description:'description',
    priority:0
});