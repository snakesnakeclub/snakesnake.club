ssh-add - <<< "${DEPLOY_KEY}"
ssh "travis@${SSH_HOST}" 'make -C snakesnake.club'
