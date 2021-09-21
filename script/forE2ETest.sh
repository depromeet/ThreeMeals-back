#!/bin/bash

ScriptType=$1 # type is start or end

if [ -z "$ScriptType" ]; then
  echo "required isStart variable"
  exit 1
fi

if [ "$ScriptType" = "start" ]; then

  # mysql docker container 가 존재하지 않는다면 생성
  CONTAINER_NAME=$(docker ps -aq -f "name=hush-e2e-mysql")
  if [ -z "$CONTAINER_NAME" -o "$CONTAINER_NAME" = " " ]; then
    echo "up test mysql docker image"
    docker run -d \
      -p 32938:3306 \
      -e MYSQL_ROOT_PASSWORD=mysql \
      --name hush-e2e-mysql \
      --health-cmd='mysqladmin ping --silent' \
      mysql:5.7 \
      --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci
  fi

  while ! docker exec hush-e2e-mysql mysqladmin -u root -pmysql -h "127.0.0.1" ping --silent &> /dev/null ; do
      echo "Waiting for database connection..."
      sleep 2
  done

  # 테스트 schema 가 존재하지 않는다면 생성
  CHECK_SCHEMA="SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'three_meals_test';"
  RESULT=$(docker exec hush-e2e-mysql /bin/sh -c "mysql -u root -pmysql mysql -e \"$CHECK_SCHEMA\"")

  if [[ -z $RESULT ]]; then
    echo "create schema..."
    CREATE_DB_QUERY="CREATE SCHEMA three_meals_test CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    docker exec hush-e2e-mysql /bin/sh -c "mysql -u root -pmysql mysql -e \"$CREATE_DB_QUERY\""
  else
    echo "schema already existed..."
  fi

elif [ "$ScriptType" = "end" ]; then
  docker stop hush-e2e-mysql
  docker rm hush-e2e-mysql
fi