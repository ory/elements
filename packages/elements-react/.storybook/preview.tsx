// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Decorator, Preview } from "@storybook/react"
import { merge } from "lodash"
import "./global.css"
import { mockDateDecorator } from "storybook-mock-date-decorator"

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
          // An array of mock objects which will add in every story
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
      ignoreQueryParams: true, // Whether or not to ignore query parameters globally
      refreshStoryOnUpdate: true, // This property re-renders the story if there's any data changes
      disableUsingOriginal: false, // This property disables the toggle (on/off) option to use the original endpoint
    },
    a11y: {
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {
        // TODO: try to meet "wcag2aaa" (error messages are don't have enough contrast)
        // runOnly: ["wcag2a", "wcag2aa", "best-practice"],
      },
    },
  },
}

const withProviders: Decorator = (Story, context) => {
  const { locale } = context.globals

  return (
    <Story
      args={merge(
        {},
        {
          config: {
            intl: {
              locale: locale && typeof locale === "string" ? locale : "en",
            },
          },
        },
        context.args,
      )}
    />
  )
}

// export decorators for storybook to wrap your stories in
export const decorators = [withProviders, mockDateDecorator]

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
