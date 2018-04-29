include scripts/deploy.env
export $(sh sed 's/=.*//' scripts/deploy.env)

build:
	make client/credentials.json
	make server/credentials.json
	make client/node_modules
	make server/node_modules

# Requires scripts/deploy.env with SLACK_WEBHOOK_URL environment variable
deploy:
	make on-deploy-start
	make deploy-go || make on-deploy-error
	make on-deploy-success

deploy-go:
	git stash save "`date +%s`"
	git pull origin master
	make client/node_modules
	make server/node_modules
	npm run build
	npm run deploy

on-deploy-start:
	sh scripts/on-deploy-start.sh

on-deploy-error:
	sh scripts/on-deploy-error.sh
	
on-deploy-success:
	sh scripts/on-deploy-success.sh

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

.PHONY: all clean on-deploy-start on-deploy-error on-deploy-success
