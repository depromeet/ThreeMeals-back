#!/bin/bash

yum update -y

sudo yum install -y ruby
sudo yum install -y git

# docker setting
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# install nginx
sudo amazon-linux-extras install -y nginx1
sudo service nginx start

# install epel repository
wget -r --no-parent -A 'epel-release-*.rpm' https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
yum-config-manager --enable epel*

# install cert
yum install -y certbot
sudo mkdir -p /var/www/letsencrypt

# install codedeploy agent
cd /home/ec2-user
wget https://aws-codedeploy-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

# make of project dir
mkdir -p /home/ec2-user/hush-api

# sudo certbot certonly --webroot -w /var/www/letsencrypt -d dev-stage-api.hush-it.com --agree-tos -m admin@hush-it.com
