// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { OryFlowComponentOverrides } from "@ory/elements-react"
import { MyCustomButton } from "./custom-button"
import { MyCustomCardHeader } from "./custom-card-header"
import { MyCustomSsoButton } from "./custom-social"
import { MyCustomInput } from "./custom-input"
import { MyCustomPinCodeInput } from "./custom-pin-code"
import { MyCustomCheckbox } from "./custom-checkbox"
import { MyCustomConsentScopeCheckbox } from "./custom-consent-scope-checkbox"
import { MyCustomImage } from "./custom-image"
import { MyCustomLabel } from "./custom-label"
import { MyCustomFooter } from "./custom-footer"

export const myCustomComponents: OryFlowComponentOverrides = {
  Node: {
    Button: MyCustomButton,
    SsoButton: MyCustomSsoButton,
    Input: MyCustomInput,
    CodeInput: MyCustomPinCodeInput,
    Checkbox: MyCustomCheckbox,
    ConsentScopeCheckbox: MyCustomConsentScopeCheckbox,
    Image: MyCustomImage,
    Label: MyCustomLabel,
  },
  Card: {
    Header: MyCustomCardHeader,
    Footer: MyCustomFooter,
  },
  Form: {},
}
