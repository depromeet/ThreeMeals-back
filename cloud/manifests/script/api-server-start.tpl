#!/bin/bash

# start docker
systemctl start docker

# start nginx
sudo service nginx start

# start code depoloy
sudo service codedeploy-agent start
