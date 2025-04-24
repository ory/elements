// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

<<<<<<< Updated upstream
import { OryTwoStepCardStateMethodActive } from "./two-step/state-method-active"
import { OryTwoStepCardStateProvideIdentifier } from "./two-step/state-provide-identifier"
import { OryTwoStepCardStateSelectMethod } from "./two-step/state-select-method"
import { useOryFlow } from "@ory/elements-react"
=======
import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
  getNodeId,
  UiText,
} from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { OryCard, OryCardContent, OryCardFooter } from "."
import { useComponents, useNodeSorter, useOryFlow } from "../../context"
import { isGroupImmediateSubmit } from "../../theme/default/utils/form"
import { findNode, useNodesGroups } from "../../util/ui"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtonsForm } from "../form/social"
import { removeSsoNodes, getFinalNodes } from "./card-two-step.utils"
import { OryCardHeader } from "./header"
import { useIntl } from "react-intl"

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
>>>>>>> Stashed changes

export function OryTwoStepCard() {
  const { formState } = useOryFlow()

  switch (formState.current) {
    case "provide_identifier":
<<<<<<< Updated upstream
      return <OryTwoStepCardStateProvideIdentifier />
    case "select_method":
      return <OryTwoStepCardStateSelectMethod />
    case "method_active":
      return <OryTwoStepCardStateMethodActive formState={formState} />
=======
      return (
        <OryCard>
          <OryCardHeader />
          <OryCardContent>
            <OryCardValidationMessages />
            {showSso && <OryFormSocialButtonsForm />}
            <OryForm
              data-testid={`ory/form/methods/local`}
              onAfterSubmit={handleAfterFormSubmit}
            >
              <Form.Group>
                {showSsoDivider && <Card.Divider />}
                {nonSsoNodes.sort(sortNodes).map((node) => (
                  <Node node={node} key={getNodeId(node)} />
                ))}
              </Form.Group>
            </OryForm>
          </OryCardContent>
          <OryCardFooter />
        </OryCard>
      )
    case "select_method":
      return (
        <OryCard>
          <OryCardHeader />
          <OryCardContent>
            <OryCardValidationMessages />
            {showSso && <OryFormSocialButtonsForm />}
            {Object.entries(authMethodBlocks).length > 0 ? (
              <OryForm
                data-testid={`ory/form/methods/local`}
                onAfterSubmit={handleAfterFormSubmit}
              >
                <Form.Group>
                  <Card.Divider />
                  <AuthMethodList
                    options={authMethodBlocks}
                    setSelectedGroup={(group) =>
                      dispatchFormState({
                        type: "action_select_method",
                        method: group,
                      })
                    }
                  />
                  {authMethodAdditionalNodes.sort(sortNodes).map((node) => (
                    <Node node={node} key={getNodeId(node)} />
                  ))}
                </Form.Group>
              </OryForm>
            ) : (
              !showSso && (
                <div data-testid={`ory/form/methods/local`}>
                  <Message.Root>
                    <Message.Content key={noMethods.id} message={noMethods} />
                  </Message.Root>
                </div>
              )
            )}
          </OryCardContent>
          <OryCardFooter />
        </OryCard>
      )
    case "method_active":
      return (
        <OryCard>
          <OryCardHeader />
          <OryCardContent>
            <OryCardValidationMessages />
            {showSso && <OryFormSocialButtonsForm />}
            <OryForm
              data-testid={`ory/form/methods/local`}
              onAfterSubmit={handleAfterFormSubmit}
            >
              <Form.Group>
                {ui.nodes
                  .filter(
                    (n) =>
                      isUiNodeScriptAttributes(n.attributes) ||
                      n.group === UiNodeGroupEnum.Captcha ||
                      n.group === UiNodeGroupEnum.Default ||
                      n.group === UiNodeGroupEnum.Profile,
                  )
                  .map((node) => (
                    <Node node={node} key={getNodeId(node)} />
                  ))}
                {finalNodes.sort(sortNodes).map((node) => (
                  <Node node={node} key={getNodeId(node)} />
                ))}
              </Form.Group>
            </OryForm>
          </OryCardContent>
          <OryCardFooter />
        </OryCard>
      )
>>>>>>> Stashed changes
  }

  return <>unknown form state: {formState.current}</>
}
