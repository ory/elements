import {
  DefaultCard,
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
} from "./card"
import { DefaultAuthMethodListItem } from "./card/auth-methods"
import {
  DefaultFormContainer,
  DefaultMessage,
  DefaultMessageContainer,
} from "./form"
import { DefaultButton } from "./form/button"
import { DefaultCheckbox } from "./form/checkbox"
import { DefaultGroupContainer } from "./form/group-container"
import { DefaultHorizontalDivider } from "./form/horizontal-divider"
import { DefaultImage } from "./form/image"
import { DefaultInput } from "./form/input"
import { DefaultLabel } from "./form/label"
import { DefaultLinkButton } from "./form/link-button"
import { DefaultPinCodeInput } from "./form/pin-code-input"
import {
  DefaultButtonSocial,
  DefaultSocialButtonContainer,
} from "./form/social"
import { DefaultText } from "./form/text"
import { DefaultCurrentIdentifierButton } from "./card/current-identifier-button"
import { OryFlowComponents } from "@ory/elements-react"

export const OryDefaultComponents: OryFlowComponents = {
  Card: DefaultCard,
  CardHeader: DefaultCardHeader,
  CardContent: DefaultCardContent,
  CardFooter: DefaultCardFooter,
  CardLogo: DefaultCardLogo,

  // Generic
  HorizontalDivider: DefaultHorizontalDivider,

  // Form
  FormGroup: DefaultGroupContainer,

  SocialButtonContainer: DefaultSocialButtonContainer,
  MessageContainer: DefaultMessageContainer,
  Message: DefaultMessage,
  Input: DefaultInput,
  Image: DefaultImage,
  Label: DefaultLabel,
  Checkbox: DefaultCheckbox,
  Text: DefaultText,
  PinCodeInput: DefaultPinCodeInput,
  Button: DefaultButton,
  LinkButton: DefaultLinkButton,
  SocialButton: DefaultButtonSocial,
  FormContainer: DefaultFormContainer,

  AuthMethodListItem: DefaultAuthMethodListItem,
  CurrentIdentifierButton: DefaultCurrentIdentifierButton,
}
