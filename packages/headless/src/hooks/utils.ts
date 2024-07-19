import {
  isRedirectBrowserTo,
  isSetOrySessionToken,
  isShowRecoveryUi,
  isShowSettingsUi,
  isShowVerificationUi,
  pickBestContinueWith,
} from "./continue-with"
import { ContinueWith } from "@ory/client-fetch"

export type OnRedirectHandler = (url: string, external: boolean) => void

export async function handleContinueWith(
  continueWith: ContinueWith[] | undefined,
  { onRedirect }: { onRedirect: OnRedirectHandler },
): Promise<boolean> {
  if (!continueWith || continueWith.length === 0) {
    return false
  }

  const action = pickBestContinueWith(continueWith)
  if (!action) {
    return false
  }

  const redirectFlow = (id: string, flow: string, url?: string) => {
    if (url) {
      onRedirect(url, true)
      return true
    }

    onRedirect("/" + flow + "?flow=" + id, false)
    return true
  }

  if (isSetOrySessionToken(action)) {
    throw new Error("Ory Elements does not support API flows yet.")
  } else if (isRedirectBrowserTo(action) && action.redirect_browser_to) {
    console.log("Redirecting to", action.redirect_browser_to)
    onRedirect(action.redirect_browser_to, true)
    return true
  } else if (isShowVerificationUi(action)) {
    return redirectFlow(action.flow.id, "verification", action.flow.url)
  } else if (isShowRecoveryUi(action)) {
    return redirectFlow(action.flow.id, "recovery", action.flow.url)
  } else if (isShowSettingsUi(action)) {
    return redirectFlow(action.flow.id, "settings", action.flow.url)
  } else {
    throw new Error("Unknown action: " + action.action)
  }
}
