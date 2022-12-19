import { FlowError } from "@ory/client"
import { CodeBox } from "@ory/elements"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { stringify } from "querystring"
import { useEffect, useState } from "react"

import { ory } from "../components/sdk"

const Login: NextPage = () => {
  const [error, setError] = useState<FlowError | string>()

  // Get ?id=... from the URL
  const router = useRouter()
  const id = router.query
  // console.log(id)
  // console.log(id.data)

  const decodeURL = (string: string) => {
    if (string.indexOf('%') !== -1) {
      return decodeURIComponent(string)
    }
    return string
  }

  let errorPrint = decodeURL(stringify(id))
  errorPrint = errorPrint.replace(/\\n/g,"\n")
  

  useEffect(() => {
    // If the router is not ready yet, or we already have an error, do nothing.
    if (!router.isReady || error) {
      return
    }

    ory
      .getFlowError({ id: String(id) })
      .then(({ data }) => {
        setError(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          // The error id could not be found. Let's just redirect home!
          case 403:
          // The error id could not be fetched due to e.g. a CSRF issue. Let's just redirect home!
          case 410:
            // The error id expired. Let's just redirect home!
        }

        return Promise.reject(err)
      })
  }, [id, router, router.isReady, error])

  // if (!error) {
  //   return null
  // }

  return (
    <>
      <h1>
        <Link href="/">Home</Link>
      </h1>
      <CodeBox>
        {errorPrint}
      </CodeBox>
      <h1>Oops!</h1>
    </>
  )
}

export default Login