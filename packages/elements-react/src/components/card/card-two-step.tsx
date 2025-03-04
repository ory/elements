// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { OryCard, OryCardContent, OryCardFooter } from "."
import { useComponents, useNodeSorter, useOryFlow } from "../../context"
import { isGroupImmediateSubmit } from "../../theme/default/utils/form"
import { useNodesGroups } from "../../util/ui"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtonsForm } from "../form/social"
import { filterZeroStepGroups, getFinalNodes } from "./card-two-step.utils"
import { OryCardHeader } from "./header"

type MethodOption = {
  title?: { id: string; values?: Record<string, string> }
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

  // Special case for code method selector
  if (Object.values(options).length > 1 && UiNodeGroupEnum.Code in options) {
    const codeAttr = uniqueGroups.groups.code?.[0].attributes
    const address =
      codeAttr?.node_type === "input" && codeAttr?.name === "address"
        ? codeAttr?.value
        : ""
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
  const hasOidc = Boolean(uniqueGroups.groups[UiNodeGroupEnum.Oidc]?.length)

  const zeroStepGroups = filterZeroStepGroups(ui.nodes)
  const finalNodes =
    formState.current === "method_active"
      ? getFinalNodes(uniqueGroups.groups, formState.method)
      : []

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        {hasError ? <OryCardValidationMessages /> : undefined}
        {formState.current === "provide_identifier" && hasOidc && (
          <OryFormSocialButtonsForm />
        )}
        <OryForm
          onAfterSubmit={(method) =>
            isGroupImmediateSubmit(method + "")
              ? dispatchFormState({
                  type: "action_select_method",
                  method: method as UiNodeGroupEnum,
                })
              : undefined
          }
        >
          <Form.Group>
            {formState.current === "provide_identifier" &&
              zeroStepGroups
                .sort(sortNodes)
                .map((node, k) => <Node node={node} key={k} />)}
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
  const { setValue } = useFormContext()

  const handleClick = (group: UiNodeGroupEnum, options?: MethodOption) => {
    if (isGroupImmediateSubmit(group)) {
      // Required because idenitifer node is not defined with code method in aal2
      if (group === "code" && options?.title?.values?.address)
        setValue("identifier", options?.title?.values?.address)
      // If the method is "immediate submit" (e.g. the method's submit button should be triggered immediately)
      // then the method needs to be added to the form data.
      setValue("method", group)
    } else {
      setSelectedGroup(group)
    }
  }
  return Object.entries(options).map(([group, options]) => (
    <Card.AuthMethodListItem
      key={group}
      group={group}
      title={options.title}
      onClick={() => handleClick(group as UiNodeGroupEnum, options)}
    />
  ))
}
