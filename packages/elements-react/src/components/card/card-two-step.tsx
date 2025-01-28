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
import { OryFormOidcButtons, OryFormSocialButtonsForm } from "../form/social"
import { filterZeroStepGroups, getFinalNodes } from "./card-two-step.utils"
import { OryCardHeader } from "./header"

export function OryTwoStepCard() {
  const {
    flow: { ui },
  } = useOryFlow()

  const { Form, Card } = useComponents()
  const { flowType, formState, dispatchFormState } = useOryFlow()

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const uniqueGroups = useNodesGroups(ui.nodes)

  const options: UiNodeGroupEnum[] = Object.values(UiNodeGroupEnum)
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
        <OryCardValidationMessages />
        {hasOidc && <OryFormOidcButtons />}
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
            {(
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
            ) && formState.current === "method_active"}
          </Form.Group>
          <OryCardFooter />
        </OryForm>
      </OryCardContent>
    </OryCard>
  )
}

type AuthMethodListProps = {
  options: UiNodeGroupEnum[]
  setSelectedGroup: (group: UiNodeGroupEnum) => void
}

function AuthMethodList({ options, setSelectedGroup }: AuthMethodListProps) {
  const { Card } = useComponents()
  const { setValue } = useFormContext()

  const handleClick = (group: UiNodeGroupEnum) => {
    if (isGroupImmediateSubmit(group)) {
      // If the method is "immediate submit" (e.g. the method's submit button should be triggered immediately)
      // then the method needs to be added to the form data.
      setValue("method", group)
    } else {
      setSelectedGroup(group)
    }
  }
  return options.map((option) => (
    <Card.AuthMethodListItem
      key={option}
      group={option}
      onClick={() => handleClick(option)}
    />
  ))
}
