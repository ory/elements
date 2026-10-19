// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { join, resolve } from "node:path"
import ts from "typescript"

const packageRoot = resolve(__dirname, "..")
const componentsFile = join(packageRoot, "src/components/form/form.tsx")
const defaultsFile = join(
  packageRoot,
  "src/theme/default/components/default-components.tsx",
)
const coreEntry = join(packageRoot, "src/index.ts")
const themeEntry = join(packageRoot, "src/theme/default/index.ts")

export type SlotProp = {
  name: string
  type: string
  optional: boolean
  description: string
  deprecated?: string
}

export type Slot = {
  path: string
  group: string
  name: string
  required: boolean
  description: string
  propsType: string
  propsImport: string | null
  defaultComponent: string | null
  defaultImport: string | null
  props: SlotProp[]
  /** The number of props inherited from React's element types, which `props` leaves out. */
  inheritedProps: number
}

export type SlotMap = {
  package: string
  componentsType: string
  overridesType: string
  slots: Slot[]
}

function createProgram() {
  const configPath = join(packageRoot, "tsconfig.json")
  const config = ts.getParsedCommandLineOfConfigFile(
    configPath,
    { noEmit: true },
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        )
      },
    },
  )
  if (!config) {
    throw new Error(`Unable to read ${configPath}`)
  }
  return ts.createProgram({
    rootNames: [componentsFile, defaultsFile, coreEntry, themeEntry],
    options: config.options,
  })
}

function requireSourceFile(program: ts.Program, file: string) {
  const sourceFile = program.getSourceFile(file)
  if (!sourceFile) {
    throw new Error(`Unable to load ${file}`)
  }
  return sourceFile
}

function resolveAlias(symbol: ts.Symbol, checker: ts.TypeChecker) {
  return symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol
}

// Maps each exported declaration to the name the entry point exports it under.
function exportedNames(program: ts.Program, entry: string) {
  const checker = program.getTypeChecker()
  const symbol = checker.getSymbolAtLocation(requireSourceFile(program, entry))
  if (!symbol) {
    throw new Error(`${entry} has no exports`)
  }
  return new Map(
    checker
      .getExportsOfModule(symbol)
      .map((s) => [resolveAlias(s, checker), s.name] as const),
  )
}

function isDeclaredInDependency(symbol: ts.Symbol) {
  return (symbol.declarations ?? []).every((declaration) =>
    declaration.getSourceFile().fileName.includes("/node_modules/"),
  )
}

function describe(symbol: ts.Symbol, checker: ts.TypeChecker) {
  return ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .replace(/\s+/g, " ")
    .trim()
}

function deprecation(symbol: ts.Symbol) {
  const tag = symbol.getJsDocTags().find((t) => t.name === "deprecated")
  return tag
    ? ts
        .displayPartsToString(tag.text)
        .replace(/^[-\s]+/, "")
        .trim()
    : undefined
}

function isOptional(symbol: ts.Symbol) {
  return (symbol.flags & ts.SymbolFlags.Optional) !== 0
}

function declaredType(symbol: ts.Symbol, checker: ts.TypeChecker) {
  const declaration = symbol.valueDeclaration
  if (
    declaration &&
    (ts.isPropertySignature(declaration) ||
      ts.isPropertyDeclaration(declaration)) &&
    declaration.type
  ) {
    return declaration.type.getText().replace(/\s+/g, " ")
  }
  return checker.typeToString(
    checker.getTypeOfSymbol(symbol),
    undefined,
    ts.TypeFormatFlags.NoTruncation,
  )
}

// Props types that extend a DOM element type inherit a few hundred props.
const maxInheritedProps = 10

function propsOf(type: ts.Type, checker: ts.TypeChecker) {
  const all = checker.getPropertiesOfType(type)
  const inherited = all.filter(isDeclaredInDependency)
  const listed =
    inherited.length > maxInheritedProps
      ? all.filter((prop) => !isDeclaredInDependency(prop))
      : all
  return {
    inheritedProps: all.length - listed.length,
    props: listed.map((prop) => toSlotProp(prop, checker)).sort(byName),
  }
}

function byName(a: SlotProp, b: SlotProp) {
  return a.name.localeCompare(b.name)
}

function toSlotProp(prop: ts.Symbol, checker: ts.TypeChecker): SlotProp {
  const deprecated = deprecation(prop)
  return {
    name: prop.name,
    type: declaredType(prop, checker),
    optional: isOptional(prop),
    description: describe(prop, checker),
    ...(deprecated === undefined ? {} : { deprecated }),
  }
}

function defaultComponents(program: ts.Program) {
  const defaults = new Map<string, string>()
  const visit = (node: ts.Node, group?: string) => {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      node.initializer.forEachChild((child) =>
        visit(child, node.name.getText()),
      )
      return
    }
    if (
      group &&
      ts.isPropertyAssignment(node) &&
      ts.isBinaryExpression(node.initializer) &&
      node.initializer.operatorToken.kind ===
        ts.SyntaxKind.QuestionQuestionToken &&
      ts.isIdentifier(node.initializer.right)
    ) {
      defaults.set(
        `${group}.${node.name.getText()}`,
        node.initializer.right.getText(),
      )
      return
    }
    node.forEachChild((child) => visit(child, group))
  }
  visit(requireSourceFile(program, defaultsFile))
  return defaults
}

export function buildSlotMap(): SlotMap {
  const program = createProgram()
  const checker = program.getTypeChecker()
  const coreExports = exportedNames(program, coreEntry)
  const themeExports = exportedNames(program, themeEntry)
  const defaults = defaultComponents(program)

  const alias = requireSourceFile(program, componentsFile).statements.find(
    (statement): statement is ts.TypeAliasDeclaration =>
      ts.isTypeAliasDeclaration(statement) &&
      statement.name.text === "OryFlowComponents",
  )
  if (!alias) {
    throw new Error(`OryFlowComponents is not declared in ${componentsFile}`)
  }

  const slots: Slot[] = []
  for (const group of checker.getPropertiesOfType(
    checker.getTypeAtLocation(alias),
  )) {
    for (const slot of checker.getPropertiesOfType(
      checker.getTypeOfSymbol(group),
    )) {
      const declaration = slot.valueDeclaration
      if (
        !declaration ||
        !ts.isPropertySignature(declaration) ||
        !declaration.type ||
        !ts.isTypeReferenceNode(declaration.type) ||
        declaration.type.typeArguments?.length !== 1
      ) {
        throw new Error(
          `${group.name}.${slot.name} is not declared as ComponentType<Props>`,
        )
      }
      const propsNode = declaration.type.typeArguments[0]
      const propsSymbol = ts.isTypeReferenceNode(propsNode)
        ? checker.getSymbolAtLocation(propsNode.typeName)
        : undefined
      const propsTarget = propsSymbol && resolveAlias(propsSymbol, checker)
      const exportedProps = propsTarget && coreExports.get(propsTarget)
      const propsType =
        exportedProps ?? propsNode.getText().replace(/\s+/g, " ")
      const propsImport = exportedProps
        ? "@ory/elements-react"
        : propsTarget &&
            (propsTarget.declarations ?? []).some((d) =>
              d.getSourceFile().fileName.includes("/@types/react/"),
            )
          ? "react"
          : null
      const path = `${group.name}.${slot.name}`
      const defaultComponent = defaults.get(path) ?? null
      const defaultSymbol = defaultComponent
        ? checker
            .getSymbolsInScope(
              requireSourceFile(program, defaultsFile),
              ts.SymbolFlags.Alias | ts.SymbolFlags.Value,
            )
            .find((symbol) => symbol.name === defaultComponent)
        : undefined
      const exportedDefault =
        defaultSymbol && themeExports.get(resolveAlias(defaultSymbol, checker))
      slots.push({
        path,
        group: group.name,
        name: slot.name,
        required: !isOptional(slot),
        description: describe(slot, checker),
        propsType,
        propsImport,
        defaultComponent: exportedDefault ?? defaultComponent,
        defaultImport: exportedDefault ? "@ory/elements-react/theme" : null,
        ...propsOf(checker.getTypeFromTypeNode(propsNode), checker),
      })
    }
  }

  return {
    package: "@ory/elements-react",
    componentsType: "OryFlowComponents",
    overridesType: "OryFlowComponentOverrides",
    slots,
  }
}

function cell(text: string) {
  return text.replace(/\|/g, "\\|")
}

function code(text: string) {
  return "`" + text + "`"
}

export function renderJson(map: SlotMap) {
  return JSON.stringify(map, null, 2) + "\n"
}

export function renderMarkdown(map: SlotMap) {
  const groups = [...new Set(map.slots.map((slot) => slot.group))]
  const lines = [
    "# Ory Elements override slots",
    "",
    "<!-- Generated by scripts/generate-slot-map.ts from the OryFlowComponents type. Do not edit. -->",
    "",
    `Every part of the UI that \`${map.package}\` renders is a slot of the \`${map.componentsType}\` type. Replace a slot by passing a component under the same path in the \`components\` prop of a flow component (\`${map.overridesType}\`). A slot that you don't pass keeps its default component.`,
    "",
    `This file lists all ${map.slots.length} slots of the installed version. A path that is not listed here does not exist. The same data is in \`slots.json\` next to this file.`,
    "",
    "```tsx",
    "<Login",
    "  flow={flow}",
    "  config={config}",
    "  components={{ Card: { Header: MyCardHeader }, Node: { Button: MyButton } }}",
    "/>",
    "```",
    "",
    "A replacement component receives the props type listed for its slot. Import the props types from `@ory/elements-react`, and the default components that are marked as exported from `@ory/elements-react/theme`.",
    "",
  ]

  for (const group of groups) {
    lines.push(
      `## ${group}`,
      "",
      "| Slot | Props type | Default component | Rendered |",
      "| --- | --- | --- | --- |",
    )
    for (const slot of map.slots.filter((s) => s.group === group)) {
      const fallback = slot.defaultComponent
        ? code(slot.defaultComponent) +
          (slot.defaultImport ? " (exported)" : " (internal)")
        : "None"
      lines.push(
        `| ${code(slot.path)}${slot.required ? "" : " (optional)"} | ${code(
          slot.propsType,
        )} | ${fallback} | ${cell(slot.description)} |`,
      )
    }
    lines.push("")
  }

  lines.push("## Props", "")
  const seen = new Set<string>()
  for (const slot of map.slots) {
    if (seen.has(slot.propsType)) {
      continue
    }
    seen.add(slot.propsType)
    const users = map.slots
      .filter((s) => s.propsType === slot.propsType)
      .map((s) => code(s.path))
      .join(", ")
    const source = slot.propsImport
      ? ` Import it from ${code(slot.propsImport)}.`
      : " The package does not export this type."
    lines.push(
      `### ${code(slot.propsType)}`,
      "",
      `Used by ${users}.${source}`,
      "",
    )
    if (slot.inheritedProps > 0) {
      lines.push(
        `Also accepts the ${slot.inheritedProps} props of the HTML element it renders, which this table leaves out.`,
        "",
      )
    }
    if (slot.props.length === 0) {
      lines.push("No props.", "")
      continue
    }
    lines.push("| Prop | Type | Description |", "| --- | --- | --- |")
    for (const prop of slot.props) {
      const notes = [
        prop.deprecated === undefined
          ? ""
          : `Deprecated. ${prop.deprecated}`.trim(),
        prop.description,
      ]
        .filter(Boolean)
        .join(" ")
      lines.push(
        `| ${code(prop.name + (prop.optional ? "?" : ""))} | ${code(
          cell(prop.type),
        )} | ${cell(notes)} |`,
      )
    }
    lines.push("")
  }

  return lines.join("\n")
}
