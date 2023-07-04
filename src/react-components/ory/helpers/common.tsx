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

export type CustomOnSubmitCallback<Type> = ({
  body,
  event,
}: {
  body: Type
  event?: React.FormEvent<HTMLFormElement>
}) => void

export function CustomOnSubmit<Type>(
  event: React.FormEvent<HTMLFormElement>,
  callback?: CustomOnSubmitCallback<Type>,
): Type {
  event.preventDefault()
  const form = event.currentTarget
  const formData = new FormData(form)
  let body: Type = Object.fromEntries(formData.entries()) as Type

  // We need the method specified from the name and value of the submit button.
  // when multiple submit buttons are present, the clicked one's value is used.
  if ("submitter" in event.nativeEvent) {
    const method = (
      event.nativeEvent as unknown as { submitter: HTMLInputElement }
    ).submitter
    body = {
      ...body,
      ...{ [method.name]: method.value },
    }
  }

  callback && callback({ body, event })

  return body
}
