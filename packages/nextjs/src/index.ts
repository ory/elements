import { OryConfig } from "./types"
import { useOryConfig } from "./config"
import { useSession } from "./hooks"
import { newFrontendClient } from "./sdk"

export type { OryConfig }
export { useOryConfig, newFrontendClient, useSession }
