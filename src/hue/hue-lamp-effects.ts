import {HueLamp} from "./hue-lamp";

export class HueLampEffects {

    constructor(private lamp: HueLamp) {
    }

    rampUpDown(durationInMs: number) {
        this.lamp.setState({
            on: true,
            bri: 120,
            rgb: [255, 255, 255],
            transition: durationInMs / 2
        });

        setTimeout(
            () => {
                this.lamp.setState({
                    on: false,
                    bri: 0,
                    transition: durationInMs / 2
                });
            },
            durationInMs / 2
        );
    }
}