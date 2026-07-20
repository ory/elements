// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Preview } from "@storybook/vue3"
import { setup } from "@storybook/vue3"
import { createI18n } from "vue-i18n"
import "./global.css"
import { mockDateDecorator } from "storybook-mock-date-decorator"

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  silentTranslationWarn: true,
  silentFallbackWarn: true,
})

setup((app) => {
  app.use(i18n)
})

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f5f5f5" },
        { name: "dark", value: "#333333" },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    mockAddonConfigs: {
      globalMockData: [
        {
          url: "http://localhost:0000/self-service/logout/browser",
          method: "GET",
          status: 201,
          response: {
            logout_url:
              "http://localhost:0000/self-service/logout?token=ory_lo_XXXXXXXXX",
            logout_token: "ory_lo_XXXXXXXXX",
          },
        },
      ],
      ignoreQueryParams: true,
      refreshStoryOnUpdate: true,
      disableUsingOriginal: false,
    },
    a11y: {
      config: {},
      options: {},
    },
  },
}

export const decorators = [mockDateDecorator]

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "English" },
        { value: "de", title: "German" },
        { value: "sv", title: "Swedish" },
        { value: "fr", title: "French" },
        { value: "es", title: "Spanish" },
      ],
      showName: true,
    },
  },
}

export default preview
