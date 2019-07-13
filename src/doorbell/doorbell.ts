import * as gpio from 'rpi-gpio';


export class Doorbell {
    constructor() {
        gpio.on('change', (channel, value) => {
            console.log('Channel ' + channel + ' value is now ' + value);
        });
    }
}