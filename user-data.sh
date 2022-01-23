#!/bin/bash

# install docker
apt-get -y update
apt-get -y remove docker docker-engine docker.io containerd runc
apt-get -y install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
# export HOSTNAME=$(curl -s http://169.254.169.254/metadata/v1/hostname)
# export PUBLIC_IPV4=$(curl -s http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address)
# echo Droplet: $HOSTNAME, IP Address: $PUBLIC_IPV4 > /var/www/html/index.html
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get -y update
apt-get -y install docker-ce docker-ce-cli containerd.io

# prepare git repository
mkdir /tmp/repo
cd /tmp/repo
git init

apt install -y nodejs npm
