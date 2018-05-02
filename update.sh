#!/bin/bash
git pull
tsc
node src/test/test.js
