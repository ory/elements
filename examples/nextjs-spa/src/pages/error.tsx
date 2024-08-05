// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import Link from "next/link"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { ory } from "@/pkg/sdk"

// Misc.
import Layout from "@/components/layout"
import { CodeBox } from "@ory/elements"
import { AxiosError } from "axios"
import { HandleError } from "@/pkg/hooks"
import { NextPageWithLayout } from "./_app"

// We will use CodeBox from Ory Elements to display the session information.

const Error: NextPageWithLayout = () => {
  const [error, setError] = useState<string>()
  const router = useRouter()

  const id = router.query.id
  const err = router.query.error

  const handleError = useCallback((error: AxiosError) => {
    const handle = HandleError()
    return handle(error)
  }, [])

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (err) {
      try {
        setError(
          JSON.stringify(JSON.parse(decodeURIComponent(String(err))), null, 2),
        )
      } catch (error) {
        setError(String(err))
      }
    }

    if (id) {
      // Fetch the error information from the Ory API
      ory
        .getFlowError({ id: String(id) })
        .then(({ data }) => {
          setError(JSON.stringify(data, null, 2))
        })
        .catch((error: AxiosError) => {
          switch (error.response?.status) {
            case 404: {
              // The kratos handler for /self-service/errors?id=some_error_id currently only handles id=stub:500, and will 404 for everything else
              // See https://github.com/ory/kratos/blob/4fb28b363622bb21ce12d9f89d2ceb4649aa0cba/selfservice/errorx/handler.go#L106
              return;
            }
          }
          handleError(error).then();
        });
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
