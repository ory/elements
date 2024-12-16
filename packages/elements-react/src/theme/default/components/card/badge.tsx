// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import OryLogoHorizontal from "../../assets/ory-badge-horizontal.svg"
import OryLogoVertical from "../../assets/ory-badge-vertical.svg"

export function Badge() {
  return (
    <div className="absolute bg-branding-bg-default p-2 font-bold max-md:bottom-0 max-md:left-8 max-md:translate-y-full max-md:rounded-b-md  md:right-0 md:top-8 md:translate-x-full md:rounded-r-md">
      <OryLogoHorizontal width={22} height={8} className="md:hidden" />
      <OryLogoVertical width={8} height={22} className="max-md:hidden" />
    </div>
  )
}
