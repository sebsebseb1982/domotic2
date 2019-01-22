import {HueLamp} from "../hue/hue-lamp";

let hueLamp = new HueLamp('salon');

hueLamp.setState({
    on: true
}, 1000);