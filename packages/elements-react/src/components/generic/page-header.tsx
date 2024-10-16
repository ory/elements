// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"

export type OryPageHeaderProps = Record<never, never>

export const HeadlessPageHeader = () => {
  const { Page } = useComponents()

  return <Page.Header />
}
