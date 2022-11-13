import { Configuration, Identity, V0alpha2Api} from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"

// Create a new Ory API client
const ory = new V0alpha2Api(new Configuration(edgeConfig))

// Returns either the email or the username depending on the user's Identity Schema
const getUserName = (identity: Identity) =>
  identity.traits.email || identity.traits.username

export { ory, getUserName }
