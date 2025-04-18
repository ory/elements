// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
  UiText,
} from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { OryCard, OryCardContent, OryCardFooter } from "."
import { useComponents, useNodeSorter, useOryFlow } from "../../context"
import { isGroupImmediateSubmit } from "../../theme/default/utils/form"
import { findNode, useNodesGroups } from "../../util/ui"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtonsForm } from "../form/social"
import { removeSsoNodes, getFinalNodes } from "./card-two-step.utils"
import { OryCardHeader } from "./header"
import { useIntl } from "react-intl"

type MethodOption = {
  title?: { id: string; values?: Record<string, string> }
}

function isUINodeGroupEnum(method: string): method is UiNodeGroupEnum {
  // @ts-expect-error it's a string array, but typescript thinks the argument must be validated stricter
  return Object.values(UiNodeGroupEnum).includes(method)
}

type MethodOptions = Partial<Record<UiNodeGroupEnum, MethodOption>>

type AuthMethodListProps = {
  options: MethodOptions
  setSelectedGroup: (group: UiNodeGroupEnum) => void
}

export function OryTwoStepCard() {
  const { Form, Card, Message } = useComponents()
  const { flow, flowType, formState, dispatchFormState } = useOryFlow()
  const { ui } = flow
  const intl = useIntl()

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const groupsToShow = useNodesGroups(ui.nodes, {
    // We only want to render groups that have visible elements.
    omit: ["script", "input_hidden"],
  })

  const authMethodBlocks: MethodOptions = Object.fromEntries(
    Object.values(UiNodeGroupEnum)
      .filter((group) => groupsToShow.groups[group]?.length)
      .filter(
        (group) =>
          !(
            [
              UiNodeGroupEnum.Oidc,
              UiNodeGroupEnum.Saml,
              UiNodeGroupEnum.Default,
              UiNodeGroupEnum.IdentifierFirst,
              UiNodeGroupEnum.Profile,
              UiNodeGroupEnum.Captcha,
            ] as UiNodeGroupEnum[]
          ).includes(group),
      )
      .map((g) => [g, {}]),
  )

  const authMethodAdditionalNodes = ui.nodes.filter(({ group }) =>
    (
      [
        UiNodeGroupEnum.Oidc,
        UiNodeGroupEnum.Saml,
        UiNodeGroupEnum.Default,
        UiNodeGroupEnum.IdentifierFirst,
        UiNodeGroupEnum.Profile,
        UiNodeGroupEnum.Captcha,
      ] as UiNodeGroupEnum[]
    ).includes(group),
  )

  // Special case to show the address on code method selector
  if (UiNodeGroupEnum.Code in authMethodBlocks) {
    let identifier = findNode(ui.nodes, {
      group: "identifier_first",
      node_type: "input",
      name: "identifier",
    })?.attributes?.value
    identifier ||= findNode(ui.nodes, {
      group: "code",
      node_type: "input",
      name: "address",
    })?.attributes?.value
    if (identifier) {
      authMethodBlocks[UiNodeGroupEnum.Code] = {
        title: {
          id: "identities.messages.1010023",
          values: { address: identifier },
        },
      }
    }
  }

  const nonSsoNodes = removeSsoNodes(ui.nodes)
  const finalNodes =
    formState.current === "method_active"
      ? getFinalNodes(groupsToShow.groups, formState.method)
      : []

  const handleAfterFormSubmit = (method: unknown) => {
    if (typeof method !== "string" || !isUINodeGroupEnum(method)) {
      return
    }
    if (isGroupImmediateSubmit(method)) {
      dispatchFormState({
        type: "action_select_method",
        method: method,
      })
    }
  }
  const hasSso = ui.nodes.some(
    (node) =>
      node.group === UiNodeGroupEnum.Oidc ||
      node.group === UiNodeGroupEnum.Saml,
  )

  // We want to show the OIDC buttons on all screens, except when the user has selected a different method.
  const showSso = !(
    formState.current === "method_active" &&
    !(
      formState.method === UiNodeGroupEnum.Oidc ||
      formState.method === UiNodeGroupEnum.Saml
    )
  )

  const showSsoDivider =
    hasSso &&
    nonSsoNodes.some((n) => {
      if (isUiNodeInputAttributes(n.attributes)) {
        // We don't need the divider for hidden fields.
        return n.attributes.type !== UiNodeInputAttributesTypeEnum.Hidden
      } else if (isUiNodeScriptAttributes(n.attributes)) {
        // Script tags are hidden
        return false
      }
      return true
    })

  // This is defined in Ory Kratos as well.
  const noMethods: UiText = {
    id: 5000002,
    text: intl.formatMessage({
      id: `identities.messages.5000002`,
      defaultMessage:
        "No authentication methods are available for this request. Please contact the site or app owner.",
    }),
    type: "error",
  }

  switch (formState.current) {
    case "provide_identifier":
      return (
        <OryCard>
          <OryCardHeader />
          <OryCardContent>
            <OryCardValidationMessages />
            {showSso && <OryFormSocialButtonsForm />}
            <OryForm
              data-testid={`ory/form/methods/local`}
              onAfterSubmit={handleAfterFormSubmit}
            >
              <Form.Group>
                {showSsoDivider && <Card.Divider />}
                {nonSsoNodes.sort(sortNodes).map((node, k) => (
                  <Node node={node} key={k} />
                ))}
              </Form.Group>
            </OryForm>
          </OryCardContent>
          <OryCardFooter />
        </OryCard>
      )
    case "select_method":
      return (
        <OryCard>
          <OryCardHeader />
          <OryCardContent>
            <OryCardValidationMessages />
            {showSso && <OryFormSocialButtonsForm />}
            {Object.entries(authMethodBlocks).length > 0 ? (
              <OryForm
                data-testid={`ory/form/methods/local`}
                onAfterSubmit={handleAfterFormSubmit}
              >
                <Form.Group>
                  <Card.Divider />
                  <AuthMethodList
                    options={authMethodBlocks}
                    setSelectedGroup={(group) =>
                      dispatchFormState({
                        type: "action_select_method",
                        method: group,
                      })
                    }
                  />
                  {authMethodAdditionalNodes.sort(sortNodes).map((node, k) => (
                    <Node node={node} key={k} />
                  ))}
                </Form.Group>
              </OryForm>
            ) : (
              !showSso && (
                <div data-testid={`ory/form/methods/local`}>
                  <Message.Root>
                    <Message.Content key={noMethods.id} message={noMethods} />
                  </Message.Root>
                </div>
              )
            )}
          </OryCardContent>
          <OryCardFooter />
        </OryCard>
      )
    case "method_active":
      return (
        <OryCard>
          <OryCardHeader />
          <OryCardContent>
            <OryCardValidationMessages />
            {showSso && <OryFormSocialButtonsForm />}
            <OryForm
              data-testid={`ory/form/methods/local`}
              onAfterSubmit={handleAfterFormSubmit}
            >
              <Form.Group>
                {ui.nodes
                  .filter(
                    (n) =>
                      isUiNodeScriptAttributes(n.attributes) ||
                      n.group === UiNodeGroupEnum.Captcha ||
                      n.group === UiNodeGroupEnum.Default ||
                      n.group === UiNodeGroupEnum.Profile,
                  )
                  .map((node, k) => (
                    <Node node={node} key={k} />
                  ))}
                {finalNodes.sort(sortNodes).map((node, k) => (
                  <Node node={node} key={k} />
                ))}
              </Form.Group>
            </OryForm>
          </OryCardContent>
          <OryCardFooter />
        </OryCard>
      )
  }

  return <>unknown form state: {formState.current}</>
}

function AuthMethodList({ options, setSelectedGroup }: AuthMethodListProps) {
  const { Card } = useComponents()
  const { setValue, getValues } = useFormContext()

  if (Object.entries(options).length === 0) {
    return null
  }

  const handleClick = (group: UiNodeGroupEnum, options?: MethodOption) => {
    if (isGroupImmediateSubmit(group)) {
      // Required because identifier node is not always defined with code method in aal2
      if (
        group === "code" &&
        !getValues("identifier") &&
        options?.title?.values?.address
      ) {
        setValue("identifier", options?.title?.values?.address)
      }
      // If the method is "immediate submit" (e.g. the method's submit button should be triggered immediately)
      // then the method needs to be added to the form data.
      setValue("method", group)
    } else {
      setSelectedGroup(group)
    }
  }

  return (
    <Card.AuthMethodListContainer>
      {Object.entries(options).map(([group, options]) => (
        <Card.AuthMethodListItem
          key={group}
          group={group}
          title={options.title}
          onClick={() => handleClick(group as UiNodeGroupEnum, options)}
        />
      ))}
    </Card.AuthMethodListContainer>
  )
}
