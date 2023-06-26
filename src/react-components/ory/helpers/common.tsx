import { colorSprinkle } from "../../../theme"
import { ButtonLink, CustomHref } from "../../button-link"
import { Message } from "../../message"

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
  forgotPasswordURL?: CustomHref | string
  signupURL?: CustomHref | string
  logoutURL?: CustomHref | string
  loginURL?: CustomHref | string
}

export type MessageSectionProps = {
  url?: CustomHref | string
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
