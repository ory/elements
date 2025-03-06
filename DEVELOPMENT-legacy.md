# Development of the Legacy Ory Elements packages

The following packages are considered legacy:

- `@ory/elements`
- `@ory/elements-markup`
- `@ory/elements-preact`

If you're starting a new project, use `@ory/elements-react` instead.

## Package structure

The legacy package components are located in `src/` and are bundled into the
`packages/*` directories.

## Releasing a new legacy version

```sh
npm run build

# go to https://www.npmjs.com/package/@ory/elements-markup?activeTab=versions and check the latest version
export LEGACY_ELEMENTS_VERSION=...
```

Markup:

```sh
cd packages/markup

npm version $LEGACY_ELEMENTS_VERSION

npm publish --dry-run

npm publish
```

React:

```sh
cd packages/react

npm version $LEGACY_ELEMENTS_VERSION

npm publish --dry-run

npm publish
```

Preact:

```sh
cd packages/preact

npm version $LEGACY_ELEMENTS_VERSION

npm publish --dry-run

npm publish
```

Don't commit the changes in `package.json` and `package-lock.json`
