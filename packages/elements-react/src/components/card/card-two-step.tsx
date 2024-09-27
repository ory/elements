import {
  FlowType,
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
import {
  filterZeroStepGroups,
  getFinalNodes,
  isChoosingMethod,
} from "./card-two-step.utils"

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

  const zeroStepGroups = filterZeroStepGroups(ui.nodes)
  const finalNodes = getFinalNodes(uniqueGroups, selectedGroup)

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
        {step === ProcessStep.ProvideIdentifier && hasOIDC && (
          <OryFormSocialButtonsForm />
        )}
        <OryForm>
          <FormGroup>
            {step === ProcessStep.ProvideIdentifier &&
              zeroStepGroups
                .sort(sortNodes)
                .map((node, k) => <Node node={node} key={k} />)}
            {step === ProcessStep.ChooseAuthMethod && (
              <>
                <BackButton
                  href={
                    flowType === FlowType.Login
                      ? config.project.login_ui_url
                      : undefined
                  }
                />
                {options.map((option) => (
                  <Components.AuthMethodListItem
                    key={option}
                    group={option}
                    onClick={() => setSelectedGroup(option)}
                  />
                ))}
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
          </FormGroup>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}

type BackButtonProps = {
  onClick?: () => void
  href?: string
}

const BackButton = ({ onClick, href }: BackButtonProps) => {
  const {
    flow: { ui },
  } = useOryFlow()
  const Components = useComponents()

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
    <Components.CurrentIdentifierButton
      node={nodeBackButton}
      attributes={nodeBackButton.attributes as UiNodeInputAttributes}
      onClick={onClick}
      type={onClick ? "button" : undefined}
      href={href}
    />
  )
}
