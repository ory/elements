import { UiNode, UiNodeInputAttributes, UiText } from "@ory/client"
import {
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui"
import { MouseEvent, JSX } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { pxToRem } from "../../../common"
import { gridStyle } from "../../../theme"
import { Button, ButtonProps } from "../../button"
import { ButtonLink } from "../../button-link"
import { ButtonSocial, ButtonSocialProps } from "../../button-social"
import { Checkbox } from "../../checkbox"
import { Image } from "../../image"
import { InputField } from "../../input-field"
import { Typography } from "../../typography"
import { NodeMessages } from "./error-messages"

interface ButtonSubmit {
  type: "submit" | "reset" | "button" | undefined
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  formNoValidate?: boolean
  name: string
  value: string
}

export type NodeOverrideProps = {
  buttonOverrideProps?: Partial<ButtonProps>
  buttonSocialOverrideProps?: Partial<ButtonSocialProps>
}

export type NodeProps = {
  node: UiNode
  className?: string
} & NodeOverrideProps

export const getNodeLabel = (node: UiNode): UiText | undefined => {
  const attributes = node.attributes
  if (isUiNodeAnchorAttributes(attributes)) {
    return attributes.title
  }

  if (isUiNodeImageAttributes(attributes)) {
    return node.meta.label
  }

  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.label) {
      return attributes.label
    }
  }

  return node.meta.label
}

const uiTextToFormattedMessage = ({ id, context = {}, text }: UiText) => ({
  id: `kratos-messages.${id}`,
  values: context as Record<string, string>,
  defaultMessage: text,
})

const FormattedKratosMessage = (uiText: UiText) => {
  const { values, ...rest } = uiTextToFormattedMessage(uiText)
  return <FormattedMessage {...rest} values={values} />
}

export const Node = ({
  node,
  className,
  buttonOverrideProps,
  buttonSocialOverrideProps,
}: NodeProps): JSX.Element | null => {
  const intl = useIntl()
  const formatMessage = (uiText: UiText | undefined) => {
    if (!uiText) {
      return ""
    }
    const { values, ...rest } = uiTextToFormattedMessage(uiText)
    return intl.formatMessage(rest, values)
  }

  if (isUiNodeImageAttributes(node.attributes)) {
    return (
      <Image
        src={node.attributes.src}
        alt={formatMessage(node.meta.label)}
        data-testid={`node/image/${node.attributes.id}`}
        header={formatMessage(node.meta.label)}
        width={node.attributes.width}
        height={node.attributes.height}
      />
    )
  } else if (isUiNodeTextAttributes(node.attributes)) {
    const id = node.attributes.id
    return node.attributes.text.id === 1050015 ? (
      <div
        className={gridStyle({ gap: 4, direction: "row" })}
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          gap: pxToRem(48),
          maxWidth: "fit-content",
          alignItems: "center",
        }}
        data-testid={`node/text/${id}`}
      >
        <Typography
          variant="body1"
          data-testid={`node/text/${node.attributes.id}/label`}
          style={{ flexBasis: "100%" }}
        >
          {node.meta.label && <FormattedKratosMessage {...node.meta.label} />}
        </Typography>
        {(
          node.attributes.text.context as {
            secrets: UiText[]
          }
        ).secrets.map((text: UiText, index) => {
          // TODO move to translation
          // if (id === 1050014) {
          // Code already used
          // return (
          //   <pre key={index}>
          //     <del data-testid={`node/text/lookup_secret_codes/text`}>
          //       <code>Used</code>
          //     </del>
          //   </pre>
          // )
          // }
          return (
            <pre data-testid={`node/text/lookup_secret_codes/text`} key={index}>
              <code>
                <FormattedKratosMessage {...text} />
              </code>
            </pre>
          )
        })}
      </div>
    ) : (
      <div className={gridStyle({ gap: 4 })} data-testid={`node/text/${id}`}>
        <Typography
          variant="body1"
          data-testid={`node/text/${node.attributes.id}/label`}
        >
          {node.meta.label && <FormattedKratosMessage {...node.meta.label} />}
        </Typography>
        <pre data-testid={`node/text/${id}/text`}>
          <code>
            <FormattedKratosMessage {...node.attributes.text} />
          </code>
        </pre>
      </div>
    )
  } else if (isUiNodeInputAttributes(node.attributes)) {
    const attrs = node.attributes as UiNodeInputAttributes
    const nodeType = attrs.type

    const isSocial =
      (attrs.name === "provider" || attrs.name === "link") &&
      node.group === "oidc"

    const submit: ButtonSubmit = {
      type: attrs.type as "submit" | "reset" | "button" | undefined,
      name: attrs.name,
      ...(attrs.value && { value: attrs.value }),
    }

    switch (nodeType) {
      case "button":
      case "submit":
        if (isSocial) {
          submit.formNoValidate = true
          submit.onClick = (e) => {
            e.currentTarget.type = "submit"
            e.currentTarget.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            )
          }
        }

        if (attrs.onclick) {
          // This is a bit hacky but it wouldn't work otherwise.
          const oc = attrs.onclick
          submit.onClick = () => {
            eval(oc)
          }
        }

        // the recovery code resend button
        if (
          node.meta.label?.id === 1070007 || // TODO: remove this once everyone has migrated to the fix (https://github.com/ory/kratos/pull/3067)
          node.meta.label?.id === 1070008
        ) {
          // on html forms the required flag on an input field will prevent the form from submitting.
          // we disable validation for this form since the resend button does not rely on any input fields
          submit.formNoValidate = true
        }

        return isSocial ? (
          <ButtonSocial
            className={className}
            header={formatMessage(getNodeLabel(node))}
            brand={attrs.value.toLowerCase()}
            variant={"semibold"}
            size={"medium"}
            fullWidth
            disabled={attrs.disabled}
            {...(buttonSocialOverrideProps && buttonSocialOverrideProps)}
            {...submit}
          />
        ) : (
          <Button
            className={className}
            header={formatMessage(getNodeLabel(node))}
            variant={"semibold"}
            size={"medium"}
            fullWidth
            disabled={attrs.disabled}
            {...(buttonOverrideProps && buttonOverrideProps)}
            {...submit}
          />
        )
      case "datetime-local":
      case "checkbox":
        return (
          <Checkbox
            className={className}
            helperMessage={
              <NodeMessages nodes={[node]} gap={4} textPosition={"start"} />
            }
            label={formatMessage(getNodeLabel(node))}
            name={attrs.name}
            required={attrs.required}
            defaultValue={attrs.value}
            disabled={attrs.disabled}
            defaultChecked={Boolean(attrs.value)}
            dataTestid={`node/input/${attrs.name}`}
          />
        )
      default:
        return (
          <InputField
            helperMessage={
              <NodeMessages nodes={[node]} gap={4} textPosition={"start"} />
            }
            dataTestid={`node/input/${attrs.name}`}
            className={className}
            name={attrs.name}
            header={formatMessage(getNodeLabel(node))}
            type={attrs.type}
            autoComplete={
              attrs.autocomplete ||
              (attrs.name === "identifier" ? "username" : "")
            }
            defaultValue={attrs.value}
            required={attrs.required}
            disabled={attrs.disabled}
            fullWidth
          />
        )
    }
  } else if (isUiNodeAnchorAttributes(node.attributes)) {
    return (
      <ButtonLink
        href={node.attributes.href}
        title={formatMessage(node.attributes.title)}
        data-testid={`node/anchor/${node.attributes.id}`}
        className={className}
        position="center"
      >
        <FormattedKratosMessage {...node.attributes.title} />
      </ButtonLink>
    )
  }
  return null
}
