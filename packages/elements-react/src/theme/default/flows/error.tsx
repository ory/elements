// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import {
  FlowError,
  GenericError,
  instanceOfFlowError,
  instanceOfGenericError,
  Session,
} from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryConfigurationProvider,
  OryFlowComponentOverrides,
  useOryConfiguration,
} from "@ory/elements-react"
import { useMemo } from "react"
import { FormattedMessage } from "react-intl"
import { IntlProvider } from "../../../context/intl-context"
import { DefaultCard } from "../components"
import { DefaultHorizontalDivider } from "../components/form/horizontal-divider"
import { useClientLogout } from "../utils/logout"

/**
 * A union type of all possible errors that can be returned by the Ory SDK.
 * @hidden
 * @inline
 */
export type OryError = FlowError | OAuth2Error | { error: GenericError }

/**
 * An OAuth2 error response.
 * @hidden
 * @inline
 */
export type OAuth2Error = {
  error: string
  error_description: string
}

function isOAuth2Error(error: unknown): error is OAuth2Error {
  return (
    !!error &&
    typeof error === "object" &&
    "error" in error &&
    "error_description" in error
  )
}

/**
 * Props for the Error component.
 *
 * @inline
 * @hidden
 */
export type ErrorFlowContextProps = {
  /**
   * The error object returned by the Ory SDK.
   * This can be a FlowError, OAuth2Error, or a GenericError.
   */
  error: OryError
  /**
   * The components to override the default ones.
   * This allows you to customize the appearance and behavior of the error flow.
   */
  components?: OryFlowComponentOverrides
  /**
   * The Ory client configuration object.
   * This object contains the configuration for the Ory client, such as the base URL and project information.
   */
  config: OryClientConfiguration
  /**
   * The session object, if available.
   * This is used to determine if the user is logged in and to provide appropriate actions.
   */
  session?: Session
}

const errorDescriptions: Record<number, string> = {
  4: "The server could not handle your request, because it was malformed",
  5: "The server encountered an error and could not complete your request",
}

type InternalStandardizedError = {
  code: number
  message?: string
  status?: string
  reason?: string
  id?: string
  timestamp?: Date
}

function useStandardize(error: OryError): InternalStandardizedError {
  // Memoize the error to keep the timestamp consistent
  return useMemo(() => {
    if (isOAuth2Error(error)) {
      return {
        code: 400,
        message: error.error_description,
        status: error.error,
        timestamp: new Date(),
      }
    }
    if (instanceOfFlowError(error)) {
      const parsed = error.error as InternalStandardizedError
      return {
        ...parsed,
        id: error.id,
        timestamp: error.created_at,
      }
    } else if (error.error && instanceOfGenericError(error.error)) {
      return {
        code: error.error.code ?? 500,
        message: error.error.message,
        status: error.error.status,
        reason: error.error.reason,
        timestamp: new Date(),
      }
    }
    return {
      code: 500,
      message: "An error occurred",
      status: "error",
    }
  }, [error])
}

/**
 * The Error component is used to display an error message to the user.
 *
 * @param props - The props for the Error component.
 * @returns
 * @group Components
 * @category Flows
 */
export function Error({
  error,
  components: Components,
  config,
  session,
}: ErrorFlowContextProps) {
  const Card = Components?.Card?.Root ?? DefaultCard
  const Divider = Components?.Card?.Divider ?? DefaultHorizontalDivider
  const parsed = useStandardize(error)

  const description = errorDescriptions[Math.floor(parsed.code / 100)]

  return (
    <OryConfigurationProvider sdk={config.sdk} project={config.project}>
      <IntlProvider
        locale={config.intl?.locale ?? "en"}
        customTranslations={config.intl?.customTranslations}
      >
        <Card>
          <div
            className="flex flex-col gap-6 antialiased"
            data-testid={"ory/screen/error"}
          >
            <header className="flex flex-col gap-8 antialiased">
              <div className="max-h-9 self-start">
                <ErrorLogo />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg leading-normal font-semibold text-interface-foreground-default-primary">
                  <FormattedMessage id="error.title.what-happened" />
                </h2>
                <p className="leading-normal text-interface-foreground-default-secondary">
                  {parsed.message ?? description}
                </p>
                {parsed.reason && (
                  <p className="leading-normal text-interface-foreground-default-secondary">
                    {parsed.reason}
                  </p>
                )}
              </div>
            </header>
            <Divider />

            <div className="flex flex-col gap-2">
              <h2 className="text-lg leading-normal font-semibold text-interface-foreground-default-primary">
                <FormattedMessage id="error.title.what-can-i-do" />
              </h2>
              <p className="leading-normal text-interface-foreground-default-secondary">
                <FormattedMessage id="error.instructions" />
              </p>
              <div>{session ? <LoggedInActions /> : <GoBackButton />}</div>
            </div>

            <Divider />
            <div className="flex flex-col gap-2 leading-normal font-normal antialiased">
              <span className="text-sm text-interface-foreground-default-primary">
                <FormattedMessage id="error.footer.text" />
              </span>

              {parsed.id && (
                <p className="text-sm text-interface-foreground-default-secondary">
                  ID: <code>{parsed.id}</code>
                </p>
              )}
              <p className="text-sm text-interface-foreground-default-secondary">
                Time: <code>{parsed.timestamp?.toUTCString()}</code>
              </p>
              <p className="text-sm text-interface-foreground-default-secondary">
                Message:{" "}
                <code data-testid={"ory/screen/error/message"}>
                  {parsed.reason}
                </code>
              </p>

              <div>
                <button
                  className="text-interface-foreground-default-primary underline"
                  onClick={() => {
                    const text = `${parsed.id ? `ID: ${parsed.id}` : ""}
Time: ${parsed.timestamp?.toUTCString()}
${parsed.reason ? `Message: ${parsed.reason}` : ""}
`
                    void navigator.clipboard.writeText(text)
                  }}
                >
                  <FormattedMessage id="error.footer.copy" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </IntlProvider>
    </OryConfigurationProvider>
  )
}

function LoggedInActions() {
  const config = useOryConfiguration()
  const { logoutFlow } = useClientLogout(config)

  return (
    <a
      href={logoutFlow?.logout_url}
      className="text-interface-foreground-default-primary underline"
    >
      <FormattedMessage id="login.logout-button" />
    </a>
  )
}

function GoBackButton() {
  const config = useOryConfiguration()
  if ("default_redirect_url" in config.project) {
    return (
      <a
        className="text-interface-foreground-default-primary underline"
        href={config.project.default_redirect_url}
      >
        <FormattedMessage id="error.action.go-back" />
      </a>
    )
  }

  return null
}

function ErrorLogo() {
  const { project } = useOryConfiguration()
  if (project.logo_light_url) {
    return <img src={project.logo_light_url} className="h-full" alt="Logo" />
  }

  return (
    <h1 className="text-xl leading-normal font-semibold text-interface-foreground-default-primary">
      {project.name}
    </h1>
  )
}
