#!/bin/bash

if [ $# != 2 ]
  then
    echo "Usage: run.sh ROOM_ID AUTH_TOKEN"
    exit 1;	
fi

outage=$(casperjs checkForOutage.js);

echo "running for room with name: $1";

if [[ $outage == *"found results 0"* ]]
then
	exit;
else
	if [[ $outage == *"KARŞIYAKA"* ]]
	then
		ROOM_ID=$1
		AUTH_TOKEN=$2
		MESSAGE="kesinti var"

		curl -H "Content-Type: application/json" \
		     -X POST \
		     -d "{\"color\": \"purple\", \"message_format\": \"text\", \"message\": \"$MESSAGE\" }" \
		     https://api.hipchat.com/v2/room/$ROOM_ID/notification?auth_token=$AUTH_TOKEN
	else
		exit;
	fi
fi


