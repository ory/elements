// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { useComponents, useNodeSorter, useOryFlow } from "../../../context"
import { FormStateMethodActive } from "../../../context/form-state"
import { useNodeGroupsWithVisibleNodes } from "../../../util/ui"
import { OryForm } from "../../form/form"
import { OryCardValidationMessages } from "../../form/messages"
import { Node } from "../../form/nodes/node"
import { OryCardHeader } from "../header"
import { OryCard, OryCardContent, OryCardFooter } from "./../"
import { getFinalNodes, handleAfterFormSubmit } from "./utils"

export function MethodActiveForm({
  formState,
}: {
  formState: FormStateMethodActive
}) {
  const { Form } = useComponents()
  const { flow, flowType, dispatchFormState } = useOryFlow()
  const { ui } = flow

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })
  const groupsToShow = useNodeGroupsWithVisibleNodes(ui.nodes)
  const finalNodes = getFinalNodes(groupsToShow, formState.method)

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        <OryForm onAfterSubmit={handleAfterFormSubmit(dispatchFormState)}>
          <Form.Group>
            {ui.nodes
              .filter(
                (n) =>
                  isUiNodeScriptAttributes(n.attributes) ||
                  n.group === UiNodeGroupEnum.Default ||
                  n.group === UiNodeGroupEnum.Profile,
              )
              .map((node, k) => (
                <Node node={node} key={k} />
              ))}
            {finalNodes.sort(sortNodes).map((node, k) => (
              <Node node={node} key={k} />
            ))}
          </Form.Group>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}
