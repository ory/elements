// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { JSX } from "react"

import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { SelfServiceFlow } from "../helpers/types"
import { hasPasskey, hasWebauthn } from "../helpers/utils"

export const PasswordlessSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasWebauthn(flow.ui.nodes) ? (
    <>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["webauthn", "identifier_first"],
          withoutDefaultAttributes: true,
          attributes: ["hidden"], // the form will take care of hidden fields
        }}
      />
      <div className={gridStyle({ gap: 32 })}>
        <div className={gridStyle({ gap: 16 })} data-testid={"asdf"}>
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              // we will also map default fields here but not oidc and password fields
              groups: ["webauthn"],
              withoutDefaultAttributes: true,
              excludeAttributeTypes: ["hidden", "button", "submit"],
            }}
          />
        </div>
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: ["webauthn"],
            withoutDefaultAttributes: true,
            attributes: ["button", "submit"],
            excludeAttributeTypes: ["hidden"],
          }}
        />
      </div>
    </>
  ) : null
}

export const PasskeySection = (flow: SelfServiceFlow): JSX.Element | null => {
  return hasPasskey(flow.ui.nodes) ? (
    <>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["identifier_first", "passkey"],
          withoutDefaultAttributes: true,
          attributes: ["hidden"], // the form will take care of hidden fields
        }}
      />
      <div className={gridStyle({ gap: 32 })}>
        <div className={gridStyle({ gap: 16 })}>
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              // we will also map default fields here but not oidc and password fields
              groups: ["passkey"],
              withoutDefaultAttributes: true,
              excludeAttributeTypes: ["hidden", "button", "submit"], // the form will take care of hidden fields
            }}
          />
        </div>
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: ["passkey"],
            withoutDefaultAttributes: true,
            attributes: ["button", "submit"],
            excludeAttributeTypes: ["hidden"],
          }}
        />
      </div>
    </>
  ) : null
}

export const PasskeyLoginSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  return hasPasskey(flow.ui.nodes) ? (
    <>
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          groups: ["passkey", "identifier_first"],
          withoutDefaultAttributes: true,
          attributes: ["hidden"], // the form will take care of hidden fields
        }}
      />
      <div className={gridStyle({ gap: 32 })}>
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: ["passkey"],
            withoutDefaultAttributes: true,
            attributes: ["button", "submit"],
          }}
        />
      </div>
    </>
  ) : null
}

export const PasswordlessLoginSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  if (hasWebauthn(flow.ui.nodes)) {
    return (
      <>
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: ["webauthn", "identifier_first"],
            withoutDefaultAttributes: true,
            attributes: ["hidden"], // the form will take care of hidden fields
          }}
        />
        <div className={gridStyle({ gap: 32 })}>
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              // we will also map default fields here but not oidc and password fields
              groups: ["webauthn"],
              withoutDefaultAttributes: true,
              excludeAttributeTypes: ["hidden", "button", "submit"], // the form will take care of hidden fields
            }}
          />
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ["webauthn"],
              withoutDefaultAttributes: true,
              attributes: ["button", "submit"],
              excludeAttributeTypes: ["hidden"],
            }}
          />
        </div>
      </>
    )
  }

  return null
}
