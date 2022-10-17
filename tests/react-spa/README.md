## React with Elements Example

This is an example React project implementing Ory Elements. The project was
scaffolded by [Vite](https://vitejs.dev/).

### Get Started

```shell
git clone --depth 1 git@github.com:ory/elements.git
cd elements
npm run initialize
cd tests/react-spa
export VITE_ORY_SDK_URL=http://localhost:4000
npm run dev -- --port 3000
```

Now run the [Ory CLI](https://www.ory.sh/docs/guides/cli/installation) tunnel.

```shell
ory tunnel http://localhost:3000 --project <project-slug> --dev
```

The tunnel will now _mirror_ the Ory APIs under `http://localhost:4000` which we
have explicity told our React app to use through the `VITE_ORY_SDK_URL` export.

Open http://localhost:3000 in your browser and everything will work out of the
box :)

### Contributing

Found a bug or want to add a new feature? Please fork this repository and create
a pull request. If your changes are large please open an issue first.
