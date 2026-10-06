SHELL=/bin/bash -o pipefail

export PATH               := .bin:${PATH}

ORY_META_INSTALL = https://raw.githubusercontent.com/ory/meta/acbf1878c12e483e882f478bad9aeceb6f030965/install.sh
ORY_META_INSTALL_SHA256 = 4fe2b338f3b8a2efe5b0a5993c3667bc86a5bd864299bc865bdc7a207e385d49
ORY_CI_REF = 35878b67f40c377bcb14dce2c26cf92e53586b4a
ORY_CI_LICENSES_INSTALL_SHA256 = 94024ec2da0627c38c438286d650b3913fd85e2c1aaa7944deeaf2935b96a65b

# Downloads $(1) to $(2) and fails, removing the file, unless its SHA-256 digest is $(3).
define download_verified
	@mkdir -p $(dir $(2))
	curl --retry 7 --retry-connrefused -sSfL -o $(2) $(1)
	if command -v sha256sum >/dev/null 2>&1; then sum=sha256sum; elif command -v shasum >/dev/null 2>&1; then sum="shasum -a 256"; \
	else echo "download_verified: sha256sum or shasum is required" >&2; rm -f $(2); exit 1; fi; \
	echo "$(3)  $(2)" | $$sum -c - || { rm -f $(2); exit 1; }
endef

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
	$(call download_verified,https://raw.githubusercontent.com/ory/ci/$(ORY_CI_REF)/licenses/install,.bin/licenses-install.sh,$(ORY_CI_LICENSES_INSTALL_SHA256))
	sh .bin/licenses-install.sh

.bin/ory: .deps/ory.version
	$(call download_verified,$(ORY_META_INSTALL),.bin/ory-install.sh,$(ORY_META_INSTALL_SHA256))
	bash .bin/ory-install.sh -b .bin ory $(shell cat .deps/ory.version)
	touch .bin/ory

node_modules: pnpm-lock.yaml package.json pnpm-workspace.yaml
	pnpm install --frozen-lockfile
	touch node_modules
