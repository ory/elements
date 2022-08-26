import React from "react"
import { colorSprinkle } from "../../theme"
import { ButtonLink } from "../button-link"
import { Message } from "../message"

export type ErrorProps = {
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

export type AdditionalProps = {
  forgotPasswordURL?: string
  signupURL?: string
  logoutURL?: string
  loginURL?: string
}

export type MessageSectionProps = {
  url: string | undefined
  buttonText: string
  dataTestId?: string
  text?: React.ReactNode
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
