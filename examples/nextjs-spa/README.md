```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Proxy

Instead of using the built in Ory proxy, we are using Ory CLI's tunnel with a
default local variable:

```bash
NEXT_PUBLIC_ORY_SDK_URL = "http://localhost:4000"
```
