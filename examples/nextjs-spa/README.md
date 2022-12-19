```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Ory Tunnel

This example uses the Ory tunnel to mirror Ory API's on your local machine for cookies to function properly and to prevent CORS errors. 

This environment variable is used by the Ory SDK and in this case contains the localhost URL of our Ory CLI tunnel.


```bash
NEXT_PUBLIC_ORY_SDK_URL = "http://localhost:4000"
```
