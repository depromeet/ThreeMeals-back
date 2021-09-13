#!/bin/bash

deployDir=$1

set -e

ssmValue=$(aws ssm get-parameter --name hush-api-server-env)
#stringValue=$(echo $ssmValue | tr '\r\n' ' ' | jq '.Parameter.Value' | sed 's/\"//g')
stringValue=$(echo $ssmValue | tr '\r\n' ' ' | jq '.Parameter.Value' | sed 's/\"//g' | sed 's/\\n/,/g')

echo $stringValue  | tr ',' '\n' > $deployDir

#echo $stringValue | sed 's/\\n/\
#/g' > $deployDir
