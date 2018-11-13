import {HueLampEffects} from "../hue/hue-lamp-effects";
import {HueLamp} from "../hue/hue-lamp";

let coucou = new HueLampEffects(new HueLamp('bureau'));
for (var i = 0; i < 9; i++) {
    setTimeout(() => {
        coucou.rampUpDown(2000);
    }, i * 4000);


}
