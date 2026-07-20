// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// Mock for Nuxt's #imports module used in unit tests

export function useRuntimeConfig() {
  return {
    public: {
      ory: {
        sdkUrl: "https://mock.ory.sh",
      },
    },
  }
}
