// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import Router from "next/router"

// Ory SDK
import { ory } from "@/pkg/sdk"

// Import CSS
import styles from "../styles/Dashboard.module.css"

// Misc.
import { AxiosError } from "axios"

// We will use CodeBox from Ory Elements to display the session information.
import Layout from "@/components/layout"
import { Session } from "@ory/client"
import { CodeBox } from "@ory/elements"
import { HandleError } from "@/pkg/hooks"
import { NextPageWithLayout } from "./_app"

const Home: NextPageWithLayout = () => {
  const [session, setSession] = useState<Session>()

  const handleError = useCallback((error: AxiosError) => {
    const handle = HandleError(undefined, undefined, "/login")
    return handle(error)
  }, [])

  useEffect(() => {
    // If the router is not ready yet, or we already have a session, do nothing.
    ory
      .toSession()
      .then(({ data: session }) => {
        // we set the session data which contains the user Identifier and other traits.
        setSession(session)
      })
      .catch(handleError)
      .catch((error) => {
        // Handle all other errors like error.message "network error" if Kratos can not be connected etc.
        if (error.message) {
          return Router.push(
            `/error?error=${encodeURIComponent(error.message)}`,
          )
        }

        // Just stringify error and print all data
        return Router.push(
          `/error?error=${encodeURIComponent(JSON.stringify(error))}`,
        )
      })
  }, [handleError])

  return session ? (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="https://nextjs.org" target="_blank" rel="noreferrer">
            Next.js
          </a>{" "}
          with{" "}
          <a
            href="https://github.com/ory/elements"
            target="_blank"
            rel="noreferrer"
          >
            Ory Elements
          </a>
        </h1>
        <h3>Session Information</h3>
        <div className={styles.sessionDisplay}>
          {/* Displays the current session information */}
          <CodeBox>{JSON.stringify(session, null, 2)}</CodeBox>
        </div>
      </main>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
