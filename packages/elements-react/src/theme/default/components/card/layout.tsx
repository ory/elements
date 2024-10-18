import { PropsWithChildren } from "react"

export function DefaultCardLayout({ children }: PropsWithChildren) {
  return (
    <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
      {children}
    </main>
  )
}
