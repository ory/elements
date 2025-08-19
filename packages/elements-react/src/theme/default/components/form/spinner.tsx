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
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2572_1748)">
        <path
          d="M23.364 10.6362C22.1053 9.37751 20.5016 8.52034 18.7558 8.17307C17.01 7.82581 15.2004 8.00404 13.5559 8.68523C11.9113 9.36641 10.5057 10.52 9.51678 12C8.52784 13.4801 8 15.2201 8 17.0001C8 18.7802 8.52784 20.5202 9.51678 22.0003C10.5057 23.4803 11.9113 24.6339 13.5559 25.3151C15.2004 25.9962 17.01 26.1745 18.7558 25.8272C20.5016 25.4799 22.1053 24.6228 23.364 23.3641"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2572_1748">
          <rect
            width="24"
            height="24"
            fill="currentColor"
            transform="translate(17 0.029541) rotate(45)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
