// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NextPage } from "next"
import { useEffect } from "react"
import { LogoutLink } from "@/pkg/hooks"

const Logout: NextPage = () => {
  const onLogout = LogoutLink()

  useEffect(() => {
    onLogout()
  }, [onLogout])

  return <div>Loading</div>
}

export default Logout
