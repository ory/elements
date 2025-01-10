import { FlowType, LoginFlow } from "@ory/client-fetch"
import { render } from "@testing-library/react"
import { ComponentProps, ReactNode } from "react"
import { OryProvider } from "@ory/elements-react"
import { defaultConfiguration } from "../../../../tests/jest/test-utils"
import { DefaultCardFooter } from "./footer"

type renderProps = {
  providerProps: ComponentProps<typeof OryProvider>
}

const renderWithContext = (
  ui: ReactNode,
  { providerProps, ...renderOptions }: renderProps,
) => {
  return render(
    <OryProvider {...providerProps}>{ui}</OryProvider>,
    renderOptions,
  )
}

test("login footer should render correct sign up link", () => {
  const x = renderWithContext(<DefaultCardFooter />, {
    providerProps: {
      components: null!,
      config: defaultConfiguration,
      flowType: FlowType.Login,
      flow: {
        request_url: "http://localhost:4455?return_to=https://ory.sh",
        state: "",
        ui: {
          action: "",
          method: "",
          nodes: [],
          messages: [],
        },
      } as unknown as LoginFlow,
    },
  })

  expect(x.container).toMatchSnapshot()
})

test("registration footer should render correct sign in link", () => {
  const x = renderWithContext(<DefaultCardFooter />, {
    providerProps: {
      components: null!,
      config: defaultConfiguration,
      flowType: FlowType.Registration,
      flow: {
        request_url: "http://localhost:4455?return_to=https://ory.sh",
        state: "",
        ui: {
          action: "",
          method: "",
          nodes: [],
          messages: [],
        },
      } as unknown as LoginFlow,
    },
  })

  expect(x.container).toMatchSnapshot()
})
