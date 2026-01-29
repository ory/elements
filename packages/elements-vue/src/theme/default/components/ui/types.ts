// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export type IconName =
  | "alert-triangle"
  | "arrow-left"
  | "code"
  | "download"
  | "eye"
  | "eye-off"
  | "key"
  | "logout"
  | "lookup-secret"
  | "message"
  | "passkey"
  | "password"
  | "personal"
  | "phone"
  | "qr-code"
  | "refresh"
  | "settings"
  | "totp"
  | "trash"
  | "unlink"
  | "user"
  | "webauthn"
  | "x"

export interface IconProps {
  name: IconName
  size?: number
}
