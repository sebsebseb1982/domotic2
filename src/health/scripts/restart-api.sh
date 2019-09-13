#!/bin/sh

echo "Exécution de $0"
pkill -f "domotic/api"
npm --prefix /home/pi/git/domotic2 run api-domotic