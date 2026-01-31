// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeConsentScopeCheckboxProps } from "@ory/elements-react"

const scopeLabels: Record<string, { title: string; description: string }> = {
  openid: {
    title: "Identity",
    description: "Allows the application to verify your identity.",
  },
  offline_access: {
    title: "Offline Access",
    description: "Allows the application to keep you signed in.",
  },
  profile: {
    title: "Profile Information",
    description: "Allows access to your basic profile details.",
  },
  email: {
    title: "Email Address",
    description: "Retrieve your email address and its verification status.",
  },
  phone: {
    title: "Phone Number",
    description: "Retrieve your phone number.",
  },
}

export function MyCustomConsentScopeCheckbox({
  attributes,
  onCheckedChange,
  inputProps,
}: OryNodeConsentScopeCheckboxProps) {
  const scope = attributes.value as string
  const label = scopeLabels[scope] ?? { title: scope, description: "" }

  return (
    <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label.title}</p>
        {label.description && (
          <p className="text-sm text-gray-500">{label.description}</p>
        )}
      </div>
      <div className="ml-4">
        <button
          type="button"
          role="switch"
          aria-checked={inputProps.checked}
          onClick={() => onCheckedChange(!inputProps.checked)}
          disabled={inputProps.disabled}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${inputProps.checked ? "bg-blue-600" : "bg-gray-300"}
            ${inputProps.disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${inputProps.checked ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
      </div>
    </label>
  )
}
