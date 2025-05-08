import { AccountExperienceConfiguration } from "@ory/client-fetch"
import { createContext, useContext } from "react"

export function useOryProject() {
  return useContext(OryProjectContext)
}

const defaultProject: AccountExperienceConfiguration = {
  name: "Ory",
  registration_enabled: true,
  verification_enabled: true,
  recovery_enabled: true,
  recovery_ui_url: "/ui/recovery",
  registration_ui_url: "/ui/registration",
  verification_ui_url: "/ui/verification",
  login_ui_url: "/ui/login",
  settings_ui_url: "/ui/settings",
  default_redirect_url: "/ui/welcome",
  error_ui_url: "/ui/error",
  default_locale: "en",
  locale_behavior: "force_default",
}

const OryProjectContext = createContext(defaultProject)

export function OryProjectProvider({
  children,
  project,
}: {
  children: React.ReactNode
  project?: AccountExperienceConfiguration
}) {
  return (
    <OryProjectContext.Provider value={project ?? defaultProject}>
      {children}
    </OryProjectContext.Provider>
  )
}
