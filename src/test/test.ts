import {ClientHueLamp} from "../api/domotic/client-hue-lamp";

let clientHueLamp = new ClientHueLamp();


/*
clientHueLamp.getState('chevetSebastien').then((state) => {
    console.log(state);
});
*/

clientHueLamp.setState('chevetSebastien', {
    on: false
});