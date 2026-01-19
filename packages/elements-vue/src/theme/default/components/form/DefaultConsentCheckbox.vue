<!-- Copyright © 2026 Ory Corp -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed, ref } from "vue"
import type { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useOryIntl } from "../../../../composables/useOryIntl"
import type { IconName } from "../ui/types"
import Icon from "../ui/Icon.vue"

const ScopeIcons: Record<string, IconName> = {
  openid: "personal",
  offline_access: "personal",
  profile: "personal",
  email: "message",
  phone: "phone",
}

const props = withDefaults(
  defineProps<{
    node: UiNode
    attributes: UiNodeInputAttributes
    modelValue?: boolean
    onChange?: (checked: boolean) => void
  }>(),
  {
    modelValue: true,
  },
)

const intl = useOryIntl()
const isChecked = ref(props.modelValue)

const scopeValue = computed(() => props.attributes.value as string)

const scopeTitle = computed(() => {
  const key = `consent.scope.${scopeValue.value}.title`
  const translation = intl.t(key)
  return translation === key ? scopeValue.value : translation
})

const scopeDescription = computed(() => {
  const key = `consent.scope.${scopeValue.value}.description`
  const translation = intl.t(key)
  return translation === key ? "" : translation
})

const iconName = computed(
  (): IconName => ScopeIcons[scopeValue.value] ?? "personal",
)

function handleChange() {
  isChecked.value = !isChecked.value
  props.onChange?.(isChecked.value)
}
</script>

<template>
  <label
    class="col-span-2 flex w-full cursor-pointer items-start gap-3 rounded-buttons p-2 text-left hover:bg-interface-background-default-primary-hover"
    data-testid="ory/screen/consent/scope-checkbox-label"
  >
    <span class="mt-1 text-interface-foreground-brand-primary">
      <Icon :name="iconName" :size="16" />
    </span>
    <span class="inline-flex max-w-full min-w-1 flex-1 flex-col leading-normal">
      <span class="break-words text-interface-foreground-default-primary">
        {{ scopeTitle }}
      </span>
      <span
        v-if="scopeDescription"
        class="text-interface-foreground-default-secondary"
      >
        {{ scopeDescription }}
      </span>
    </span>
    <button
      type="button"
      role="switch"
      :aria-checked="isChecked"
      :class="[
        'relative h-4 w-7 rounded-identifier border p-[3px] transition-all',
        isChecked
          ? 'border-toggle-border-checked bg-toggle-background-checked'
          : 'border-toggle-border-default bg-toggle-background-default',
      ]"
      data-testid="ory/screen/consent/scope-checkbox"
      @click.prevent="handleChange"
    >
      <span
        :class="[
          'block size-2 rounded-identifier transition-all',
          isChecked
            ? 'translate-x-3 bg-toggle-foreground-checked'
            : 'bg-toggle-foreground-default',
        ]"
      />
    </button>
    <input
      type="hidden"
      :name="attributes.name"
      :value="isChecked ? attributes.value : ''"
    />
  </label>
</template>
