#!/usr/bin/env bash

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=Win;;
    MSYS_NT*)   machine=Git;;
    *)          machine="UNKNOWN:${unameOut}"
esac

if [ ${machine} == "Win" ]; then
    npm remove tunnelmole --ignore-scripts
    npm install ngrok@^4.3.3 --ignore-scripts
else
    npm remove ngrok --ignore-scripts
    npm install tunnelmole@^2.1.10 --ignore-scripts
fi

./node_modules/replace-in-file/bin/cli.js --configFile=os.config.js