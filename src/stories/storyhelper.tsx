import { ReactNode } from "react"

export const Spacer = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      marginBottom: "20px",
    }}
  >
    {children}
  </div>
)

export const Container = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
)

export const HR = () => (
  <hr
    style={{
      border: "none",
      outline: "none",
      background: "#bbb",
      height: "1px",
      margin: "16px 0",
    }}
  />
)
