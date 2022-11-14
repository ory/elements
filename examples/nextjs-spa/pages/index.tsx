import { ThemeProvider } from "@ory/elements"
import React from "react"
import Link from "next/link"

// React
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Ory SDK
import { Session } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"
import { ory, getUserName } from "../components/sdk"

// import css
import styles from "../styles/Dashboard.module.css"
import "@ory/elements/style.css"

const Home = () => {
  const router = useRouter()

  const [session, setSession] = useState<Session | undefined>()
  const [logoutUrl, setLogoutUrl] = useState<string | undefined>()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data: session }) => {
        // User has a session!
        setSession(session)
        // Create a logout url
        ory.createSelfServiceLogoutFlowUrlForBrowsers().then(({ data }) => {
          setLogoutUrl(data.logout_url)
        })
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          // the user might have a session, but would require 2FA (Two-Factor Authentication)
          if (error.response?.data.error.id === "session_aal2_required") {
            return router.push("/ui/login?aal2=true")
          }
        }
        // Redirect to login page
        return router.push(edgeConfig.basePath + "/ui/login")
      })
  })

  if (!session) {
    // Still loading
    return null
  }

  return (
    <div className={styles.container}>
      <title>Next.js w/ Elements</title>

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
          , {getUserName(session?.identity)}!
        </h1>

        {/* <p className={styles.description}>
          <a href={"/login"}>Login</a>
        </p> */}

        <React.StrictMode>
          {/* We add the Ory themes here */}
          <ThemeProvider themeOverrides={{}}>
            <Link href="/login"></Link>
            {/* <Link href="/signup"><Registration /></Link> */}
            {/* <Link href="/verification"><Verification /></Link>
            <Link href="/recovery"><Recovery /></Link>
            <Link href="/settings"><Settings /></Link> */}
          </ThemeProvider>
        </React.StrictMode>

        <p className={styles.description}>
          <a href={logoutUrl}>Log out</a>
        </p>
      </main>
    </div>
  )
}

export default Home

// const Home = () => {

//   return (
//       <React.StrictMode>
//           {/* We add the Ory themes here */}
//           <ThemeProvider themeOverrides={{}}>
//             <Link href="/"></Link>
//             <Link href="/login"></Link>
//             {/* <Link href="/signup"><Registration /></Link> */}
//             {/* <Link href="/verification"><Verification /></Link>
//             <Link href="/recovery"><Recovery /></Link>
//             <Link href="/settings"><Settings /></Link> */}
//           </ThemeProvider>
//       </React.StrictMode>
//     )
// }

// export default Home
