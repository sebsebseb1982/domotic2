import * as gpio from 'rpi-gpio';


export class Doorbell {
    constructor() {
        /*gpio.on('change', (channel, value) => {
            console.log('Channel ' + channel + ' value is now ' + value);
        });
        gpio.setup(3, gpio.DIR_IN, gpio.EDGE_BOTH);
        */

        while (true) {
            gpio.setup(3, gpio.DIR_IN, readInput);

            function readInput(err) {
                if (err) throw err;
                gpio.read(3, function (err, value) {
                    if (err) throw err;
                    console.log('The value is ' + value);
                });
            }
        }


    }
}