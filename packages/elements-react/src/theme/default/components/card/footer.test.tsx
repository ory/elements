import { FlowType, LoginFlow } from "@ory/client-fetch"
import { render } from "@testing-library/react"
import { ComponentProps, ReactNode } from "react"
import { OryProvider } from "@ory/elements-react"
import { defaultConfiguration } from "../../../../tests/jest/test-utils"
import { DefaultCardFooter } from "./footer"

const flow = (returnTo?: string) => {
  return {
    request_url: `http://localhost:4455${returnTo ? "?return_to=" + returnTo : ""}`,
    state: "",
    ui: {
      action: "",
      method: "",
      nodes: [],
      messages: [],
    },
  } as unknown as LoginFlow
}

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

test("login footer should render return to in sign up link", () => {
  const x = renderWithContext(<DefaultCardFooter />, {
    providerProps: {
      components: null!,
      config: defaultConfiguration,
      flowType: FlowType.Login,
      flow: flow("https://ory.sh"),
    },
  })

  expect(x.container).toMatchSnapshot()
})

test("registration footer should render return to in sign in link", () => {
  const x = renderWithContext(<DefaultCardFooter />, {
    providerProps: {
      components: null!,
      config: defaultConfiguration,
      flowType: FlowType.Registration,
      flow: flow("https://ory.sh"),
    },
  })

  expect(x.container).toMatchSnapshot()
})

test("login footer should render sign up link", () => {
  const x = renderWithContext(<DefaultCardFooter />, {
    providerProps: {
      components: null!,
      config: defaultConfiguration,
      flowType: FlowType.Login,
      flow: flow(),
    },
  })

  expect(x.container).toMatchSnapshot()
})
test("registration footer should render sign in link", () => {
  const x = renderWithContext(<DefaultCardFooter />, {
    providerProps: {
      components: null!,
      config: defaultConfiguration,
      flowType: FlowType.Registration,
      flow: flow(),
    },
  })

  expect(x.container).toMatchSnapshot()
})
