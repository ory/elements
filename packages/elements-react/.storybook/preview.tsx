// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Decorator, Preview } from "@storybook/react"
import { merge } from "lodash"
import "./global.css"

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
  },
}

const withI18next: Decorator = (Story, context) => {
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
export const decorators = [withI18next]

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
