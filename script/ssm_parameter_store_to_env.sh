#!/bin/bash


deployDir=$1

#function json_extract {
#  local key=$1
#  local json=$2
#
#  local string_regex='"([^"\]|\\.)*"'
#  local number_regex='-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?'
#  local value_regex="${string_regex}|${number_regex}|true|false|null"
#  local pair_regex="\"${key}\"[[:space:]]*:[[:space:]]*(${value_regex})"
#
#  if [[ ${json} =~ ${pair_regex} ]]; then
#    echo $(sed 's/^"\|"$//g' <<< "${BASH_REMATCH[1]}")
#  else
#    return 1
#  fi
#}

ssmValue=$(aws ssm get-parameter --name hush-api-server-env)
#echo $ssmValue | jq '.Parameter.Value'
stringValue=$(echo $ssmValue | jq '.Parameter.Value' | sed 's/\"//g')
#stringValue=$(json_extract Value "${ssmValue}" | sed 's/\"//g')

echo $stringValue | sed 's/\\n/\
/g' > $deployDir

