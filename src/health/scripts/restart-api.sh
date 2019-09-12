#!/bin/sh

pkill -f "domotic/api"
npm --prefix /home/pi/git/domotic2 run api-domotic