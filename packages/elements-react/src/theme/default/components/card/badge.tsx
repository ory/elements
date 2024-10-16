// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import OryLogoHorizontal from "../../assets/ory-badge-horizontal.svg"
import OryLogoVertical from "../../assets/ory-badge-vertical.svg"

export function Badge() {
  return (
    <div className="font-bold bg-branding-bg-default absolute max-md:rounded-b-md p-2 max-md:bottom-0 max-md:translate-y-full max-md:left-8  md:right-0 md:translate-x-full md:top-8 md:rounded-r-md">
      <OryLogoHorizontal width={22} height={8} className="md:hidden" />
      <OryLogoVertical width={8} height={22} className="max-md:hidden" />
    </div>
  )
}
