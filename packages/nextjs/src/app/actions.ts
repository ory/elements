// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use server"

import { OryConfig } from "../"
import { newOryProjectClient } from "../sdk"

const client = newOryProjectClient()

export async function getProjectConfig(): Promise<OryConfig> {
  const list = await client.listProjects().catch((err) => {
    throw new Error(
      "Unable to fetch the project list, please check your configuration and Ory Project API Key.",
      err,
    )
  })

  if (list.length > 1) {
    console.warn(
      "Found more than one project for the configured Ory Project API Key. Using the first one.",
    )
  }

  if (list.length === 0) {
    throw new Error(
      "Expected to find one project but found none. Please verify your configuration and check that your Ory Project API Key is valid for only one project.",
    )
  }

  const project = await client
    .getProject({ projectId: list[0].id })
    .catch((err) => {
      throw new Error("Unable to fetch the project configuration.")
    })

  const config = project.services.identity?.config as any
  return Promise.resolve({
    override: {
      applicationName: project.name,
      recovery_ui_path: config.selfservice.flows.recovery.ui_url,
      registration_ui_path: config.selfservice.flows.registration.ui_url,
      login_ui_path: config.selfservice.flows.login.ui_url,
      settings_ui_path: config.selfservice.flows.settings.ui_url,
      error_ui_path: config.selfservice.flows.error.ui_url,
      verification_ui_path: config.selfservice.flows.verification.ui_url,
    },
  })
}
