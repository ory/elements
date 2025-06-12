// usage: `tsx scripts/unused-css.ts`
// make sure to run `nx build elements-react` first to generate the CSS file
import fs from "fs"

const explanations: Record<string, string> = {
  "input-foreground-secondary":
    "Phone number input (country code) - unimplemented",
  "interface-background-default-inverted-hover":
    "potential hover state for the toasts? - unused right now, because the toasts are not interactive",
}

// Load CSS from file
const css = fs.readFileSync(
  "packages/elements-react/dist/theme/default/index.css",
  "utf8",
)

// Regex to find defined CSS variables: --var-name: value;
const definedVarRegex = /--([a-zA-Z0-9-_]+)\s*:/g

// Regex to find used CSS variables: var(--var-name)
const usedVarRegex = /var\(\s*--([a-zA-Z0-9-_]+)\s*\)/g

const definedVars = new Set()
const usedVars = new Set()

let match: RegExpExecArray | null = null

// Collect all defined variables
while ((match = definedVarRegex.exec(css)) !== null) {
  definedVars.add(match[1])
}

// Collect all used variables
while ((match = usedVarRegex.exec(css)) !== null) {
  usedVars.add(match[1])
}

// Get defined but unused variables
const unusedVars = [...definedVars].filter((v) => !usedVars.has(v))

console.log("Defined but unused CSS variables:")
unusedVars.forEach((v: string) => {
  const explanation = explanations[v] ? `: - ${explanations[v]}` : ""
  console.log(`--${v}${explanation}`)
})
