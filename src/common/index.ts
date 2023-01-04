// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export const pxToRem = (...px: number[]) =>
  px.map((x) => `${x / 16}rem`).join(" ")

export const pxToEm = (...px: number[]) =>
  px.map((x) => `${x / 16}em`).join(" ")
