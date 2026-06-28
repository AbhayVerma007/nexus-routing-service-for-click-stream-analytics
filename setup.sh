#!/bin/bash
set -e

# Update and install dependencies
apt-get update -y
apt-get install -y docker.io nginx certbot python3-certbot-nginx awscli curl unzip

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Authenticate to ECR (using IAM role - no credentials needed!)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 867490540548.dkr.ecr.us-east-1.amazonaws.com

# Pull the application image
docker pull 867490540548.dkr.ecr.us-east-1.amazonaws.com/url-shortener:latest

echo 'EC2 bootstrap complete!'