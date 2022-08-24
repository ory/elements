#!/bin/bash

set -euxo pipefail

# run our react-spa on port 3000 and our ory tunnel on port 4000
cd tests/react-spa && VITE_ORY_SDK_URL=http://localhost:4000 npm run preview -- --port 3000 &
ory tunnel http://localhost:3000 --project $ORY_PROJECT_SLUG --dev --port 4000 &

trap "exit" INT TERM ERR
trap 'kill $(jobs -p)' EXIT

# wait until all processes are up and running
npx wait-on -v -t 300000 \
  tcp:127.0.0.1:3000 \
  tcp:127.0.0.1:4000 \

# run our playwright e2e tests
npm run test-e2e