#!/bin/bash
git pull
tsc
# npm --prefix /home/pi/domotic2 run timelapse
npm --prefix /home/pi/domotic2 run api-domotic
