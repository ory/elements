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
import { filterOidcOut, getFinalNodes } from "./card-two-step.utils"
import { OryCardHeader } from "./header"

function isUINodeGroupEnum(method: string): method is UiNodeGroupEnum {
  // @ts-expect-error it's a string array, but typescript thinks the argument must be validated stricter
  return Object.values(UiNodeGroupEnum).includes(method)
}

export function OryTwoStepCard() {
  const {
    flow: { ui },
    flowType,
    formState,
    dispatchFormState,
  } = useOryFlow()

  const { Form, Card } = useComponents()

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
            UiNodeGroupEnum.Captcha,
          ] as UiNodeGroupEnum[]
        ).includes(group),
    )

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
        <OryCardValidationMessages />
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
                {ui.nodes
                  .filter((n) => n.group === UiNodeGroupEnum.Captcha)
                  .map((node, k) => (
                    <Node node={node} key={k} />
                  ))}
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
  return (
    <Card.AuthMethodListContainer>
      {options.map((option) => (
        <Card.AuthMethodListItem
          key={option}
          group={option}
          onClick={() => handleClick(option)}
        />
      ))}
    </Card.AuthMethodListContainer>
  )
}
