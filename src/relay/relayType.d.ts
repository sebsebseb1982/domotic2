import {GPIO} from "../gpio/gpio";

export interface IRelay {
    code: string;
    label: string;
    gpioPinNumber:number;
    pin: number;
}