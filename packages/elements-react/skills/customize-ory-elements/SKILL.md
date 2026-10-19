---
name: customize-ory-elements
description:
  Restyle or replace parts of the login, registration, recovery, verification,
  and settings UI rendered by @ory/elements-react. Use when asked to change the
  look of Ory Elements, apply a brand theme, or swap a button, input, card
  header, footer, or any other part for a custom component. Not for the legacy
  @ory/elements package.
---

# Customize Ory Elements

This skill ships inside `@ory/elements-react` and matches the installed version.
It covers the two supported ways to change the UI: CSS variables and component
overrides. Read `node_modules/@ory/elements-react/agents/GUIDE.md` first if the
project does not render a flow yet.

Don't use `ThemeProvider`, `className` props on flow components, or a `theme`
object. They belong to the legacy `@ory/elements` package and do not exist in
`@ory/elements-react`.

## 1. Pick the smallest tool

| Goal                                                      | Use                |
| --------------------------------------------------------- | ------------------ |
| Colors, border radius, fonts                              | CSS variables      |
| Different markup for one part, such as a button or header | Component override |
| Extra content around the card                             | Your page layout   |
| Different text                                            | `config.intl`      |

Don't copy the default components out of `node_modules`, and don't render
`flow.ui.nodes` by hand to change one element.

## 2. Theme with CSS variables

Confirm that the stylesheet is imported once, in a layout that wraps the flow
pages:

```tsx
// app/auth/layout.tsx
import "@ory/elements-react/theme/styles.css"
import type { PropsWithChildren } from "react"

export default function AuthLayout({ children }: PropsWithChildren) {
  return <main>{children}</main>
}
```

Override variables in a stylesheet that loads after it. Look up the names in
`node_modules/@ory/elements-react/tailwind/generated/variables.css`. Don't
invent variable names: an unknown variable has no effect and no error.

```css
.ory-elements {
  --ui-50: #f0f4f8;
  --interface-background-brand-primary: #1d4ed8;
  --button-primary-background-default: #1d4ed8;
  --radius-cards: 1rem;
}
```

Variables cascade: `--ui-*` and `--brand-*` feed the `--interface-*` variables,
which feed the component variables such as `--button-*` and `--input-*`.
Override the most general variable that gives the result.

## 3. Find the slot to override

The overridable parts are the properties of the `OryFlowComponents` type, in
five groups: `Card`, `Node`, `Form`, `Message`, and `Page`. Read
`node_modules/@ory/elements-react/agents/slots.md` to find the slot, the props
type it receives, and its default component. The file is generated from the
types of the installed version. A path that it does not list does not exist.
`slots.json` in the same directory has the same data.

Common slots:

| Slot              | Props type               | Renders                          |
| ----------------- | ------------------------ | -------------------------------- |
| `Card.Header`     | `OryCardProps`           | Logo, title, and subtitle        |
| `Card.Footer`     | `OryCardFooterProps`     | Links below the form             |
| `Node.Button`     | `OryNodeButtonProps`     | Submit and other buttons         |
| `Node.SsoButton`  | `OryNodeSsoButtonProps`  | Social sign-in buttons           |
| `Node.Input`      | `OryNodeInputProps`      | Text, email, and password inputs |
| `Node.CodeInput`  | `OryNodeInputProps`      | One-time code input              |
| `Node.Checkbox`   | `OryNodeCheckboxProps`   | Checkboxes                       |
| `Node.Label`      | `OryNodeLabelProps`      | Label and error around an input  |
| `Message.Content` | `OryMessageContentProps` | A validation or info message     |

## 4. Write the override

Spread `buttonProps` or `inputProps` onto the native element. They carry the
name, value, and event handlers that submit the flow. A component that drops
them renders but does not work.

```tsx
// components/ory/button.tsx
"use client"

import { getNodeLabel } from "@ory/client-fetch"
import type { OryNodeButtonProps } from "@ory/elements-react"

export function Button({
  node,
  buttonProps,
  isSubmitting,
}: OryNodeButtonProps) {
  const label = getNodeLabel(node)

  return (
    <button {...buttonProps} className="my-button">
      {isSubmitting ? "Submitting" : label?.text}
    </button>
  )
}
```

```tsx
// components/ory/input.tsx
"use client"

import type { OryNodeInputProps } from "@ory/elements-react"

export function Input({ inputProps }: OryNodeInputProps) {
  return <input {...inputProps} className="my-input" />
}
```

Use the hooks from `@ory/elements-react` for context. They only work below a
flow component:

```tsx
// components/ory/card-header.tsx
"use client"

import { useOryConfiguration, useOryFlow } from "@ory/elements-react"

export function CardHeader() {
  const { flowType } = useOryFlow()
  const { project } = useOryConfiguration()

  return (
    <header>
      <h1>{project.name}</h1>
      <p>Continue with {flowType}</p>
    </header>
  )
}
```

## 5. Pass the overrides to every flow component

Collect the overrides in one typed object so that a wrong slot name fails the
type check:

```tsx
// components/ory/index.tsx
import type { OryFlowComponentOverrides } from "@ory/elements-react"

import { Button } from "./button"
import { CardHeader } from "./card-header"
import { Input } from "./input"

export const components: OryFlowComponentOverrides = {
  Card: {
    Header: CardHeader,
  },
  Node: {
    Button,
    Input,
  },
}
```

```tsx
// app/auth/login/page.tsx
import { Login } from "@ory/elements-react/theme"
import { getLoginFlow, type OryPageParams } from "@ory/nextjs/app"

import { components } from "@/components/ory"
import config from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return <Login flow={flow} config={config} components={components} />
}
```

```ts
// ory.config.ts
import type { OryClientConfiguration } from "@ory/elements-react"

const config: OryClientConfiguration = {
  project: {
    name: "My application",
    default_redirect_url: "/",
    error_ui_url: "/auth/error",
    login_ui_url: "/auth/login",
    registration_ui_url: "/auth/registration",
    recovery_ui_url: "/auth/recovery",
    verification_ui_url: "/auth/verification",
    settings_ui_url: "/settings",
    registration_enabled: true,
    recovery_enabled: true,
    verification_enabled: true,
  },
}

export default config
```

Pass the same object to `Registration`, `Recovery`, `Verification`, and
`Settings`, or the flows look different from each other.

## 6. Verify

1. Run the type check, for example `npx tsc --noEmit`. `Card: { CardHeader }`
   and other wrong slot names fail here.
2. Load each flow page. Submit the form once with invalid input and once with
   valid input: a custom `Node.Button` or `Node.Input` that drops `buttonProps`
   or `inputProps` renders but does not submit.
3. Read the browser console and the server output for messages that start with
   `[@ory/elements-react]`.
