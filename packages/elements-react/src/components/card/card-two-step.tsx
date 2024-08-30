import { OryCardHeader } from "./header"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtonsForm } from "../form/social"
import { useComponents, useNodeSorter } from "../../context/component"
import { useOryFlow } from "../../context/flow-context"
import {
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributesNodeTypeEnum,
  UiNodeInputAttributesTypeEnum,
  UiNodeTypeEnum,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import { useState } from "react"
import { OryCard, OryCardContent, OryCardFooter } from "."
import { useNodesGroups } from "../../util/ui"

type ExtendedUiNode = UiNode & { twoStepContinue?: boolean }

const nodeContinue: ExtendedUiNode = {
  attributes: {
    label: {
      id: 1040003,
      text: "Continue",
      type: UiTextTypeEnum.Info,
    },
    name: "two_step_continue",
    disabled: false,
    node_type: UiNodeInputAttributesNodeTypeEnum.Input,
    type: UiNodeInputAttributesTypeEnum.Submit,
    value: "Continue",
  },
  group: "default",
  messages: [],
  meta: {},
  type: UiNodeTypeEnum.Input,
  twoStepContinue: true,
}

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
  const [step, setStep] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState<
    UiNodeGroupEnum | undefined
  >()
  const Components = useComponents()
  const { FormGroup } = useComponents()
  const { flowType } = useOryFlow()
  const {
    flow: { ui },
  } = useOryFlow()

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const uniqueGroups = useNodesGroups(ui.nodes)

  const options: UiNodeGroupEnum[] = Object.values(UiNodeGroupEnum)
    .filter((group) => uniqueGroups[group]?.length)
    .filter(
      (group) =>
        !(
          [UiNodeGroupEnum.Oidc, UiNodeGroupEnum.Default] as UiNodeGroupEnum[]
        ).includes(group),
    )

  const hasOIDC = Boolean(uniqueGroups.oidc?.length)

  const handleOptionSelect = (group: UiNodeGroupEnum) => {
    setSelectedGroup(group)
    setStep(2)
  }

  return (
    <OryCard>
      {step}
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        {step === 0 && hasOIDC && <OryFormSocialButtonsForm />}
        <OryForm>
          <FormGroup>
            {step === 0 && (
              <>
                {uniqueGroups.default?.map((node, k) => (
                  <Node node={node} key={k} />
                ))}
                <Node node={nodeContinue} onClick={() => setStep(1)} />
              </>
            )}
            {step === 1 && (
              <>
                {options.map((option) => (
                  <Components.AuthMethodListItem
                    key={option}
                    group={option}
                    onClick={() => handleOptionSelect(option)}
                  />
                ))}
                <Node node={nodeGoBack} onClick={() => setStep(0)} />
              </>
            )}
            {step === 2 && (
              <>
                {selectedGroup &&
                  uniqueGroups[selectedGroup]
                    ?.sort(sortNodes)
                    .map((node, k) => <Node node={node} key={k} />)}
                <Node node={nodePickMethod} onClick={() => setStep(1)} />
              </>
            )}
          </FormGroup>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}
