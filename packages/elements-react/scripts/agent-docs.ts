// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import ts from "typescript"
import type { SlotMap } from "./slot-map"

const packagesRoot = resolve(__dirname, "../..")
const elementsReact = join(packagesRoot, "elements-react")
const nextjs = join(packagesRoot, "nextjs")

const virtualRoot = join(elementsReact, ".agent-docs")

const entryPoints: Record<string, string> = {
  "@ory/elements-react": join(elementsReact, "src/index.ts"),
  "@ory/elements-react/client": join(elementsReact, "src/client/index.ts"),
  "@ory/elements-react/theme": join(
    elementsReact,
    "src/theme/default/index.ts",
  ),
  "@ory/nextjs/app": join(nextjs, "src/app/index.ts"),
  "@ory/nextjs/middleware": join(nextjs, "src/middleware/index.ts"),
  "@ory/nextjs/pages": join(nextjs, "src/pages/index.ts"),
}

export type Snippet = {
  /** The path the snippet names in its first line, for example `app/page.tsx`. */
  file: string
  code: string
  /** The line of the Markdown file the snippet's code starts on. */
  line: number
}

/**
 * Lists the Markdown files a package ships for coding agents.
 */
export function agentDocs(packageRoot: string): string[] {
  const skills = join(packageRoot, "skills")
  return [
    join(packageRoot, "agents/GUIDE.md"),
    ...(existsSync(skills)
      ? readdirSync(skills).map((name) => join(skills, name, "SKILL.md"))
      : []),
  ]
}

/**
 * Extracts the `ts` and `tsx` code blocks of a Markdown document. Each block
 * has to name the file it stands for in a leading `// path` comment.
 */
export function extractSnippets(markdown: string): Snippet[] {
  const snippets: Snippet[] = []
  const lines = markdown.split("\n")
  for (let i = 0; i < lines.length; i++) {
    const open = /^(\s*)(`{3,})(ts|tsx)\s*$/.exec(lines[i])
    if (!open) {
      continue
    }
    const close = new RegExp(`^\\s*\`{${open[2].length},}\\s*$`)
    const start = i + 1
    let end = start
    while (end < lines.length && !close.test(lines[end])) {
      end++
    }
    const body = lines
      .slice(start, end)
      .map((line) => line.slice(open[1].length))
    const name = /^\/\/ (\S+\.(ts|tsx))$/.exec(body[0] ?? "")
    if (!name) {
      throw new Error(
        `The code block on line ${start} has to start with a \`// path/to/file.${open[3]}\` comment.`,
      )
    }
    snippets.push({ file: name[1], code: body.join("\n"), line: start + 1 })
    i = end
  }
  return snippets
}

function exportedSubpaths(packageRoot: string) {
  const manifest = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as { name: string; exports: Record<string, unknown> }
  return Object.keys(manifest.exports).map((subpath) =>
    subpath === "." ? manifest.name : manifest.name + subpath.slice(1),
  )
}

/**
 * Type-checks the TypeScript code blocks of the given Markdown files against
 * the sources of `@ory/elements-react` and `@ory/nextjs`.
 *
 * @returns one message per problem, empty when every block compiles.
 */
export function checkAgentDocs(markdownFiles: string[]): string[] {
  const problems: string[] = []
  const virtualFiles = new Map<string, string>()
  const origins = new Map<string, { markdown: string; snippet: Snippet }>()
  const subpaths = [
    ...exportedSubpaths(elementsReact),
    ...exportedSubpaths(nextjs),
  ]

  markdownFiles.forEach((markdown, index) => {
    // The snippets of one document form one project, so that `@/ory.config`
    // in a page resolves to the `ory.config.ts` block of the same document.
    const root = join(virtualRoot, String(index))
    for (const snippet of extractSnippets(readFileSync(markdown, "utf8"))) {
      const path = join(root, snippet.file)
      virtualFiles.set(path, snippet.code)
      origins.set(path, { markdown, snippet })

      for (const match of snippet.code.matchAll(
        /from\s+"(@ory\/[^"]+)"|import\s+"(@ory\/[^"]+)"/g,
      )) {
        const specifier = match[1] ?? match[2]
        if (
          /^@ory\/(elements-react|nextjs)(\/|$)/.test(specifier) &&
          !subpaths.includes(specifier)
        ) {
          problems.push(
            `${relative(packagesRoot, markdown)}:${snippet.line} (${snippet.file}): "${specifier}" is not an export of the package`,
          )
        }
      }
    }
  })

  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    esModuleInterop: true,
    resolveJsonModule: true,
    types: ["node"],
    baseUrl: packagesRoot,
    paths: {
      ...Object.fromEntries(
        Object.entries(entryPoints).map(([name, file]) => [name, [file]]),
      ),
      "src/*": [join(nextjs, "src/*")],
    },
  }

  const host = ts.createCompilerHost(options)
  const fileExists = host.fileExists.bind(host)
  const readFile = host.readFile.bind(host)
  const getSourceFile = host.getSourceFile.bind(host)
  host.fileExists = (file) => virtualFiles.has(file) || fileExists(file)
  host.readFile = (file) => virtualFiles.get(file) ?? readFile(file)
  host.getSourceFile = (file, languageVersion, ...rest) => {
    const code = virtualFiles.get(file)
    return code === undefined
      ? getSourceFile(file, languageVersion, ...rest)
      : ts.createSourceFile(file, code, languageVersion, true)
  }
  const directoryExists = host.directoryExists?.bind(host)
  host.directoryExists = (directory) =>
    directory.startsWith(virtualRoot) || (directoryExists?.(directory) ?? true)
  host.resolveModuleNameLiterals = (literals, containingFile) =>
    literals.map((literal) => {
      const origin = origins.get(containingFile)
      return ts.resolveModuleName(
        origin && literal.text.startsWith("@/")
          ? join(
              containingFile.slice(0, -origin.snippet.file.length),
              literal.text.slice(2),
            )
          : literal.text,
        containingFile,
        options,
        host,
      )
    })

  const program = ts.createProgram({
    rootNames: [
      ...virtualFiles.keys(),
      join(elementsReact, "src/theme/default/assets/global.d.ts"),
    ],
    options,
    host,
  })

  for (const [path, { markdown, snippet }] of origins) {
    const sourceFile = program.getSourceFile(path)
    if (!sourceFile) {
      throw new Error(`${snippet.file} of ${markdown} was not compiled`)
    }
    for (const diagnostic of [
      ...program.getSyntacticDiagnostics(sourceFile),
      ...program.getSemanticDiagnostics(sourceFile),
    ]) {
      const position = sourceFile.getLineAndCharacterOfPosition(
        diagnostic.start ?? 0,
      )
      problems.push(
        `${relative(packagesRoot, markdown)}:${snippet.line + position.line} (${
          snippet.file
        }): ${ts.flattenDiagnosticMessageText(diagnostic.messageText, " ")}`,
      )
    }
  }

  return problems
}

/**
 * Finds slot paths, such as `Card.Header`, that the slot map does not have,
 * and table rows that pair a slot with another props type than its own.
 */
export function findSlotProblems(markdown: string, map: SlotMap): string[] {
  const slots = new Map(map.slots.map((slot) => [slot.path, slot]))
  const groups = [...new Set(map.slots.map((slot) => slot.group))].join("|")
  const slotPath = new RegExp("`((?:" + groups + ")\\.[A-Za-z]+)`", "g")
  const problems: string[] = []

  markdown.split("\n").forEach((line, index) => {
    const paths = [...line.matchAll(slotPath)].map((match) => match[1])
    for (const path of paths) {
      if (!slots.has(path)) {
        problems.push(`line ${index + 1}: \`${path}\` is not a slot`)
      }
    }
    const propsTypes = [...line.matchAll(/`(\w+Props)`/g)].map((m) => m[1])
    const slot = paths.length === 1 ? slots.get(paths[0]) : undefined
    if (
      line.trimStart().startsWith("|") &&
      slot &&
      propsTypes.length === 1 &&
      propsTypes[0] !== slot.propsType
    ) {
      problems.push(
        `line ${index + 1}: \`${slot.path}\` takes \`${slot.propsType}\`, not \`${propsTypes[0]}\``,
      )
    }
  })

  return problems
}

export function checkSlotReferences(
  markdownFiles: string[],
  map: SlotMap,
): string[] {
  return markdownFiles.flatMap((file) =>
    findSlotProblems(readFileSync(file, "utf8"), map).map(
      (problem) => `${relative(packagesRoot, file)} ${problem}`,
    ),
  )
}

export function packageRootOf(testFile: string): string {
  let dir = dirname(testFile)
  while (!existsSync(join(dir, "package.json"))) {
    dir = dirname(dir)
  }
  return dir
}
