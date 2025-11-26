import { OryNodeInputProps } from "@ory/elements-react"

export function MyCustomPinCodeInput({ inputProps }: OryNodeInputProps) {
  return <input {...inputProps} className="border py-4 px-2" />
}
