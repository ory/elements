# Developing @ory/elements-react

Ory Elements is built inside this monorepo and hooked up to the other packages
via nx and pnpm workspaces.

To start a hot reloading development mode:

```bash
pnpm exec nx dev @ory/elements-react
```

## API Extractor

To make sure there are no unintended changes to the API contract, we use
[API Extractor](https://api-extractor.com/) to generate API reports, that are
checked into the repository. The CI of each PR includes a check that this API
report would not change after merging the PR.

If the report would change, the CI fails. If that happens, you can re-generate
all reports by running

```bash
pnpm exec nx api-extractor-refresh @ory/elements-react
```

Inspect the resulting changes carefully, and make sure it is in line with what
you expected. Add the changes to your PR.

## Tests

Unit tests use Jest and react-testing-library. To run the tests locally,
execute:

```bash
pnpm exec nx build @ory/elements-react
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
pnpm exec nx storybook @ory/elements-react
```

You can also build the Storybook using:

```bash
pnpm exec nx build @ory/elements-react
```

The stories use stub responses

## Releasing

Packages are versioned with
[changesets](https://github.com/changesets/changesets). A pull request that
changes a published package adds a changeset that names each package it changes
and the bump:

```shell
pnpm exec changeset
```

CI fails when an `api-report/*.api.md` or `agents/slots.json` file adds, removes
or changes an export or slot without a changeset for that package, and when a
removed or changed export or a removed slot comes without a `major` changeset
(`minor` for packages on `0.x`).

A stable release goes through a release pull request:

1. Run the `Elements - Release PR` workflow in `ory-corp/cloud`. It runs
   `changeset version` and opens or updates the
   `chore(elements): release packages` pull request with the new versions and
   changelogs. Review and merge it.
2. When the merge is exported to `ory/elements`, the `Release` workflow there
   publishes every package whose committed version is not on npm yet to
   `latest`. It builds and publishes from the commit that set the version, tags
   `release/@ory/<package>/v<version>` on it, and creates a GitHub release from
   the changelog. To retry a failed release, re-run that workflow run.

To publish a prerelease of the pending changesets, run the `Release` workflow
manually with `prerelease` set (for example `rc`). Start with `dry_run` enabled.
It versions them as `X.Y.Z-rc.N` in the runner, publishes to the `next`
dist-tag, and commits nothing.
