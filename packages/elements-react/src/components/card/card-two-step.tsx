"use client"

import { OryCardHeader } from "./header"
import { OryForm } from "../form/form"
import { OryCardValidationMessages } from "../form/messages"
import { Node } from "../form/nodes/node"
import { OryFormSocialButtons } from "../form/social"
import { useComponents, useNodeSorter } from "../../context"
import { useOryFlow } from "../../context"
import {
  isUiNodeInputAttributes,
  UiNode,
  UiNodeInputAttributesNodeTypeEnum,
  UiNodeInputAttributesTypeEnum,
  UiNodeTypeEnum,
  UiTextTypeEnum,
} from "@ory/client-fetch"
import { Dispatch, useEffect, useState } from "react"
import { OryCard, OryCardContent, OryCardFooter, OryCardProps } from "."
import { OryFormGroupDivider } from "../generic"

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

type OptionProps = {
  setGroups: Dispatch<React.SetStateAction<string[]>>
  setStep: Dispatch<React.SetStateAction<number>>
  title: string
  group: string
  description: string
}

export function Option({
  setGroups,
  setStep,
  title,
  group,
  description,
}: OptionProps) {
  return (
    <div
      className={
        "flex py-2 gap-3 cursor-pointer hover:bg-button-secondary-bg-hover"
      }
      onClick={() => {
        setGroups([group])
        setStep(2)
      }}
    >
      <div className={"flex-none w-4 h-4 mt-[2px]"}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5997 4.66669C13.2026 5.66747 13.4603 6.83858 13.333 8.00002V8.66669C13.3322 9.3686 13.5161 10.0584 13.8663 10.6667M5.33297 7.33335C5.33297 6.62611 5.61392 5.94783 6.11402 5.44774C6.61411 4.94764 7.29239 4.66669 7.99963 4.66669C8.70688 4.66669 9.38516 4.94764 9.88525 5.44774C10.3853 5.94783 10.6663 6.62611 10.6663 7.33335V8.00002C10.6663 9.44249 11.1342 10.846 11.9996 12M7.99964 7.33335V8.66669C7.99751 10.573 8.57914 12.4342 9.66631 14M5.33297 10C5.4961 11.3932 5.90225 12.7471 6.53297 14M3.2663 12.6667C2.81646 11.1536 2.61386 9.57772 2.6663 8.00002V7.33335C2.66374 6.39592 2.90831 5.47438 3.37537 4.66159C3.84242 3.84879 4.51546 3.17346 5.32666 2.70364C6.13786 2.23382 7.05856 1.98611 7.99599 1.98547C8.93342 1.98484 9.85446 2.2313 10.6663 2.70002"
            stroke="#0F172A"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={"flex-1 text-sm leading-normal"}>
        <div className="text-forms-fg-default">{title}</div>
        <div className="text-forms-fg-subtle">{description}</div>
      </div>
    </div>
  )
}

export function OryTwoStepCard({ children }: OryCardProps) {
  const [step, setStep] = useState(1)
  const [groups, setGroups] = useState<string[]>([])
  const Components = useComponents()
  const { FormGroup } = useComponents()
  const { flowType } = useOryFlow()

  const {
    flow: { ui },
  } = useOryFlow()
  let nodes: (UiNode & { twoStepContinue?: boolean })[] = ui.nodes

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  // If we have multiple auth methods, we show two-step login. For this we need at least two auth methods.
  // Social sign in / OpenID Connect does not count, as no user input apart from a click is required.
  const hasMultiple =
    nodes.filter(({ group }) => group === "default" || group === "oidc")
      .length > 2

  useEffect(() => {
    // setStep(0)
  }, [])

  if (children) {
    return <Components.Card>{children}</Components.Card>
  }

  if (!hasMultiple) {
    return (
      <OryCard>
        <OryCardHeader />
        <OryCardContent />
        <OryCardFooter />
      </OryCard>
    )
  }

  const options: (OptionProps & { show: boolean })[] = [
    {
      title: "Passkey",
      group: "passkey",
      description: "Use your fingerprint or face to sign in.",
      setStep: () => setStep(2),
      setGroups: () => setGroups(["passkey"]),
      show: nodes.findIndex(({ group }) => group === "passkey") !== -1,
    },
    {
      title: "Password",
      group: "password",
      description: "Enter your password.",
      setStep: () => setStep(2),
      setGroups: () => setGroups(["password"]),
      show: nodes.findIndex(({ group }) => group === "password") !== -1,
    },
    {
      title: "Code",
      group: "code",
      description: "Enter a code from your authenticator app.",
      setStep: () => setStep(2),
      setGroups: () => setGroups(["code"]),
      show: nodes.findIndex(({ group }) => group === "code") !== -1,
    },

    {
      title: "WebAuthn",
      group: "webauthn",
      description: "Use a security key to sign in.",
      setStep: () => setStep(2),
      setGroups: () => setGroups(["webauthn"]),
      show: nodes.findIndex(({ group }) => group === "webauthn") !== -1,
    },
  ]

  switch (step) {
    case -1:
      nodes = nodes.sort(sortNodes)
      break
    case 0:
      nodes = nodes
        .filter(({ group }) => ["default"].includes(group))
        .sort(sortNodes)
      nodes = [...nodes, nodeContinue]
      break
    case 1:
      return (
        <OryCard>
          <OryCardHeader />
          <OryFormGroupDivider />
          <OryCardContent>
            {options.map((props, k) => (
              <Components.AuthMethodListItem {...props} key={k} />
            ))}
          </OryCardContent>
          <OryCardFooter />
        </OryCard>
      )
    case 2:
      nodes = nodes
        .filter(({ group }) => groups.includes(group))
        .sort(sortNodes)
      nodes = [...nodes, nodeGoBack, nodePickMethod]
      break
  }

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        <OryForm>
          {step === 0 && <OryFormSocialButtons />}
          <FormGroup>
            {nodes.sort(sortNodes).map((node, k) => {
              if (node.twoStepContinue) {
                if (isUiNodeInputAttributes(node.attributes)) {
                  return (
                    <Components.Button
                      key={k}
                      attributes={node.attributes}
                      node={node}
                      onClick={() => {
                        setStep(step + 1)
                      }}
                    />
                  )
                }
              }
              return <Node node={node} key={k} />
            })}
          </FormGroup>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}
