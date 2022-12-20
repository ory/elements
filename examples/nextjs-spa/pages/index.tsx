import React from "react"
import Link from "next/link"

// React
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Ory SDK
import { ory } from "../components/sdk"

// import css
import styles from "../styles/Dashboard.module.css"

import { AxiosError } from "axios"
import type { NextPage } from "next"
import { LogoutLink } from "../pkg/hooks"
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
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            router.push({
              pathname: "/error",
              query: {
                error: JSON.stringify(err, null, 2),
                id: err.response?.data.error?.id,
                flowType: router.pathname
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
          <h2>
            Navigation
          </h2>
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
        <h3>
          Session Information
        </h3>
        <div className={styles.sessionDisplay}>
          <CodeBox>
            {session}
          </CodeBox>
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
