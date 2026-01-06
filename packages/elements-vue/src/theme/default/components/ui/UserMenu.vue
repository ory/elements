<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import type { Session, LogoutFlow } from "@ory/client-fetch"
import { getUserInitials } from "../../utils/user"
import UserAvatar from "./UserAvatar.vue"
import { IconSettings, IconLogout } from "../../assets/icons"
import { useOryConfig } from "../../../../composables/useOryConfig"
import { useClientLogout } from "../../utils/logout"

const props = withDefaults(
  defineProps<{
    session?: Session | null
    logoutFlow?: LogoutFlow
  }>(),
  {
    session: null,
  },
)

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const config = useOryConfig()
const { logoutFlow: fetchedLogoutFlow } = useClientLogout(config)

const initials = computed(() => getUserInitials(props.session))

const settingsUrl = computed(() => config.project.settings_ui_url)

const logoutUrl = computed(() => {
  return props.logoutFlow?.logout_url ?? fetchedLogoutFlow.value?.logout_url
})

const menuItemClass = [
  "relative flex cursor-pointer items-center outline-hidden transition-colors select-none",
  "gap-6 px-8 py-3 text-sm lg:py-4.5",
  "border-t border-button-secondary-border-default",
  "bg-button-secondary-background-default text-button-secondary-foreground-default",
  "hover:bg-button-secondary-background-hover hover:text-button-secondary-foreground-hover",
]

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", closeMenu)
})

onUnmounted(() => {
  document.removeEventListener("click", closeMenu)
})
</script>

<template>
  <div ref="menuRef" class="relative">
    <UserAvatar :initials="initials" title="User Menu" @click="toggleMenu" />

    <div
      v-if="isOpen"
      :class="[
        'absolute top-full right-0 z-50 mt-4',
        'min-w-76 overflow-hidden',
        'rounded-cards border border-interface-border-default-primary',
        'bg-interface-background-default-primary',
      ]"
    >
      <div class="flex gap-3 px-5 py-4.5">
        <UserAvatar :disabled="true" :initials="initials" />
        <div class="flex flex-col justify-center text-sm leading-tight">
          <div
            class="leading-tight font-medium text-interface-foreground-default-primary"
          >
            {{ initials.primary }}
          </div>
          <div
            v-if="initials.secondary"
            class="leading-tight text-interface-foreground-default-tertiary"
          >
            {{ initials.secondary }}
          </div>
        </div>
      </div>

      <a v-if="settingsUrl" :href="settingsUrl" :class="menuItemClass">
        <IconSettings :size="16" />
        User settings
      </a>

      <a v-if="logoutUrl" :href="logoutUrl" :class="menuItemClass">
        <IconLogout :size="16" />
        Logout
      </a>
    </div>
  </div>
</template>
