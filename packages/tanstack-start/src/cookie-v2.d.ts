// SPDX-License-Identifier: Apache-2.0

declare module "cookie" {
  // `cookie@2` ships this declaration next to its ESM export, but the
  // repository's classic TypeScript resolution does not discover it.
  export * from "cookie/dist/index.js"
}
