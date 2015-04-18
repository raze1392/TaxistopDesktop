#!/bin/bash

clear
cd /home/ubuntu/chanakya
echo "=========================TAXI STOP========================"
echo "Setting Port to 80 and Envt to Production"
export PORT=80
export NODE_ENV=production
echo "...Done"
echo "Building CSS and JS file..."
gulp build
echo "...Done"
echo "Killing running Node Server..."
killall node
echo "...Done"
echo "Backing up and removing nohup output file..."
mv nohup.out nohup.out.bak
rm -r nohup.out
echo "...Done"
echo "Starting Node Server..."
nohup npm start &
echo "...Done"
echo "-----------[ Running Node Server | TaxiStop ]-------------"
