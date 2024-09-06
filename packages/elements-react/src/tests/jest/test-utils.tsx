import { PropsWithChildren, ReactElement } from "react"
import { OryComponentProvider } from "../../context"
import { OryDefaultComponents } from "../../theme/default"
import { render, RenderOptions } from "@testing-library/react"

const AllProviders = ({ children }: PropsWithChildren) => (
  <OryComponentProvider components={OryDefaultComponents}>
    {children}
  </OryComponentProvider>
)

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }
