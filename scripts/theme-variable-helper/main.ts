// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import fs from "fs"
import path from "path"

import { Variable, VariableDefinition } from "./types"

function parse(input: string) {
  try {
    return JSON.parse(input) as Variable[]
  } catch (e) {
    console.error("Error parsing JSON")
    console.error(e)
    process.exit(1)
  }
}

function normalizeName(name: string) {
  return name.replaceAll("/", "-")
}

type varDef = {
  twName: string
  tw: string
  cssName: string
  css: string
}

function generateTheme(
  variables: VariableDefinition[],
  { varPrefix = "", ignoreVarRef = false } = {},
): varDef[] {
  return variables.map((color) => {
    const colorName = normalizeName(color.name)

    let value = ""
    if (color.var && !ignoreVarRef) {
      value = `var(--${normalizeName(color.var)})`
    } else {
      value = color.value
    }
    return {
      twName: colorName,
      tw: `var(--${(varPrefix ? varPrefix + "-" : "") + colorName})`,
      cssName: (varPrefix ? varPrefix + "-" : "") + colorName,
      css: value,
    }
  })
}

const elementsReactPath = path.resolve(
  __dirname,
  "../../packages/elements-react",
)

function run() {
  const variables = parse(
    fs.readFileSync("./input/figma-variables.json", "utf-8"),
  )

  if (!variables) {
    console.error("No variables found")
    process.exit(1)
    return
  }

  // The path of the variable definition input used by Tailwind to generate classes
  const processedVariablesPath = path.resolve(
    elementsReactPath,
    "tailwind/generated/variables-processed.json",
  )

  // The default definitions of the variables used by the Tailwind classes.
  // This setup allows us to override the default values settings using CSS classes, e.g. in an external stylesheet.
  const defaultVariableValuesCSS = path.resolve(
    elementsReactPath,
    "tailwind/generated/default-variables.css",
  )

  // TODO: Add support for dark mode
  const lightTheme = generateTheme(
    variables.flatMap((v) =>
      v.values
        .filter((v) => v.mode.id === "1:0" && !!v.color)
        .flatMap((v) => v.color),
    ),
  )

  const brandTheme = generateTheme(
    variables.flatMap((v) =>
      v.values
        .filter((v) => v.mode.id === "6017:2" && !!v.color)
        .flatMap((v) => v.color),
    ),
  )

  const primitives = generateTheme(
    variables.flatMap((v) =>
      v.values
        .filter((v) => v.mode.id === "6002:0" && !!v.color)
        .flatMap((v) => v.color),
    ),
  )

  const roundness = generateTheme(
    variables.flatMap((v) =>
      v.values.filter((v) => v.mode.id === "421:0").flatMap((v) => v.number),
    ),
    { varPrefix: "border-radius", ignoreVarRef: true },
  )

  // write TW config file
  fs.writeFileSync(
    processedVariablesPath,
    JSON.stringify(
      {
        colors: {
          light: lightTheme
            .map((v) => ({ [v.twName]: v.tw }))
            .reduce((a, b) => ({ ...a, ...b }), {}),
          brand: brandTheme
            .map((v) => ({ [v.twName]: v.tw }))
            .reduce((a, b) => ({ ...a, ...b }), {}),
          primitives: primitives
            .map((v) => ({ [v.twName]: v.tw }))
            .reduce((a, b) => ({ ...a, ...b }), {}),
        },
        borderRadius: roundness
          .map((v) => ({ [v.twName]: v.tw }))
          .reduce((a, b) => ({ ...a, ...b }), {}),
      },
      null,
      2,
    ),
  )

  fs.writeFileSync(
    defaultVariableValuesCSS,
    `:root {
  ${primitives.map(printCssLine).join("\n  ")}
  ${lightTheme.map(printCssLine).join("\n  ")}
  ${brandTheme.map(printCssLine).join("\n  ")}
  ${roundness.map(printCssLine).join("\n  ")}
}`,
  )
}

function printCssLine(def: varDef) {
  return `--${def.cssName}: ${def.css};`
}

run()
