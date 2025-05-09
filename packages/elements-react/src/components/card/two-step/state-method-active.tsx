// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { OryCard, OryCardContent, OryCardFooter } from "./../"
import { useComponents, useNodeSorter, useOryFlow } from "../../../context"
import { useNodeGroupsWithVisibleNodes } from "../../../util/ui"
import { OryForm } from "../../form/form"
import { OryCardValidationMessages } from "../../form/messages"
import { Node } from "../../form/nodes/node"
import { OryFormSocialButtonsForm } from "../../form/social"
import { getFinalNodes, handleAfterFormSubmit } from "./utils"
import { OryCardHeader } from "../header"
import { FormStateMethodActive } from "../../../context/form-state"

export function OryTwoStepCardStateMethodActive({
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

  // We want to show the OIDC buttons on all screens, except when the user has selected a different method.
  const selectedMethodIsSocial =
    formState.method === UiNodeGroupEnum.Oidc ||
    formState.method === UiNodeGroupEnum.Saml

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        {selectedMethodIsSocial && <OryFormSocialButtonsForm />}
        <OryForm
          data-testid={`ory/form/methods/local`}
          onAfterSubmit={handleAfterFormSubmit(dispatchFormState)}
        >
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
