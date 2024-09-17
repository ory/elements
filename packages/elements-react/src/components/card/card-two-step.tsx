import {
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
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
import { useFormContext } from "react-hook-form"

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
  }

  const zeroStepGroups = ui.nodes.filter(
    (node) => node.group !== UiNodeGroupEnum.Oidc,
  )

  const selectedNodes: UiNode[] = selectedGroup
    ? (uniqueGroups[selectedGroup] ?? [])
    : []

  const nodeBackButton = ui.nodes.find(
    (node) =>
      ("value" in node.attributes &&
        node.attributes.value === "profile:back") ||
      ("name" in node.attributes &&
        node.attributes.name === "identifier" &&
        node.group === "identifier_first"),
  )

  const finalNodes = [
    ...(uniqueGroups?.identifier_first ?? []),
    ...(uniqueGroups?.default ?? []),
  ]
    .flat()
    .filter(
      (node) => "type" in node.attributes && node.attributes.type === "hidden",
    )
    .concat(selectedNodes)

  const step = selectedGroup ? 2 : isChoosingMethod ? 1 : 0

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
                {nodeBackButton && <BackButton />}
                {options.map((option) => (
                  <Components.AuthMethodListItem
                    key={option}
                    group={option}
                    onClick={() => handleOptionSelect(option)}
                  />
                ))}
              </>
            )}
            {step === 2 && (
              <>
                {nodeBackButton && (
                  <Components.CurrentIdentifierButton
                    node={nodeBackButton}
                    attributes={
                      nodeBackButton.attributes as UiNodeInputAttributes
                    }
                    onClick={() => setSelectedGroup(undefined)}
                  />
                )}
                {finalNodes.sort(sortNodes).map((node, k) => (
                  <Node node={node} key={k} />
                ))}
              </>
            )}
          </FormGroup>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}

const BackButton = () => {
  const {
    flow: { ui },
  } = useOryFlow()
  const { setValue } = useFormContext()
  const Components = useComponents()

  const nodeBackButton = ui.nodes.find(
    (node) =>
      ("value" in node.attributes &&
        node.attributes.value === "profile:back") ||
      ("name" in node.attributes &&
        node.attributes.name === "identifier" &&
        node.group === "identifier_first"),
  )

  if (!nodeBackButton) {
    return null
  }

  return (
    <Components.CurrentIdentifierButton
      node={nodeBackButton}
      attributes={nodeBackButton.attributes as UiNodeInputAttributes}
      onClick={() => {
        setValue(
          nodeBackButton.attributes.name,
          nodeBackButton.attributes.value,
        )
      }}
    />
  )
}
