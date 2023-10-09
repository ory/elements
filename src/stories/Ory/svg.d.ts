// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
