#!/bin/sh

project=$1
preid=$2

# check that projec is either @ory/elements-react @ory/nextjs
if [ "$project" != "@ory/elements-react" ] && [ "$project" != "@ory/nextjs" ]; then
  echo "Invalid project name. Please provide either @ory/elements-react or @ory/nextjs"
  exit 1
fi

if [ "$preid" != "next" ] && [ "$preid" != "pr" ]; then
  echo "Invalid preid. Please provide 'next' or 'pr' "
  exit 1
fi

npx nx build $project

# nx is configured to generate a new -next.X version, in nx.json
if [ $preid == "next" ]; then
  npx nx release version --verbose -p $project --preid=$preid --specifier prerelease
else
  npx nx release version --verbose -p $project --preid=$preid --specifier 0.0.0-pr.$(git rev-parse --short HEAD)
fi

# the version nx came up with
new_version=$(jq -r --arg project "$project" '.packages | map(select(.name==$project))[].version' package-lock.json)

echo "\npackage link: https://www.npmjs.com/package/$project?activeTab=versions"
echo "\nNew version: $new_version"
read -p "Correct? (y/n) " RESP
if [ "$RESP" != "y" ]; then
  echo "Aborting"
  exit 1
fi

if [ $preid == "next" ]; then
  npx nx release changelog $new_version --verbose -p $project
fi

# Now, please check the changelog.md file of the package and adjust if needed!

npx nx release publish --tag=$preid --dry-run --verbose -p $project

cat CHANGELOG.md | tail -n 30

read -p "Dry run and CHANGELOG.md correct? (y/n) " RESP
if [ "$RESP" != "y" ]; then
  echo "Aborting"
  exit 1
fi

npx nx release publish --tag=$preid --verbose -p $project

if [ $preid == "next" ]; then
  # replace .X with the appropriate version
  git push origin tag release/$project/$new_version

  # push the pin commit to the branch
  git push
fi