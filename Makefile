SHELL=/bin/bash -o pipefail

export PATH               := .bin:${PATH}

.PHONY: install
install:
	pnpm install --frozen-lockfile

.PHONY: test
test:
	pnpm run test

.PHONY: build
build:
	pnpm exec nx run-many --target=build --all
	pnpm exec nx run-many --all --target=build-storybook -- --stats-json

.PHONY: dev
dev:
	pnpm exec nx run-many --target=dev --all

PRETTIER_VERSION=$(shell cat package.json | jq -r '.devDependencies["prettier"] // .dependencies["prettier"]')

format: .bin/ory
	.bin/ory dev headers copyright --type=open-source
	@echo "Prettier Version: $(PRETTIER_VERSION)"
	pnpm dlx prettier@$(PRETTIER_VERSION) . --write

licenses: .bin/licenses node_modules  # checks open-source licenses
	.bin/licenses

.bin/licenses: Makefile
	curl --retry 7 --retry-connrefused https://raw.githubusercontent.com/ory/ci/master/licenses/install | sh

.bin/ory: .deps/ory.version
	curl --retry 7 --retry-connrefused https://raw.githubusercontent.com/ory/meta/master/install.sh | bash -s -- -b .bin ory $(cat .deps/ory.version)
	touch .bin/ory

node_modules: pnpm-lock.yaml package.json pnpm-workspace.yaml
	pnpm install --frozen-lockfile
	touch node_modules
