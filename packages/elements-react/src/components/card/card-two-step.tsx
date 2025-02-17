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
import { AuthMethodOption } from "../../types"

// Groups that aren't real authentication methods
const metaGroups: string[] = [
  UiNodeGroupEnum.Default,
  UiNodeGroupEnum.IdentifierFirst,
  UiNodeGroupEnum.Profile,
]

export function OryTwoStepCard() {
  const {
    flow: { ui },
  } = useOryFlow()

  const { Form, Card } = useComponents()
  const { flowType, formState, dispatchFormState } = useOryFlow()

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  // Options that are available to the user
  // (E.g. enabled in the configuration or set up by the user)
  const availableGroups = useNodesGroups(ui.nodes)

  // Filter out meta groups (profile, default, etc) and groups without nodes
  const options = Object.entries(availableGroups.groups).filter(
    ([group, nodes]) => !metaGroups.includes(group) && nodes.length,
  )

  const hasOidc = Boolean(availableGroups.groups[UiNodeGroupEnum.Oidc]?.length)

  const zeroStepGroups = filterZeroStepGroups(ui.nodes)
  const finalNodes =
    formState.current === "method_active"
      ? getFinalNodes(availableGroups.groups, formState.method)
      : []

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        {formState.current === "provide_identifier" && hasOidc && (
          <OryFormSocialButtonsForm />
        )}
        <OryForm
          onAfterSubmit={(method) =>
            isGroupImmediateSubmit(method + "") && method != "oidc"
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

type AuthMethodListProps = {
  options: [string, UiNode[]][]
  setSelectedGroup: (group: UiNodeGroupEnum) => void
}

function AuthMethodList({ options, setSelectedGroup }: AuthMethodListProps) {
  const { Card } = useComponents()
  const { setValue } = useFormContext()

  const handleClick = (group: UiNodeGroupEnum, value: string) => {
    if (group === "oidc") {
      setValue("provider", value)
    }
    if (isGroupImmediateSubmit(group)) {
      // If the method is "immediate submit" (e.g. the method's submit button should be triggered immediately)
      // then the method needs to be added to the form data.
      setValue("method", group)
    } else {
      setSelectedGroup(group)
    }
  }

  const flattenedOptions = options
    .flatMap(mapOptionsToAuthMethodOption)
    .filter(Boolean) as AuthMethodOption[]

  return flattenedOptions.map((option) => (
    <Card.AuthMethodListItem
      key={option.value}
      option={option}
      onClick={() => handleClick(option.group, option.value)}
    />
  ))
}

function mapOptionsToAuthMethodOption([group, nodes]: [string, UiNode[]]):
  | AuthMethodOption
  | (AuthMethodOption | undefined)[]
  | undefined {
  if (group === "oidc") {
    return nodes.map((node) => {
      if (node.attributes.node_type === "input") {
        const provider = (node.attributes.value as string).split("-")[0]
        return {
          group: group,
          value: node.attributes.value,
          iconId: provider,
          label: (node.meta.label?.context as Record<string, string>)?.provider,
          description: node.meta.label,
        }
      }
      // Safety, but the oidc group should only contain input nodes
      return undefined
    })
  }
  return {
    group: group as UiNodeGroupEnum,
    value: group,
  }
}
