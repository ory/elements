#!/bin/sh

project=$1

# check that projec is either @ory/elements-react @ory/nextjs
if [ "$project" != "@ory/elements-react" ] && [ "$project" != "@ory/nextjs" ]; then
  echo "Invalid project name. Please provide either @ory/elements-react or @ory/nextjs"
  exit 1
fi

npx nx build $project

# nx is configured to generate a new -next.X version, in nx.json
npx nx release version --verbose -p $project

# the version nx came up with
new_version=$(jq -r '.packages | map(select(.name=="@ory/elements-react"))[].version' package-lock.json)

echo "\nNew version: $new_version"
echo "Correct?"
read -p "Are you alright? (y/n) " RESP
if [ "$RESP" != "y" ]; then
  echo "Aborting"
fi

# make sure to replace .X with the version generated in the first step
npx nx release changelog $new_version --verbose -p $project

# Now, please check the changelog.md file of the package and adjust if needed!

npx nx release publish --tag=next --dry-run --verbose -p $project

read -p "Dry run and CHANGELOG.md correct? (y/n) " RESP
if [ "$RESP" != "y" ]; then
  echo "Aborting"
fi

npx nx release publish --tag=next --verbose -p $project

# replace .X with the appropriate version
git push origin tag release/$project/$new_version

# push the pin commit to the branch
git push