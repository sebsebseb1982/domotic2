#!/bin/sh

pkill -f "domotic/api"
nohup npm --prefix /home/pi/git/domotic2 run api-domotic &