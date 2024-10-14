// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { JSX } from "react"

import { colorSprinkle } from "../../../theme"
import { ButtonLink, CustomHref } from "../../button-link"
import { Message } from "../../message"

export interface ErrorProps {
  code: number
  details: {
    docs: string
    hint: string
    rejectReason: string
  }
  message: string
  status: string
  reason: string
}

export interface AdditionalProps {
  forgotPasswordURL?: CustomHref | string
  signupURL?: CustomHref | string
  logoutURL?: CustomHref | string
  loginURL?: CustomHref | string
}

export interface MessageSectionProps {
  url?: CustomHref | string
  buttonText: string
  dataTestId?: string
  text?: string
}

export const MessageSection = ({
  text,
  url,
  buttonText,
  dataTestId,
}: MessageSectionProps): JSX.Element => (
  <Message className={colorSprinkle({ color: "foregroundMuted" })}>
    {text}&nbsp;
    <ButtonLink data-testid={dataTestId} href={url}>
      {buttonText}
    </ButtonLink>
  </Message>
)
