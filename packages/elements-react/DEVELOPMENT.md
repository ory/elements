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

## Stories

Each flow has its own story in the `packages/elements-react-stories` package. To
run the storybook development environment, execute:

```bash
npx nx storybook elements-react-stories
```

You can also build the Storybook using:

```bash
npx nx build elements-react-stories
```

The stories use stub responses

## Releasing

@ory/elements-react is released using nx releases.

The process is still manual, but will be replaced by a semi-automatic release
pipeline.

To release a new version:

```bash
# in the root of the repo
npx nx build @ory/elements-react

# nx is configured to generate a new -next.X version, in nx.json
npx nx release version --verbose

# make sure to replace .X with the version generated in the first step
npx nx release changelog 1.0.0-next.X --verbose

npx nx release publish --tag=next --dry-run --verbose

npx nx release publish --tag=next --verbose --otp=<otp for npmjs.com from authenticator app> # otp is still required, if we have a bot for publishing this is not required anymore.

# replace .X with the appropriate version
git push origin tag release/@ory/elements-react/1.0.0-next.X

# push the pin commit to the branch
git push
```
