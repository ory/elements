import { ButtonRenderer } from "./button-renderer"
import { CheckboxRenderer } from "./checkbox-renderer"
import { ConsentCheckboxRenderer } from "./consent-checkbox-renderer"
import { ImageRenderer } from "./image-renderer"
import { InputRenderer } from "./input-renderer"
import { SSOButtonRenderer } from "./sso-button-renderer"
import { TextRenderer } from "./text-renderer"
export { type ButtonRenderer } from "./button-renderer"

export const NodeRenderer = {
  Button: ButtonRenderer,
  SsoButton: SSOButtonRenderer,
  ConsentCheckbox: ConsentCheckboxRenderer,
  Input: InputRenderer,
  Checkbox: CheckboxRenderer,
  Image: ImageRenderer,
  Text: TextRenderer,
}
