import {PushoverService} from "../notifications/services/pushover-service";
import {GoogleHomeService} from "../notifications/services/googleHomeService";

new PushoverService().send({
    title: 'test',
    description:'description',
    priority:0
});

new GoogleHomeService().say('coucou');