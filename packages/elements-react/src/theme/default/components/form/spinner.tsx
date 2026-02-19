// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { cn } from "../../utils/cn"

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className={cn(
        "pointer-events-none absolute inset-0 m-auto size-8 animate-spin",
        className,
      )}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3C10.22 3 8.47991 3.52784 6.99987 4.51677C5.51983 5.50571 4.36628 6.91131 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
