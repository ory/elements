<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from "vue"
import type { Session } from "@ory/client-fetch"
import { useComponents } from "../../../../composables/useComponents"
import { useOryFlow } from "../../../../composables/useOryFlow"
import { useOryConfig } from "../../../../composables/useOryConfig"
import { useOryIntl } from "../../../../composables/useOryIntl"
import { useSession } from "../../../../client/useSession"
import UserMenu from "./UserMenu.vue"
import Icon from "./Icon.vue"

const { Card } = useComponents()
const flow = useOryFlow()
const config = useOryConfig()
const intl = useOryIntl()
const { session } = useSession()

const returnUrl = computed(() => {
  return (
    flow.flowContainer.value.flow.return_to ??
    config.project.default_redirect_url ??
    "/"
  )
})
</script>

<template>
  <div
    class="mt-4 flex w-full max-w-[var(--breakpoint-sm)] flex-col gap-3 px-4 md:mt-16 md:max-w-[712px] lg:max-w-[802px] xl:max-w-[896px]"
  >
    <div class="flex flex-col gap-8 md:gap-12">
      <div class="flex max-h-10 flex-1 items-center justify-between gap-2">
        <div class="h-9">
          <component :is="Card.Logo" v-if="Card.Logo" />
        </div>
        <UserMenu :session="session as Session | null" />
      </div>

      <div v-if="returnUrl">
        <a
          data-testid="ory/screen/settings/back-button"
          :href="returnUrl"
          class="inline-flex items-center gap-2 text-button-link-default-primary hover:text-button-link-default-primary-hover"
        >
          <Icon name="arrow-left" :size="20" />
          {{ intl.t("settings.navigation-back-button") }}
        </a>
      </div>
    </div>
  </div>
</template>
