// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { OryCard, OryCardContent, OryCardFooter } from "."
import { useComponents, useNodeSorter, useOryFlow } from "../../context"
import { isGroupImmediateSubmit } from "../../theme/default/utils/form"
import { findNode, useNodesGroups } from "../../util/ui"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtonsForm } from "../form/social"
import { filterOidcOut, getFinalNodes } from "./card-two-step.utils"
import { OryCardHeader } from "./header"

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
  const { Form, Card } = useComponents()
  const { flow, flowType, formState, dispatchFormState } = useOryFlow()
  const { ui } = flow

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const uniqueGroups = useNodesGroups(ui.nodes)

  const options: MethodOptions = Object.fromEntries(
    Object.values(UiNodeGroupEnum)
      .filter((group) => uniqueGroups.groups[group]?.length)
      .filter(
        (group) =>
          !(
            [
              UiNodeGroupEnum.Oidc,
              UiNodeGroupEnum.Default,
              UiNodeGroupEnum.IdentifierFirst,
              UiNodeGroupEnum.Profile,
            ] as UiNodeGroupEnum[]
          ).includes(group),
      )
      .map((g) => [g, {}]),
  )

  // Special case to show the address on code method selector
  if (UiNodeGroupEnum.Code in options) {
    const address = findNode(ui.nodes, {
      group: /identifier_first|code/,
      node_type: "input",
    })?.attributes?.value
    if (address) {
      options[UiNodeGroupEnum.Code] = {
        title: {
          id: "identities.messages.1010023",
          values: { address },
        },
      }
    }
  }

  const hasError = Boolean(ui.messages?.some((m) => m.type === "error"))

  const nonOidcNodes = filterOidcOut(ui.nodes)
  const finalNodes =
    formState.current === "method_active"
      ? getFinalNodes(uniqueGroups.groups, formState.method)
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
  const hasOidc = ui.nodes.some((node) => node.group === UiNodeGroupEnum.Oidc)

  // We want to show the OIDC buttons on all screens, except when the user has selected a different method.
  const showOidc = !(
    formState.current === "method_active" && formState.method !== "oidc"
  )

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        {hasError ? <OryCardValidationMessages /> : undefined}
        {showOidc && <OryFormSocialButtonsForm />}
        <OryForm onAfterSubmit={handleAfterFormSubmit}>
          <Form.Group>
            {formState.current === "provide_identifier" && (
              <>
                {hasOidc && <Card.Divider />}
                {nonOidcNodes.sort(sortNodes).map((node, k) => (
                  <Node node={node} key={k} />
                ))}
              </>
            )}
            {formState.current === "select_method" && (
              <>
                <Card.Divider />
                <AuthMethodList
                  options={options}
                  setSelectedGroup={(group) =>
                    dispatchFormState({
                      type: "action_select_method",
                      method: group,
                    })
                  }
                />
              </>
            )}
            {formState.current === "method_active" && (
              <>
                {ui.nodes
                  .filter((n) => n.type === "script")
                  .map((node, k) => (
                    <Node node={node} key={k} />
                  ))}
                {finalNodes.sort(sortNodes).map((node, k) => (
                  <Node node={node} key={k} />
                ))}
              </>
            )}
          </Form.Group>
          <OryCardFooter />
        </OryForm>
      </OryCardContent>
    </OryCard>
  )
}

function AuthMethodList({ options, setSelectedGroup }: AuthMethodListProps) {
  const { Card } = useComponents()
  const { setValue, getValues } = useFormContext()

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
