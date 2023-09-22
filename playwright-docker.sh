#!/bin/sh
# https://github.com/microsoft/playwright/issues/26482
# For unsupported distros, use the `test-containerized` target instead of `test`
# NOTE: this script runs a playwright server inside docker and exposes the host network to the container
# this is to expose services (such as the application you want to test) to the playwright server
docker pull mcr.microsoft.com/playwright:v1.38.0-jammy
docker ps | grep mcr.microsoft.com/playwright:v1.38.0-jammy || docker run \
		-d --network="host" --add-host=host.docker.internal:host-gateway -p 9009:9009 --rm --init -it mcr.microsoft.com/playwright:v1.38.0-jammy \
		/bin/sh -c "cd /home/pwuser && npx -y playwright@1.38.0 run-server --port 9009"

until npx --yes wscat -c ws://localhost:9009 &1>/dev/null;
do
  echo "attempting to connect to playwright server in docker" 
  sleep 1
done



read -p "Select the project [elements, nextjs, react, preact]: " project
read -p "Update snapshots? [y/n]: " update_snapshots

params=()
if [ "$update_snapshots" == "y" ]; then
  params+=("--update-snapshots")
fi

runTest() {
  echo "testing $1"
  PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9009/ npm run test -- "${params[@]}"
}

if [ "$project" != "elements" ] && [ "$project" != "nextjs" ] && [ "$project" != "react" ] && [ "$project" != "preact" ]; then
  echo "Invalid project"
  exit 1
fi

if [ "$project" == "elements" ]; then
  echo "testing ory elements components"
  runTest "elements"
  exit 0
fi

if [ "$project" == "nextjs" ]; then
  echo "testing nextjs app"
  (cd examples/nextjs-spa && runTest "nextjs")
  exit 0
fi

if [ "$project" == "react" ]; then
  echo "testing react app"
  (cd examples/react-spa && runTest "react")
  exit 0
fi

if [ "$project" == "preact" ]; then
  echo "testing preact app"
  (cd examples/preact-spa && runTest "preact")
fi
