// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { useIntl } from "react-intl"
import { uiTextToFormattedMessage } from "../index"

export const Inner = ({ uiText }: { uiText: UiText }) => {
  const intl = useIntl()

  return <div>{uiTextToFormattedMessage(uiText, intl)}</div>
}
