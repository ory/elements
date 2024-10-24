// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { OryCard, OryCardContent, OryCardFooter } from "."
import { useComponents, useNodeSorter, useOryFlow } from "../../context"
import { useNodesGroups } from "../../util/ui"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtonsForm } from "../form/social"
import {
  filterZeroStepGroups,
  getFinalNodes,
  isChoosingMethod,
} from "./card-two-step.utils"
import { OryCardHeader } from "./header"
import { isGroupImmediateSubmit } from "../../theme/default/utils/form"

enum ProcessStep {
  ProvideIdentifier,
  ChooseAuthMethod,
  ExecuteAuthMethod,
}

export function OryTwoStepCard() {
  const {
    flow: { ui },
    config,
  } = useOryFlow()

  const choosingMethod = isChoosingMethod(ui.nodes)

  const [selectedGroup, setSelectedGroup] = useState<
    UiNodeGroupEnum | undefined
  >()
  const { Form } = useComponents()
  const { flowType } = useOryFlow()

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
  const finalNodes = getFinalNodes(uniqueGroups.groups, selectedGroup)

  const step = selectedGroup
    ? ProcessStep.ExecuteAuthMethod
    : choosingMethod
      ? ProcessStep.ChooseAuthMethod
      : ProcessStep.ProvideIdentifier

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        {step === ProcessStep.ProvideIdentifier && hasOidc && (
          <OryFormSocialButtonsForm />
        )}
        <OryForm
          onAfterSubmit={(method) =>
            isGroupImmediateSubmit(method + "")
              ? setSelectedGroup(method as UiNodeGroupEnum)
              : undefined
          }
        >
          <Form.Group>
            {step === ProcessStep.ProvideIdentifier &&
              zeroStepGroups
                .sort(sortNodes)
                .map((node, k) => <Node node={node} key={k} />)}
            {step === ProcessStep.ChooseAuthMethod && (
              <>
                {flowType === FlowType.Login && (
                  <BackButton href={config.project.login_ui_url} />
                )}
                <AuthMethodList
                  options={options}
                  setSelectedGroup={setSelectedGroup}
                />
              </>
            )}
            {step === ProcessStep.ExecuteAuthMethod && (
              <>
                <BackButton onClick={() => setSelectedGroup(undefined)} />
                {finalNodes.sort(sortNodes).map((node, k) => (
                  <Node node={node} key={k} />
                ))}
              </>
            )}
          </Form.Group>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
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
      // then the methid needs to be added to the form data.
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

type BackButtonProps = {
  onClick?: () => void
  href?: string
}

const BackButton = ({ onClick, href }: BackButtonProps) => {
  const {
    flow: { ui },
  } = useOryFlow()
  const { Node } = useComponents()

  const nodeBackButton = ui.nodes.find(
    (node) =>
      // ("value" in node.attributes &&
      //   node.attributes.value === "profile:back") ||
      "name" in node.attributes &&
      node.attributes.name === "identifier" &&
      node.group === "identifier_first",
  )

  if (!nodeBackButton) {
    return null
  }

  return (
    <Node.CurrentIdentifierButton
      node={nodeBackButton}
      attributes={nodeBackButton.attributes as UiNodeInputAttributes}
      onClick={onClick}
      type={onClick ? "button" : undefined}
      href={href}
    />
  )
}
