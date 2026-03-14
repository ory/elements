<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { FlowError, GenericError, Session } from "@ory/client-fetch"
import { instanceOfFlowError, instanceOfGenericError } from "@ory/client-fetch"
import type { OryClientConfiguration } from "../../../composables/useOryConfig"
import type { OryFlowComponentOverrides } from "../../../composables/useComponents"
import { getOryComponents } from "../getOryComponents"
import { useOryIntl } from "../../../composables/useOryIntl"

/**
 * OAuth2 error response type
 */
export type OAuth2Error = {
  error: string
  error_description: string
}

/**
 * Union type of all possible Ory errors
 */
export type OryError = FlowError | OAuth2Error | { error: GenericError }

/**
 * Standardized error structure for internal use
 */
interface StandardizedError {
  code: number
  message?: string
  status?: string
  reason?: string
  id?: string
  timestamp?: Date
}

function isOAuth2Error(error: unknown): error is OAuth2Error {
  return (
    !!error &&
    typeof error === "object" &&
    "error" in error &&
    "error_description" in error
  )
}

const props = withDefaults(
  defineProps<{
    error: OryError
    components?: OryFlowComponentOverrides
    config: OryClientConfiguration
    session?: Session | null
  }>(),
  {
    session: null,
  },
)

const components = getOryComponents(props.components)
const { t } = useOryIntl()

const errorDescriptions: Record<number, string> = {
  4: "The server could not handle your request, because it was malformed",
  5: "The server encountered an error and could not complete your request",
}

const parsedError = computed((): StandardizedError => {
  const error = props.error

  if (isOAuth2Error(error)) {
    return {
      code: 400,
      message: error.error_description,
      status: error.error,
      timestamp: new Date(),
    }
  }

  if (instanceOfFlowError(error)) {
    const parsed = error.error as StandardizedError
    return {
      ...parsed,
      id: error.id,
      timestamp: error.created_at,
    }
  }

  if ("error" in error && error.error && instanceOfGenericError(error.error)) {
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
})

const description = computed(() => {
  return errorDescriptions[Math.floor(parsedError.value.code / 100)]
})

const projectConfig = computed(() => ({
  name: props.config.project?.name ?? "Ory",
  logo_light_url: props.config.project?.logo_light_url,
  default_redirect_url: props.config.project?.default_redirect_url,
}))

function copyErrorDetails() {
  const text = `${parsedError.value.id ? `ID: ${parsedError.value.id}` : ""}
Time: ${parsedError.value.timestamp?.toUTCString()}
${parsedError.value.reason ? `Message: ${parsedError.value.reason}` : ""}`
  void navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="ory-elements">
    <component :is="components.Card.Root">
      <div
        class="flex flex-col gap-6 antialiased"
        data-testid="ory/screen/error"
      >
        <header class="flex flex-col gap-8 antialiased">
          <div class="max-h-9 self-start">
            <img
              v-if="projectConfig.logo_light_url"
              :src="projectConfig.logo_light_url"
              class="h-full"
              alt="Logo"
            />
            <h1
              v-else
              class="text-xl leading-normal font-semibold text-interface-foreground-default-primary"
            >
              {{ projectConfig.name }}
            </h1>
          </div>
          <div class="flex flex-col gap-2">
            <h2
              class="text-lg leading-normal font-semibold text-interface-foreground-default-primary"
            >
              {{ t("error.title.what-happened") }}
            </h2>
            <p
              class="leading-normal text-interface-foreground-default-secondary"
            >
              {{ parsedError.message ?? description }}
            </p>
            <p
              v-if="parsedError.reason"
              class="leading-normal text-interface-foreground-default-secondary"
            >
              {{ parsedError.reason }}
            </p>
          </div>
        </header>

        <component :is="components.Card.Divider" />

        <div class="flex flex-col gap-2">
          <h2
            class="text-lg leading-normal font-semibold text-interface-foreground-default-primary"
          >
            {{ t("error.title.what-can-i-do") }}
          </h2>
          <p class="leading-normal text-interface-foreground-default-secondary">
            {{ t("error.instructions") }}
          </p>
          <div>
            <a
              v-if="projectConfig.default_redirect_url"
              class="text-interface-foreground-default-primary underline"
              :href="projectConfig.default_redirect_url"
            >
              {{ t("error.action.go-back") }}
            </a>
          </div>
        </div>

        <component :is="components.Card.Divider" />

        <div class="flex flex-col gap-2 leading-normal font-normal antialiased">
          <span class="text-sm text-interface-foreground-default-primary">
            {{ t("error.footer.text") }}
          </span>

          <p
            v-if="parsedError.id"
            class="text-sm text-interface-foreground-default-secondary"
          >
            ID: <code>{{ parsedError.id }}</code>
          </p>
          <p class="text-sm text-interface-foreground-default-secondary">
            Time: <code>{{ parsedError.timestamp?.toUTCString() }}</code>
          </p>
          <p class="text-sm text-interface-foreground-default-secondary">
            Message:
            <code data-testid="ory/screen/error/message">
              {{ parsedError.reason }}
            </code>
          </p>

          <div>
            <button
              class="text-interface-foreground-default-primary underline"
              type="button"
              @click="copyErrorDetails"
            >
              {{ t("error.footer.copy") }}
            </button>
          </div>
        </div>
      </div>
    </component>
  </div>
</template>
