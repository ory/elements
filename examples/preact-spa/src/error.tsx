// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "preact/hooks"
import { CodeBox, ButtonLink } from "@ory/elements-preact"
import { getSearchParam } from "./sdk"

export const Error = () => {
  const [error, setError] = useState<string>()

  useEffect(() => {
    const queryError = getSearchParam("error")

    if (queryError !== null) {
      try {
        setError(
          JSON.stringify(JSON.parse(decodeURIComponent(queryError)), null, 2),
        )
      } catch (_error) {
        setError(queryError)
      }
    } else {
      setError("Undefined error")
    }
  }, [])

  // we check if the flow is set, if not we show a loading indicator
  return (
    <>
      <ButtonLink href="/">Home</ButtonLink>

      <p>
        An error occurred. Please check the error information below and try
        again.
      </p>
      <CodeBox
        style={{
          overflow: "auto",
          maxWidth: "600px",
        }}
      >
        {error}
      </CodeBox>
    </>
  )
}
