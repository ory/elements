// React
import { useEffect, useState } from "react"

// Next.js
import Link from "next/link"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { ory } from "../pkg/sdk"

// Misc.
import Layout from "@/components/layout"
import { CodeBox } from "@ory/elements"
import { AxiosError } from "axios"
import { HandleError } from "../pkg/hooks"
import { NextPageWithLayout } from "./_app"

// We will use CodeBox from Ory Elements to display the session information.

const Error: NextPageWithLayout = () => {
  const [error, setError] = useState<string>()
  const handleError = HandleError()
  const router = useRouter()

  const id = router.query.id
  const err = router.query.error

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (err) {
      return setError(
        JSON.stringify(JSON.parse(decodeURIComponent(String(err))), null, 2),
      )
    }

    if (id) {
      // Fetch the error information from the Ory API
      ory
        .getFlowError({ id: String(id) })
        .then(({ data }) => {
          setError(JSON.stringify(data, null, 2))
        })
        .catch((err: AxiosError) => handleError(err))
    }
  }, [err, id, router.isReady, handleError])

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

Error.getLayout = (page) => <Layout>{page}</Layout>

export default Error
