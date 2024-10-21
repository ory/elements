// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Decorator, Preview } from "@storybook/react"
import { chromaticModes } from "./modes"
import "@ory/elements-react/theme/default/styles.css"
import { merge } from "lodash"

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
    chromatic: {
      modes: chromaticModes,
    },
  },
}

const withI18next: Decorator = (Story, context) => {
  const { locale } = context.globals

  // TODO: this needs a refactor, because it doesn't pass the locale to the Ory Provider at the moment.
  return (
    <Story args={merge({}, { config: { intl: { locale } } }, context.args)} />
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
        { value: "de", title: "Deutsch" },
      ],
      showName: true,
    },
  },
}

export default preview
