build:
	make client/credentials.json
	make server/credentials.json
	make client/node_modules
	make server/node_modules

# Requires SLACK_WEBHOOK_URL environment variable
deploy:
	make on-start
	make build || make on-error
	npm run deploy
	make on-success

client/credentials.json: client/credentials-sample.json
	cp client/credentials-sample.json client/credentials.json

server/credentials.json: server/credentials-sample.json
	cp server/credentials-sample.json server/credentials.json

client/node_modules: client/package.json
	( cd client ; npm install )

server/node_modules: server/package.json
	( cd server ; npm install )

clean:
	rm -rf dist \
		.cache \
		node_modules \
		client/node_modules \
		client/credentials.json \
		server/node_modules \
		server/credentials.json

on-start:
	sh scripts/on-deploy-start.sh

on-error:
	sh scripts/on-deploy-error.sh
	
on-success:
	sh scripts/on-deploy-success.sh

.PHONY: all clean on-start on-error on-success
