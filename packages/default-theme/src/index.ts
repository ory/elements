import {
  DefaultCard,
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
} from "./components/card"
import { DefaultAuthMethodListItem } from "./components/card/auth-methods"
import {
  DefaultFormContainer,
  DefaultMessage,
  DefaultMessageContainer,
} from "./components/form"
import { DefaultButton } from "./components/form/button"
import { DefaultCheckbox } from "./components/form/checkbox"
import { DefaultGroupContainer } from "./components/form/group-container"
import { DefaultHorizontalDivider } from "./components/form/horizontal-divider"
import { DefaultImage } from "./components/form/image"
import { DefaultInput } from "./components/form/input"
import { DefaultLabel } from "./components/form/label"
import { DefaultLinkButton } from "./components/form/link-button"
import { DefaultPinCodeInput } from "./components/form/pin-code-input"
import {
  DefaultButtonSocial,
  DefaultSocialButtonContainer,
} from "./components/form/social"
import { DefaultText } from "./components/form/text"
import type { OryFlowComponents } from "@ory/react-headless"
import { DefaultCurrentIdentifierButton } from "./components/card/current-identifier-button"

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
