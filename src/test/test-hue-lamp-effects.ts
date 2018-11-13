import {HueLampEffects} from "../hue/hue-lamp-effects";
import {lamps} from "../hue/hue-lamps";

let coucou = new HueLampEffects(lamps.bureau);
for (var i = 0; i < 9; i++) {
    setTimeout(() => {
        coucou.rampUpDown(2000);
    }, i * 4000);


}
