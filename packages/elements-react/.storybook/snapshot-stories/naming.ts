// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { storyNameFromExport, toId } from "storybook/internal/csf"

export type SnapshotFlow =
  | "login"
  | "registration"
  | "settings"
  | "recovery"
  | "verification"
  /** Not a flow: Kratos refused to create one, and the theme shows its error screen. */
  | "error"

/**
 * Path segments that name a variant of a screen rather than a place in the
 * sidebar, so they do not become a level in the title.
 */
const UNTITLED_SEGMENTS = new Set([
  "client-error",
  "hidden",
  "interactive",
  "standalone",
  "without-password",
])

/**
 * Path segments that distinguish two stories sharing a title, appended to the
 * story name: `captcha/hidden/show-send.json` becomes "Show Send Hidden", and
 * the organization directories keep their single "Organizations" title without
 * colliding.
 */
const NAME_SUFFIXES: Record<string, string> = {
  "client-error": "ClientError",
  hidden: "Hidden",
  interactive: "Interactive",
  "organization-oidc": "OIDC",
  "organization-saml": "SAML",
  standalone: "Standalone",
}

/** Titles for path segments that do not title-case into what the suite calls them. */
const SEGMENT_TITLES: Record<string, string> = {
  "1fa": "First Factor",
  "2fa": "Second Factor",
  "all-2fa-methods": "Everything 2FA",
  "all-methods": "Everything",
  deviceauthn: "Device authentication",
  oidc: "OIDC",
  "one-step": "Unified",
  "organization-oidc": "Organizations",
  "organization-saml": "Organizations",
  "recovery-v2": "Recovery v2",
  recovery_v2: "Recovery v2",
  saml: "SAML",
  totp: "TOTP",
  "two-step": "Profile First",
  webauthn: "WebAuthn",
}

/** Titles for the few directories the segment map cannot express. */
const DIRECTORY_TITLES: Record<string, string> = {
  "login/1fa/none": "Login/First Factor/Unified/None",
  "login/1fa/refresh/all-methods":
    "Login/First Factor/Identifier First/Refresh/Everything Enabled",
  // Everywhere else the suite spells this "WebAuthn". Kept as-is so the
  // migration does not move this title's Chromatic baselines as well.
  "settings/webauthn": "Settings/Webauthn",
}

/** Story names for snapshots whose file name does not describe the screen. */
const STORY_NAMES: Record<string, string> = {
  "all-added": "AllAvailable",
  "change-password": "ShowFormChangesSaved",
  "change-trait": "ShowFormTraitValidationError",
  "code-sent-error": "EmailCodeError",
  "initial-form": "ShowForm",
  "invalid-code": "WrongCode",
  "missing-account": "UnknownAccount",
  "missing-any-address": "MissingAddress",
  "missing-fields": "ValidationError",
  "missing-identifier": "ValidationMissingFields",
  "show-code-input": "ShowCode",
  "show-options": "MethodSelect",
  "show-password": "ShowPasswordForm",
  "webauthn-error": "WebAuthnError",
  "webauthn-trigger": "WebAuthnTrigger",
  "with-provider": "WithUnlinkProvider",
  "wrong-captcha": "ValidationCaptchaUnsolved",
  "wrong-passkey": "PasskeyError",
  "wrong-webauthn": "WebAuthnError",
}

export type GeneratedStory = {
  /** Posix path of the snapshot, relative to `.stub-responses`. */
  snapshot: string
  flow: SnapshotFlow
  title: string
  exportName: string
  name: string
  id: string
  layout: "centered" | "fullscreen"
}

function pascalCase(value: string): string {
  return value
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("")
}

function titleCase(value: string): string {
  return value
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

/** The parts of a snapshot that decide which screen it renders. */
export type SnapshotBody = {
  ui?: { action?: unknown }
  error?: { message?: unknown }
}

/** Reads the flow type out of a snapshot's `ui.action` URL. */
function flowFromAction(action: unknown): SnapshotFlow | null {
  if (typeof action !== "string") {
    return null
  }
  const match =
    /\/self-service\/(login|registration|settings|verification|recovery)\b/.exec(
      action,
    )
  return match ? (match[1] as SnapshotFlow) : null
}

/**
 * The screen a snapshot renders. A flow names its own type in `ui.action`;
 * a flow Kratos refused to create — disabled, or with every method turned off —
 * is an error body instead, which is what the user sees on those projects.
 *
 * `message` is what the theme's `Error` screen itself keys on
 * (`instanceOfGenericError`), so a body without one renders nothing.
 */
export function flowFromSnapshot(body: SnapshotBody): SnapshotFlow | null {
  if (typeof body.error?.message === "string") {
    return "error"
  }
  return flowFromAction(body.ui?.action)
}

export function describeSnapshot(
  snapshot: string,
  flow: SnapshotFlow,
): GeneratedStory {
  const segments = snapshot.split("/")
  const fileName = segments.pop()?.replace(/\.json$/, "") ?? ""
  const directory = segments.join("/")

  const path =
    DIRECTORY_TITLES[directory] ??
    segments
      .filter((segment) => !UNTITLED_SEGMENTS.has(segment))
      .map((segment) => SEGMENT_TITLES[segment] ?? titleCase(segment))
      .join("/")
  const title = `Ory Elements/${path}`

  const suffix = segments
    .map((segment) => NAME_SUFFIXES[segment] ?? "")
    .join("")
  // Error snapshots keep the file name of the flow they failed to become, so
  // the name comes from the screen instead: `disabled/initial-form.json` shows
  // an error, not a form.
  const base =
    flow === "error"
      ? "ShowError"
      : (STORY_NAMES[fileName] ?? pascalCase(fileName))
  const exportName = base + suffix
  const name = storyNameFromExport(exportName)

  return {
    snapshot,
    flow,
    title,
    exportName,
    name,
    id: toId(title, name),
    layout: flow === "settings" ? "fullscreen" : "centered",
  }
}
