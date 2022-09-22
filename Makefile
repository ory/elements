SHELL=/bin/bash -euo pipefail

export GO111MODULE        := on
export PATH               := .bin:${PATH}

.PHONY: install
install:
	npm run i && npm run initialize && npm run build

.PHONY: test
	npm run test

.PHONY: test-e2e
	./test-e2e.sh

.bin/ory: Makefile
	bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -d -b .bin ory v0.1.38
	touch -a -m .bin/ory

.PHONY: format
format:
	npm i && npm run format
