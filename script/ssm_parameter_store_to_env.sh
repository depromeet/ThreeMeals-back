#!/bin/bash


deployDir=$1

set -e



ssmValue=$(aws ssm get-parameter --name hush-api-server-env)
stringValue=$(echo $ssmValue | tr '\r\n' ' ' | jq '.Parameter.Value' | sed 's/\"//g')

echo $stringValue | sed 's/\\n/\
/g' > $deployDir

