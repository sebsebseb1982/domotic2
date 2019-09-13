#!/bin/sh

echo "Exécution de $0"
pkill -f "random-tune/api"
npm --prefix /home/pi/git/domotic2 run api-random-tune