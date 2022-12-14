import { Configuration, Identity, FrontendApi } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"

// Create a new Ory API client
// This will default to the Ory playground project if no environment variable is set.
// Set the `ORY_SDK_URL` to your Ory CLI tunnel e.g. http://localhost:4000
const ory = new FrontendApi(new Configuration(edgeConfig))

// Returns either the email or the username depending on the user's Identity Schema
const getUserName = (identity: Identity) =>
  identity.traits.email || identity.traits.username

export { ory, getUserName }
