// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { createI18n } from "vue-i18n"
import { provideOryIntl, useOryIntl, OryLocales } from "./useOryIntl"
import { provideOryConfig } from "./useOryConfig"

describe("useOryIntl", () => {
  describe("provideOryIntl", () => {
    it("provides i18n context with default locale", () => {
      // Create i18n instance to install globally
      const i18n = createI18n({
        legacy: false,
        locale: "en",
        fallbackLocale: "en",
        messages: { en: OryLocales.en },
      })

      const TestConsumer = defineComponent({
        setup() {
          const intl = useOryIntl()
          return { intl }
        },
        render() {
          return h("div", {}, this.intl.t("login.title"))
        },
      })

      const Provider = defineComponent({
        setup() {
          provideOryIntl({ locale: "en" })
        },
        render() {
          return h(TestConsumer)
        },
      })

      const wrapper = mount(Provider, {
        global: {
          plugins: [i18n],
        },
      })

      expect(wrapper.text()).toContain("Sign in")
    })

    it("merges custom translations with default translations", () => {
      const i18n = createI18n({
        legacy: false,
        locale: "en",
        fallbackLocale: "en",
        messages: {
          en: {
            ...OryLocales.en,
            "login.title": "Custom Login Title",
          },
        },
      })

      const TestConsumer = defineComponent({
        setup() {
          const intl = useOryIntl()
          return { intl }
        },
        render() {
          return h("div", {}, this.intl.t("login.title"))
        },
      })

      const Provider = defineComponent({
        setup() {
          provideOryIntl({
            locale: "en",
            customTranslations: {
              en: {
                "login.title": "Custom Login Title",
              },
            },
          })
        },
        render() {
          return h(TestConsumer)
        },
      })

      const wrapper = mount(Provider, {
        global: {
          plugins: [i18n],
        },
      })

      expect(wrapper.text()).toContain("Custom Login Title")
    })
  })

  describe("useOryIntl without OryIntl provider", () => {
    it("creates auto translation function and returns translations", () => {
      const TestConsumer = defineComponent({
        setup() {
          const intl = useOryIntl()
          return { intl }
        },
        render() {
          return h("div", {}, this.intl.t("login.title"))
        },
      })

      const Provider = defineComponent({
        setup() {
          provideOryConfig({
            sdk: { url: "https://example.com" },
            project: { default_locale: "en" },
          })
        },
        render() {
          return h(TestConsumer)
        },
      })

      const wrapper = mount(Provider)
      expect(wrapper.text()).toContain("Sign in")
    })

    it("returns translation key when translation not found", () => {
      const Consumer = defineComponent({
        setup() {
          const intl = useOryIntl()
          return { intl }
        },
        render() {
          return h("div", {}, this.intl.t("nonexistent.key"))
        },
      })

      const Provider = defineComponent({
        setup() {
          provideOryConfig({
            sdk: { url: "https://example.com" },
            project: { default_locale: "en" },
          })
        },
        render() {
          return h(Consumer)
        },
      })

      const wrapper = mount(Provider)
      expect(wrapper.text()).toBe("nonexistent.key")
    })

    it("replaces placeholders in translations", () => {
      const Consumer = defineComponent({
        setup() {
          const intl = useOryIntl()
          return { intl }
        },
        render() {
          return h("div", {}, this.intl.t("login.subtitle", { parts: "email" }))
        },
      })

      const Provider = defineComponent({
        setup() {
          provideOryConfig({
            sdk: { url: "https://example.com" },
            project: { default_locale: "en" },
          })
        },
        render() {
          return h(Consumer)
        },
      })

      const wrapper = mount(Provider)
      expect(wrapper.text()).toContain("email")
    })
  })
})
