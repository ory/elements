import { PropsWithChildren, ReactElement } from "react"
import { OryComponentProvider } from "../../context"
import { OryDefaultComponents } from "../../theme/default"
import { render, RenderOptions } from "@testing-library/react"
import { OryClientConfiguration } from "../../util"

const AllProviders = ({ children }: PropsWithChildren) => (
  <OryComponentProvider components={OryDefaultComponents}>
    {children}
  </OryComponentProvider>
)

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options })

export const defaultConfiguration: OryClientConfiguration = {
  name: "test",
  project: {
    login_ui_url: "http://localhost:4455/login",
    recovery_ui_url: "http://localhost:4455/recovery",
    registration_ui_url: "http://localhost:4455/registration",
    verification_ui_url: "http://localhost:4455/verification",
    recovery_enabled: true,
    registration_enabled: true,
    verification_enabled: true,
  },
  sdk: {
    url: "http://localhost:4455",
  },
}

export * from "@testing-library/react"
export { customRender as render }
