import {IHueLamp} from "./hue";
import {HueLampManager} from "./hueLampManager";

export class HueLampEffects {

    hueLampManager: HueLampManager;

    constructor(private lamp: IHueLamp) {
        this.hueLampManager = new HueLampManager();
    }

    rampUpDown(durationInMs: number) {
        this.hueLampManager.setState(this.lamp, {
            on: true,
            bri: 255,
            rgb: [0, 0, 255],
            transition: durationInMs / 2
        });

        setTimeout(
            () => {
                this.hueLampManager.setState(this.lamp, {
                    on: false,
                    bri: 0,
                    transition: durationInMs / 2
                });
            },
            durationInMs / 2
        );
    }
}