# Developing @ory/elements-react

Ory Elements is built inside this monorepo and hooked up to the other packages
via nx and npm workspaces.

To start a hot reloading development mode:

```bash
npx nx dev @ory/elements-react
```

## API Extractor

To make sure there are no unintended changes to the API contract, we use
[API Extractor](https://api-extractor.com/) to generate API reports, that are
checked into the repository. The CI of each PR includes a check that this API
report would not change after merging the PR.

If the report would change, the CI fails. If that happens, you can re-generate
all reports by running

```bash
npx nx api-extractor-refresh @ory/elements-react
```

Inspect the resulting changes carefully, and make sure it is in line with what
you expected. Add the changes to your PR.

## Tests

Unit tests use Jest and react-testing-library. To run the tests locally,
execute:

```bash
npx nx build @ory/elements-react
```

### Test selectors

To select DOM elements use a `data-testid` selector. Nomenclature mandates `/`
as separators and a prefix of `ory/`:

- `ory/form/` is the prefix for form elements;
- `ory/screen/` is the prefix for elements on specific screens;
- `ory/screen/` is the prefix for translatable messages (e.g. validation
  errors).

## Stories

Each flow has its own story in the `packages/elements-react-stories` package. To
run the storybook development environment, execute:

```bash
npx nx storybook @ory/elements-react
```

You can also build the Storybook using:

```bash
npx nx build @ory/elements-react
```

The stories use stub responses

## Releasing

@ory/elements-react and @ory/nextjs is released using nx releases.

There is a helper script located in "./scripts/release.sh".

Usage:

```bash
./scripts/release.sh @ory/elements-react # or @ory/nextjs
```

The script asks the user before executing each steps. Please double check
CHANGELOG.md and dry run outputs. nx also creates git tags and commits, that
should be commited. The script will do that automatically.
