import {ClientHueLamp} from "../api/domotic/client-hue-lamp";

let clientHueLamp = new ClientHueLamp();


/*
clientHueLamp.getState('chevetSebastien').then((state) => {
    console.log(state);
});
*/

clientHueLamp.setState('chevetSebastien', {
    on: true,
    red: 255,
    bri: 255
});