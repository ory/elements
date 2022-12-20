// React
import React from "react"
import { useEffect, useState } from "react"

// Next.js
import { useRouter } from "next/router"
import Link from "next/link"
import type { NextPage } from "next"

// Ory SDK
import { ory } from "../components/sdk"

// Import CSS
import styles from "../styles/Dashboard.module.css"

// Misc.
import { LogoutLink } from "../pkg/hooks"
import { AxiosError } from "axios"

// We will use CodeBox from Ory Elements to display the session information.
import { CodeBox } from "@ory/elements"

const Home: NextPage = () => {
  const [session, setSession] = useState<string>(
    "No valid Ory Session was found.\nPlease sign in to receive one.",
  )
  const [hasSession, setHasSession] = useState<boolean>(false)
  const router = useRouter()
  const onLogout = LogoutLink()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(JSON.stringify(data, null, 2))
        setHasSession(true)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          // In case of unhandeled errors, we redirect the user to the error page.
          case 422:
            router.push({
              pathname: "/error",
              query: {
                error: JSON.stringify(err, null, 2),
                id: err.response?.data.error?.id,
                flowType: router.pathname,
              },
            })
          case 401:
            // The user is not logged in, so we redirect them to the login page.
            return router.push("/login")
        }
        // Something else happened!
        return Promise.reject(err)
      })
  }, [router])

  return hasSession ? (
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
        <div className={styles.nav}>
          <h2>Navigation</h2>
          <p>
            <Link href="/" onClick={onLogout}>
              Logout
            </Link>
          </p>
          <p>
            <Link href="/verification">Verification</Link>
          </p>
          <p>
            <Link href="/settings">Settings</Link>
          </p>
        </div>
        <h3>Session Information</h3>
        <div className={styles.sessionDisplay}>
          {/* Displays the current session information */}
          <CodeBox>{session}</CodeBox>
        </div>
      </main>
    </div>
  ) : (
    <>
      <head></head>
      <div>Loading...</div>
    </>
  )
}

export default Home
