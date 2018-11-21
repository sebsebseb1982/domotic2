import {ClientHueLamp} from "../api/domotic/client-hue-lamp";

let clientHueLamp = new ClientHueLamp();

clientHueLamp.getState('chevetSebastien').then((test) => {
    console.log(test);
})