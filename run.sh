#!/bin/bash

outage=$(casperjs checkForOutage.js);

if [[ $outage == *"found results 0"* ]]
then
	echo "kesinti yok";
else
	if [[ $outage == *"KARŞIYAKA"* ]]
	then
		echo "kesinti var";
	else
		echo "kesinti yok";
	fi
fi




#if result = 0 then exit olarak değiştirilecek.
