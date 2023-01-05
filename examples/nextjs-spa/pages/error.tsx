// React
import { useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { ory } from "../pkg/sdk"

// Misc.
import { CodeBox } from "@ory/elements"
import { HandleError } from "../pkg/hooks"

// We will use CodeBox from Ory Elements to display the session information.

const Error: NextPage = () => {
  const [error, setError] = useState<string>()
  const handleError = HandleError()
  const router = useRouter()
  const { id, error: err } = router.query

  useEffect(() => {
    if (err) {
      return setError(
        JSON.stringify(JSON.parse(decodeURIComponent(String(err))), null, 2),
      )
    }

    if (id) {
      // Fetch the error information from the Ory API
      ory.getFlowError({ id: String(id) }).then(({ data }) => {
        setError(JSON.stringify(data, null, 2))
      })
      //.catch((err: AxiosError) => handleError(err))
    }
  }, [err, id])

  return (
    <>
      <Link href="/">Home</Link>

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

export default Error
