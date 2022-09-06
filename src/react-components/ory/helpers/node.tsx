import React, { MouseEvent } from "react"
import { UiNode, UiNodeInputAttributes, UiText } from "@ory/client"
import {
  getNodeLabel,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeTextAttributes,
} from "@ory/integrations/ui"
import { Button } from "../../button"
import { ButtonSocial } from "../../button-social"
import { Checkbox } from "../../checkbox"
import { InputField } from "../../input-field"
import { Image } from "../../image"
import { gridStyle } from "../../../theme"
import { Typography } from "../../typography"
import { pxToRem } from "../../../common"

interface ButtonSubmit {
  type: "submit" | "reset" | "button" | undefined
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  formNoValidate?: boolean
  name: string
  value: string
}

export const Node = ({
  node,
  className,
}: {
  node: UiNode
  className?: string
}): JSX.Element | null => {
  if (isUiNodeImageAttributes(node.attributes)) {
    return (
      <Image
        src={node.attributes.src}
        alt={node.meta.label?.text}
        data-testid={`node/image/${node.attributes.id}`}
        title={node.meta.label?.text}
      />
    )
  } else if (isUiNodeTextAttributes(node.attributes)) {
    const id = node.attributes.id
    return node.attributes.text.id === 1050015 ? (
      <div
        className={gridStyle({ gap: 4, direction: "row" })}
        style={{ display: "inline-flex", flexWrap: "wrap", gap: pxToRem(48) }}
        data-testid={`node/text/${id}`}
      >
        <Typography
          variant="body1"
          data-testid={`node/text/${node.attributes.id}/label`}
        >
          {node.meta.label?.text}
        </Typography>
        {(node.attributes.text.context as { secrets: UiText[] }).secrets.map(
          ({ text, id }: UiText, index) => {
            if (id === 1050014) {
              // Code already used
              return (
                <del
                  data-testid={`node/text/lookup_secret_codes/text/used`}
                  key={index}
                >
                  <code>Used</code>
                </del>
              )
            }
            return (
              <pre
                data-testid={`node/text/lookup_secret_codes/text`}
                key={index}
              >
                <code>{text}</code>
              </pre>
            )
          },
        )}
      </div>
    ) : (
      <div className={gridStyle({ gap: 4 })} data-testid={`node/text/${id}`}>
        <Typography
          variant="body1"
          data-testid={`node/text/${node.attributes.id}/label`}
        >
          {node.meta.label?.text}
        </Typography>
        <pre data-testid={`node/text/${id}/text`}>
          <code>{node.attributes.text.text}</code>
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

        return isSocial ? (
          <ButtonSocial
            className={className}
            title={getNodeLabel(node)}
            brand={attrs.value.toLowerCase()}
            variant={"semibold"}
            size={"large"}
            fullWidth
            disabled={attrs.disabled}
            {...submit}
          />
        ) : (
          <Button
            className={className}
            title={getNodeLabel(node)}
            variant={"semibold"}
            fullWidth
            disabled={attrs.disabled}
            {...submit}
          />
        )
      case "datetime-local":
      case "checkbox":
        return (
          <Checkbox
            className={className}
            label={getNodeLabel(node)}
            name={attrs.name}
            required={attrs.required}
            defaultValue={attrs.value}
            disabled={attrs.disabled}
            checked={Boolean(attrs.value)}
          />
        )
      default:
        return (
          <InputField
            className={className}
            name={attrs.name}
            title={getNodeLabel(node)}
            type={attrs.type}
            autoComplete={
              attrs.autocomplete || attrs.name === "identifier"
                ? "username"
                : ""
            }
            defaultValue={attrs.value}
            required={attrs.required}
            disabled={attrs.disabled}
            fullWidth
          />
        )
    }
  }
  return null
}
