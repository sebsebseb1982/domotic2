import {HueAPIDiscovery, IHueAPI} from "../hue/hue-api-discovery";
import {lamps} from "../hue/hue-lamps";
import {HueLamp} from "../hue/hue-lamp";

let lampeBureau = new HueLamp('bureau');

lampeBureau.setState({
    on: true,
    bri: 120,
    rgb: [255, 0, 255],
    transition: 1000
});

setTimeout(
    () => {
        lampeBureau.getState().then((state) => {
            console.log(state);
        });
    },
    1000
);

setTimeout(
    () => {
        lampeBureau.off();
    },
    1500
);

setTimeout(
    () => {
        lampeBureau.getState().then((state) => {
            console.log(state);
        });
    },
    2000
);