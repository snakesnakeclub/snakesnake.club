#!/bin/sh -e
eval $(ssh-agent)
mkdir ~/.ssh
echo "${DEPLOY_KEY}" | base64 -d > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa
ssh -o 'StrictHostKeyChecking=no' \
  "travis@${SSH_HOST}" \
  'make -C snakesnake.club deploy'
