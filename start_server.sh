#!/bin/bash

clear
cd /home/ubuntu/taxistop-desktop
echo "======================TAXI STOP Desktop====================="
echo "Setting Port to 3200 and Envt to Production"
export PORT=3200
export NODE_ENV=production
echo "...Done"
echo "Building CSS and JS file..."
gulp build
echo "...Done"
echo "Killing Node Server running on port 3200..."
NP=`sudo netstat -lpn | grep 3200 | awk 'NR==1{print $7}' | awk '{split($0, array, "/")} END{print array[1]}'`
echo "Killing PID: $NP"
kill -9 $NP
echo "...Done"
echo "Backing up and removing nohup output file..."
mv nohup.out nohup.out.bak
rm -r nohup.out
echo "...Done"
echo "Starting Node Server..."
nohup npm start &
echo "...Done"
echo "----------[ Running Server | TaxiStop Desktop ]------------"
