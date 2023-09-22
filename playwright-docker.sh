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

echo "testing ory elements components"
PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9009/ npm run test

echo "testing nextjs app"
(cd examples/nextjs-spa && PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9009/ npm run test)

echo "testing react app"
(cd examples/react-spa && PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9009/ npm run test)

echo "testing preact app"
(cd examples/react-spa && PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:9009/ npm run test)
