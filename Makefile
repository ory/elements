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

# Prefers a Kratos checkout next to this repo; without one, dev-kratos
# installs the latest release.
KRATOS_SOURCE ?= $(firstword $(wildcard ../kratos/kratos-oss ../kratos))
NEXT_PUBLIC_ORY_SDK_URL ?= http://localhost:4433

.PHONY: dev-kratos
dev-kratos:
	@mkdir -p .bin
	@if [ -n "$(KRATOS_SOURCE)" ]; then \
		(cd $(KRATOS_SOURCE) && go build -o $(abspath .bin/kratos) .); \
	else \
		GOBIN=$(abspath .bin) go install github.com/ory/kratos@latest; \
	fi
	.bin/kratos serve --dev --watch-courier --config examples/kratos/kratos.yml

.PHONY: dev-example
dev-example: node_modules
	NEXT_PUBLIC_ORY_SDK_URL=$(NEXT_PUBLIC_ORY_SDK_URL) pnpm --filter nextjs-app-router-example dev

.PHONY: dev-local
dev-local:
	$(MAKE) -j2 dev-kratos dev-example

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
