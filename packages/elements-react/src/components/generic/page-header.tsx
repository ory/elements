// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"

export type OryPageHeaderProps = Record<never, never>

/**
 * The OryPageHeader component renders the header of the page.
 *
 * Customize the header by providing a custom {@link OryFlowComponents.Page.Header} component in the `components` prop of the {@link OryProvider}.
 *
 * @returns a React component that renders the page header.
 * @group Components
 */
export const OryPageHeader = () => {
  const { Page } = useComponents()

  return <Page.Header />
}
