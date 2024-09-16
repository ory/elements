import {
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeInputAttributesNodeTypeEnum,
  UiNodeInputAttributesTypeEnum,
  UiNodeTypeEnum,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import { useState } from "react"
import { OryCard, OryCardContent, OryCardFooter } from "."
import { useComponents, useNodeSorter, useOryFlow } from "../../context"
import { useNodesGroups } from "../../util/ui"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtonsForm } from "../form/social"
import { OryCardHeader } from "./header"

type ExtendedUiNode = UiNode & { twoStepContinue?: boolean }

const nodePickMethod: ExtendedUiNode = {
  attributes: {
    label: {
      id: 1040003111,
      text: "Try another method",
      type: UiTextTypeEnum.Info,
    },
    name: "two_step_select",
    disabled: false,
    node_type: UiNodeInputAttributesNodeTypeEnum.Input,
    type: UiNodeInputAttributesTypeEnum.Submit,
    value: "Try another method",
  },
  group: "default",
  messages: [],
  meta: {},
  type: UiNodeTypeEnum.Input,
  twoStepContinue: true,
}

const nodeGoBack: ExtendedUiNode = {
  attributes: {
    label: {
      id: 1040008,
      text: "Back",
      type: UiTextTypeEnum.Info,
    },
    name: "two_step_back",
    disabled: false,
    node_type: UiNodeInputAttributesNodeTypeEnum.Input,
    type: UiNodeInputAttributesTypeEnum.Submit,
    value: "Back",
  },
  group: "default",
  messages: [],
  meta: {},
  type: UiNodeTypeEnum.Input,
  twoStepContinue: true,
}

export function OryTwoStepCard() {
  const {
    flow: { ui },
  } = useOryFlow()

  const isChoosingMethod =
    ui.nodes.some(
      (node) =>
        "value" in node.attributes && node.attributes.value === "profile:back",
    ) ||
    ui.nodes.some(
      (node) =>
        node.group === UiNodeGroupEnum.IdentifierFirst &&
        "name" in node.attributes &&
        node.attributes.name === "identifier" &&
        node.attributes.type === "hidden",
    )

  const [step, setStep] = useState(isChoosingMethod ? 1 : 0)
  const [selectedGroup, setSelectedGroup] = useState<
    UiNodeGroupEnum | undefined
  >()
  const Components = useComponents()
  const { FormGroup } = useComponents()
  const { flowType } = useOryFlow()

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const uniqueGroups = useNodesGroups(ui.nodes)

  const options: UiNodeGroupEnum[] = Object.values(UiNodeGroupEnum)
    .filter((group) => uniqueGroups[group]?.length)
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

  const hasOIDC = Boolean(uniqueGroups.oidc?.length)

  const handleOptionSelect = (group: UiNodeGroupEnum) => {
    setSelectedGroup(group)
    setStep(2)
  }

  const zeroStepGroups = ui.nodes.filter(
    (node) => node.group !== UiNodeGroupEnum.Oidc,
  )

  const selectedNodes: UiNode[] = selectedGroup
    ? (uniqueGroups[selectedGroup] ?? [])
    : []

  const finalNodes = [
    ...(uniqueGroups?.identifier_first ?? []),
    ...(uniqueGroups?.default ?? []),
  ]
    .flat()
    .filter((node) => {
      return "type" in node.attributes && node.attributes.type === "hidden"
    })
    .concat(selectedNodes)

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        {step === 0 && hasOIDC && <OryFormSocialButtonsForm />}
        <OryForm>
          <FormGroup>
            {step === 0 &&
              zeroStepGroups
                .sort(sortNodes)
                .map((node, k) => <Node node={node} key={k} />)}
            {step === 1 && (
              <>
                {options.map((option) => (
                  <Components.AuthMethodListItem
                    key={option}
                    group={option}
                    onClick={() => handleOptionSelect(option)}
                  />
                ))}
                <Components.Button
                  attributes={nodeGoBack.attributes as UiNodeInputAttributes}
                  node={nodeGoBack}
                  onClick={() => setStep(0)}
                />
              </>
            )}
            {step === 2 && (
              <>
                {finalNodes.sort(sortNodes).map((node, k) => (
                  <Node node={node} key={k} />
                ))}
                <Components.Button
                  attributes={
                    nodePickMethod.attributes as UiNodeInputAttributes
                  }
                  node={nodePickMethod}
                  onClick={() => setStep(1)}
                />
              </>
            )}
          </FormGroup>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}
