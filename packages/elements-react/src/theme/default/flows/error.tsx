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
  OryFlowComponentOverrides,
} from "@ory/elements-react"
import { PropsWithChildren, useMemo } from "react"
import { DefaultCard } from "../components"
import { DefaultHorizontalDivider } from "../components/form/horizontal-divider"
import { useClientLogout } from "../utils/logout"
import { IntlProvider } from "../../../context/intl-context"
import { FormattedMessage } from "react-intl"

/**
 * A union type of all possible errors that can be returned by the Ory SDK.
 */
export type OryError = FlowError | OAuth2Error | { error: GenericError }

/**
 * An OAuth2 error response.
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

export type ErrorFlowContextProps = {
  error: OryError
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
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

export function Error({
  error,
  components: Components,
  config,
  session,
}: PropsWithChildren<ErrorFlowContextProps>) {
  const Card = Components?.Card?.Root ?? DefaultCard
  const Divider = Components?.Card?.Divider ?? DefaultHorizontalDivider
  const parsed = useStandardize(error)

  const description = errorDescriptions[Math.floor(parsed.code / 100)]

  return (
    <IntlProvider
      locale={config.intl?.locale ?? "en"}
      customTranslations={config.intl?.customTranslations}
    >
      <Card data-testid={"ory/screen/error"}>
        <div className="flex flex-col gap-6 antialiased">
          <header className="flex flex-col gap-8 antialiased">
            <ErrorLogo config={config} />
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold leading-normal text-interface-foreground-default-primary">
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
            <h2 className="text-lg font-semibold leading-normal text-interface-foreground-default-primary">
              <FormattedMessage id="error.title.what-can-i-do" />
            </h2>
            <p className="leading-normal text-interface-foreground-default-secondary">
              <FormattedMessage id="error.instructions" />
            </p>
            <div>
              {session ? (
                <LoggedInActions config={config} />
              ) : (
                <GoBackButton config={config} />
              )}
            </div>
          </div>

          <Divider />
          <div className="font-normal leading-normal antialiased gap-2 flex flex-col">
            <span className="text-interface-foreground-default-primary text-sm">
              <FormattedMessage id="error.footer.text" />
            </span>

            {parsed.id && (
              <p className="text-interface-foreground-default-secondary text-sm">
                ID: <code>{parsed.id}</code>
              </p>
            )}
            <p className="text-interface-foreground-default-secondary text-sm">
              Time: <code>{parsed.timestamp?.toUTCString()}</code>
            </p>
            <p className="text-interface-foreground-default-secondary text-sm">
              Message: <code>{parsed.reason}</code>
            </p>

            <div>
              <button
                className="text-interface-foreground-default-primary underline"
                onClick={() => {
                  const text = `
              ${parsed.id ? `ID: ${parsed.id}\n` : ""}
              Time: ${parsed.timestamp?.toUTCString()}
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
  )
}

function LoggedInActions({ config }: { config: OryClientConfiguration }) {
  const logoutFlow = useClientLogout(config)

  return (
    <a
      href={logoutFlow?.logout_url}
      className="text-interface-foreground-default-primary underline"
    >
      Logout
    </a>
  )
}

function GoBackButton({ config }: { config: OryClientConfiguration }) {
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

function ErrorLogo({ config }: { config: OryClientConfiguration }) {
  if (config.logoUrl) {
    return <img src={config.logoUrl} width={100} height={36} alt="Logo" />
  }

  return (
    <h1 className="text-xl font-semibold leading-normal text-interface-foreground-default-primary">
      {config.name}
    </h1>
  )
}
