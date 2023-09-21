import { UiNode, UiText } from "@ory/client"
import {
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui"
import { JSX, MouseEvent } from "react"
import { IntlShape, useIntl } from "react-intl"

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

export interface NodeOverrideProps {
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

export const uiTextToFormattedMessage = (
  { id, context = {}, text }: Omit<UiText, "type">,
  intl: IntlShape,
) =>
  intl.formatMessage(
    {
      id: `identities.messages.${id}`,
      defaultMessage: text,
    },
    Object.entries(context).reduce<
      Record<string, string | number | string[] | number[]>
    >(
      (values, [key, value]) =>
        Array.isArray(value)
          ? {
              ...values,
              [key]: value,
              [key + "_list"]: intl.formatList<string | number>(value),
            }
          : key.endsWith("_unix")
          ? {
              ...values,
              [key]: intl.formatDate(new Date(value * 1000)),
              [key + "_since"]: intl.formatDateTimeRange(
                new Date(value as string | number),
                new Date(),
              ),
              [key + "_since_minutes"]:
                (value - new Date().getTime() / 1000) / 60,
              [key + "_until"]: intl.formatDateTimeRange(
                new Date(),
                new Date(value as string | number),
              ),
              [key + "_until_minutes"]:
                (new Date().getTime() / 1000 - value) / 60,
            }
          : {
              ...values,
              [key]: value as string | number,
            },
      {},
    ),
  )

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
    return uiTextToFormattedMessage(uiText, intl)
  }

  if (isUiNodeImageAttributes(node.attributes)) {
    return (
      <Image
        src={node.attributes.src}
        alt={formatMessage(node.meta.label) as string}
        data-testid={`node/image/${node.attributes.id}`}
        header={formatMessage(node.meta.label) as string}
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
          {formatMessage(node.meta.label)}
        </Typography>
        {(
          node.attributes.text.context as {
            secrets: UiText[]
          }
        ).secrets.map((text: UiText, index) => (
          <pre data-testid={`node/text/lookup_secret_codes/text`} key={index}>
            <code>{formatMessage(text)}</code>
          </pre>
        ))}
      </div>
    ) : (
      <div className={gridStyle({ gap: 4 })} data-testid={`node/text/${id}`}>
        <Typography
          variant="body1"
          data-testid={`node/text/${node.attributes.id}/label`}
        >
          {formatMessage(node.meta.label)}
        </Typography>
        <pre data-testid={`node/text/${id}/text`}>
          <code>{formatMessage(node.attributes.text)}</code>
        </pre>
      </div>
    )
  } else if (isUiNodeInputAttributes(node.attributes)) {
    const attrs = node.attributes
    const nodeType = attrs.type

    const isSocial =
      (attrs.name === "provider" ?? attrs.name === "link") &&
      node.group === "oidc"

    const submit: ButtonSubmit = {
      type: attrs.type as "submit" | "reset" | "button" | undefined,
      name: attrs.name,
      ...(attrs.value && { value: attrs.value as string }),
    } as ButtonSubmit

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
          node.meta.label?.id === 1070007 ?? // TODO: remove this once everyone has migrated to the fix (https://github.com/ory/kratos/pull/3067)
          node.meta.label?.id === 1070008
        ) {
          // on html forms the required flag on an input field will prevent the form from submitting.
          // we disable validation for this form since the resend button does not rely on any input fields
          submit.formNoValidate = true
        }

        return isSocial ? (
          <ButtonSocial
            className={className}
            header={formatMessage(getNodeLabel(node)) as string}
            brand={(attrs.value as string).toLowerCase()}
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
            header={formatMessage(getNodeLabel(node)) as string}
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
            label={formatMessage(getNodeLabel(node)) as string}
            name={attrs.name}
            required={attrs.required}
            defaultValue={attrs.value as string | number | string[]}
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
            header={formatMessage(getNodeLabel(node)) as string}
            type={attrs.type}
            autoComplete={
              attrs.autocomplete ??
              (attrs.name === "identifier" ? "username" : "")
            }
            defaultValue={attrs.value as string | number | string[]}
            required={attrs.required}
            disabled={attrs.disabled}
          />
        )
    }
  } else if (isUiNodeAnchorAttributes(node.attributes)) {
    return (
      <ButtonLink
        href={node.attributes.href}
        title={formatMessage(node.attributes.title) as string}
        data-testid={`node/anchor/${node.attributes.id}`}
        className={className}
        position="center"
      >
        {formatMessage(node.attributes.title)}
      </ButtonLink>
    )
  }
  return null
}
