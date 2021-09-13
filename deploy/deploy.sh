#!/bin/bash

echo "deploy started...."
function dkrm(){
  DOCKER_IMAGE_IDS=$(docker images | grep "none" | awk '{print $3}')
  if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" = " " ]; then
    echo "========== No images available for deletion ==========="
  else
    docker rmi -f $DOCKER_IMAGE_IDS
  fi
}
