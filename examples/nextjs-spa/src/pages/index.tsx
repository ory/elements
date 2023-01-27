// React
import { useEffect, useState } from "react"

// Next.js

// Ory SDK
import { ory } from "../pkg/sdk"

// Import CSS
import styles from "../styles/Dashboard.module.css"

// Misc.
import { AxiosError } from "axios"

// We will use CodeBox from Ory Elements to display the session information.
import Layout from "@/components/layout"
import { CodeBox } from "@ory/elements"
import { HandleError } from "../pkg/hooks"
import { NextPageWithLayout } from "./_app"

const Home: NextPageWithLayout = () => {
  const [session, setSession] = useState<string>()
  const handleError = HandleError()

  useEffect(() => {
    // If the router is not ready yet, or we already have a session, do nothing.
    ory
      .toSession()
      .then((session) => {
        setSession(JSON.stringify(session, null, 2))
      })
      .catch((err: AxiosError) => handleError(err))
  })

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
          <CodeBox>{session}</CodeBox>
        </div>
      </main>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

Home.getLayout = (page) => <Layout>{page}</Layout>

export default Home
