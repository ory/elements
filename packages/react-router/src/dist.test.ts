// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { execFileSync } from "node:child_process"
import { join } from "node:path"

const dist = join(__dirname, "..", "dist")

const builds = [
  {
    format: "CommonJS",
    args: [] as string[],
    load: (file: string) =>
      `require(${JSON.stringify(join(dist, file + ".js"))})`,
  },
  {
    format: "ES module",
    args: ["--input-type=module"],
    load: (file: string) =>
      `await import(${JSON.stringify(join(dist, file + ".mjs"))})`,
  },
]

function run(args: string[], script: string): unknown {
  const output = execFileSync(process.execPath, [...args, "-e", script], {
    env: {
      ...process.env,
      ORY_SDK_URL: "https://example.projects.oryapis.com",
    },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  })
  return JSON.parse(output)
}

describe.each(builds)("the $format build", ({ args, load }) => {
  test("reads the proxy registered from the proxy entry", () => {
    const script = `
      const { createOryProxyHandler } = ${load("proxy/index")}
      const { getOryBaseUrl } = ${load("index")}
      createOryProxyHandler({ trustedOrigins: ["http://localhost:5173"] })
      console.log(JSON.stringify(getOryBaseUrl(new Request("http://localhost:5173/"))))
    `

    expect(run(args, script)).toBe("http://localhost:5173")
  })

  test("resolves to the SDK URL without the proxy", () => {
    const script = `
      const { getOryBaseUrl } = ${load("index")}
      console.log(JSON.stringify(getOryBaseUrl(new Request("http://localhost:5173/"))))
    `

    expect(run(args, script)).toBe("https://example.projects.oryapis.com")
  })
})
