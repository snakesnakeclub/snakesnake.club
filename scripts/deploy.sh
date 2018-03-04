echo "${DEPLOY_KEY}" | ssh-add -
ssh "travis@${SSH_HOST}" 'make -C snakesnake.club'
