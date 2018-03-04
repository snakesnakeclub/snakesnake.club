echo "${DEPLOY_KEY}" | ssh-add -
ssh -oStrictHostKeyChecking=no "travis@${SSH_HOST}" 'make -C snakesnake.club'
