import {ClientHueLamp} from "../api/domotic/client-hue-lamp";
import {IHueLampState} from "../hue/hue";

let clientHue = new ClientHueLamp();

let state:IHueLampState = {
    on: true,
    bri: 255,
    rgb: [
        255,
        255,
        255
    ]
};
clientHue.setState('salon', state);