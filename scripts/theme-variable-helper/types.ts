// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export interface Variable {
  name: string
  values: Value[]
}

export interface Value {
  mode: Mode
  color: VariableDefinition[]
  number: VariableDefinition[]
  string: VariableDefinition[]
}

export interface Mode {
  name: string
  id: string
}

export interface VariableDefinition {
  name: string
  value: string
  var: string
  rootAlias: string
}
