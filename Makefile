SHELL=/bin/bash -euo pipefail

export GO111MODULE        := on
export PATH               := .bin:${PATH}

.PHONY: install
install:
	npm run initialize && npm run build:clean

.PHONY: test
	npm run test

.PHONY: test-e2e
	./test-e2e.sh

.bin/ory: Makefile
	bash <(curl https://raw.githubusercontent.com/ory/meta/master/install.sh) -d -b .bin ory v0.1.38
	touch -a -m .bin/ory

format: node_modules
	.bin/ory dev headers license
	npm exec -- prettier --write .

licenses: .bin/licenses node_modules  # checks open-source licenses
	.bin/licenses

.bin/licenses: Makefile
	curl https://raw.githubusercontent.com/ory/ci/master/licenses/install | sh

.bin/ory: Makefile
	curl https://raw.githubusercontent.com/ory/meta/master/install.sh | bash -s -- -b .bin ory v0.1.45
	touch .bin/ory

node_modules: package-lock.json
	npm ci
	touch node_modules
