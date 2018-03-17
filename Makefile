all:
	make client/credentials.json
	make server/credentials.json
	make client/node_modules
	make server/node_modules

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

.PHONY: all clean
