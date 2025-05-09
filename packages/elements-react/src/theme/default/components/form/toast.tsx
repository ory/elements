import { OryToastProps } from "@ory/elements-react"
import { toast as sonnerToast } from "sonner"

export function DefaultToast({ id, message }: OryToastProps) {
  return (
    <div className="flex rounded-cards bg-interface-background-default-inverted w-full md:max-w-[364px] items-center p-4 border border-interface-border-default-primary">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-interface-foreground-validation-success">
            Password
          </p>
          <p className="mt-1 text-sm text-interface-foreground-default-inverted">
            {message.text}
          </p>
        </div>
      </div>
      <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
        <button
          className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          onClick={() => {
            sonnerToast.dismiss(id)
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
