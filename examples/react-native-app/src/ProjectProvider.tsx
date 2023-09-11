// This file defines a React Context which keeps track of the authenticated session.
//
import { FrontendApi } from "@ory/client"
import {
  createContext,
  PropsWithChildren,
  useMemo,
} from "react"
import { newOrySdk } from "./helpers/sdk"

interface Context {
  sdk: FrontendApi
}

export const ProjectContext = createContext<Context>({
  sdk: newOrySdk(),
})

export default function ProjectContextProvider({
  children,
}: PropsWithChildren<unknown>) {
  const sdk = useMemo(() => {
    return newOrySdk()
  }, [])

  return (
    <ProjectContext.Provider
      value={{
        // Helpers to set the global Ory Project for this app.
        sdk,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
