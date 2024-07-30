import {
  FetchError,
  RequiredError,
  ResponseError,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import {
  isBrowserLocationChangeRequired,
  isCsrfError,
  isNeedsPrivilegedSessionError,
  isResponseError,
  isSelfServiceFlowExpiredError,
} from "./error"
import { FlowContainer } from "./flowTypes"
import { OnRedirectHandler } from "./continueWith"

export type OnSubmitHandlerProps<
  T extends
    | UpdateLoginFlowBody
    | UpdateRegistrationFlowBody
    | UpdateVerificationFlowBody
    | UpdateRecoveryFlowBody
    | UpdateSettingsFlowBody,
> = {
  /**
   * This method is used to update the flow container when a validation error occurs, for example.
   */
  setFlowContainer: (flowContainer: Partial<FlowContainer>) => void

  /**
   * The form values to submit.
   */
  body: T

  /**
   * This method is used to redirect the user to a different page.
   */
  onRedirect: OnRedirectHandler
}

export type ValidationErrorHandler = (body: any) => any

type FlowErrorHandlerProps = {
  /**
   * When the SDK returns an error indicating that the flow needs to be restarted, this function is called.
   */
  onRestartFlow: () => void

  /**
   * When the SDK returns a validation error, this function is called. The result should be used to update the
   * flow container.
   *
   * The function should return a FlowContainer or nothing.
   *
   * @param body
   */
  onValidationError: ValidationErrorHandler

  /**
   * This method is used to redirect the user to a different page.
   */
  onRedirect: OnRedirectHandler
}

/**
 * Use this as the catch handler for all flow-related SDK calls, such as creating a login or submitting a login.
 *
 *
 * @param opts
 */
export const handleFlowError =
  (opts: FlowErrorHandlerProps) => async (err: any) => {
    if (isResponseError(err)) {
      switch (err.response.status) {
        case 404: // Does not exist
          opts.onRestartFlow()
          return
        case 410: // Expired
          // Re-initialize the flow
          opts.onRestartFlow()
          return
        case 400:
          return opts.onValidationError(await err.response.json())
        case 403: // This typically happens with CSRF violations.
        case 422:
          const body = await toBody(err.response)
          if (
            isBrowserLocationChangeRequired(body) &&
            body.redirect_browser_to
          ) {
            opts.onRedirect(body.redirect_browser_to, true)
            return
          } else if (isSelfServiceFlowExpiredError(body)) {
            opts.onRestartFlow()
            return
          } else if (isNeedsPrivilegedSessionError(body)) {
            opts.onRedirect(body.redirect_browser_to, true)
            return
          } else if (isCsrfError(body)) {
            opts.onRestartFlow()
            return
          }

          throw new ResponseError(
            err.response,
            "The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information:" +
              JSON.stringify(body),
          )

        default:
          throw new ResponseError(
            err.response,
            "The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information.",
          )
      }
    } else if (err instanceof FetchError) {
      throw new FetchError(
        err,
        "Unable to call the API endpoint. Ensure that CORS is set up correctly and that you have provided a valid SDK URL to Ory Elements.",
      )
    } else if (err instanceof RequiredError) {
      // TODO (@aeneasr) Happens on submit usually. Not sure how to handle yet.
    }

    throw err
  }

export async function toBody(response: Response): Promise<any> {
  try {
    return await response.clone().json()
  } catch (e) {
    throw new ResponseError(
      response,
      "The Ory API endpoint returned a response the SDK does not know how to handle:" +
        (await response.text()),
    )
  }
}
