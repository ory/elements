## 1.0.0-next.20 (2025-01-16)

### 🚀 Features

- handle state transition edge cases ([f2e4023](https://github.com/ory/elements/commit/f2e4023))
- user experience improvements and e2e test coverage ([f68744c](https://github.com/ory/elements/commit/f68744c))
- do not show two-step selector if only one method exists ([6453673](https://github.com/ory/elements/commit/6453673))

### 🩹 Fixes

- better validation for code method ([b0d8e2c](https://github.com/ory/elements/commit/b0d8e2c))

### ❤️  Thank You

- aeneasr @aeneasr

## 1.0.0-next.19 (2024-12-31)

### 🩹 Fixes

- properly handle form submits in settings flow ([#322](https://github.com/ory/elements/pull/322))

### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.18 (2024-12-30)

### 🚀 Features

- add page and app router examples ([#307](https://github.com/ory/elements/pull/307))
- ⚠️  add getServerSession and SessionProvider ([#309](https://github.com/ory/elements/pull/309))
- add @ory/nextjs package ([#303](https://github.com/ory/elements/pull/303))

### 🩹 Fixes

- align font sizes to design & use updated variable names ([#318](https://github.com/ory/elements/pull/318))
- properly set default value for checkboxes ([#314](https://github.com/ory/elements/pull/314))
- passkey and webauthn in settings flow ([#317](https://github.com/ory/elements/pull/317))

### ⚠️  Breaking Changes

- ⚠️  add getServerSession and SessionProvider ([#309](https://github.com/ory/elements/pull/309))

### ❤️  Thank You

- hackerman @aeneasr
- Jonas Hungershausen

## 1.0.0-next.17 (2024-11-27)


### 🚀 Features

- allow overriding OIDC logos

- enable proper account linking flows

- **core:** add react-hook form resolver


### 🩹 Fixes

- handle recovery brute force protection


### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.16 (2024-11-26)


### 🚀 Features

- allow overriding of field messages

- add test ids to components


### 🩹 Fixes

- use --font-sans CSS variable for font

- registration & login flow form states

- missing resend button on login & registration

- password validation error form state

- current identifier button overflowing on long values


### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.15 (2024-11-18)


### 🩹 Fixes

- use --font-sans CSS variable for font

- registration & login flow form states


### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.14 (2024-11-08)


### 🚀 Features

- force OIDC account selection on settings


### 🩹 Fixes

- redirect to login if session expired during settings


### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.13 (2024-11-05)


### 🩹 Fixes

- ⚠️  move useSession hook to /client entry point

- oidc linking & unlinking form properties

- hide two step registration message

- implement component merging instead of usign lodash

- replace translation merge with custom function


#### ⚠️  Breaking Changes

- ⚠️  move useSession hook to /client entry point

### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.12 (2024-10-29)


### 🚀 Features

- add elements v1 packages

- add useSession hook

- add page header component with user menu

- support links in checkbox/boolean nodes

- add settings flow components


### 🩹 Fixes

- use correct node to detect two step registration

- use translations in more missing places

- short-circuit code login on two step card

- duplicate resend button on recovery & verification


### ❤️  Thank You

- Jonas Hungershausen
- Miłosz

## 1.0.0-next.11 (2024-10-22)

Breaking Changes: This update includes breaking changes to the naming of some variables and functions. Please refer to [Advisory: ory elements‐react upgrade guide to v1.0.0‐next.11](https://github.com/ory/elements/wiki/Advisory:-ory-elements%E2%80%90react-upgrade-guide-to-v1.0.0%E2%80%90next.11) for more information.


### 🚀 Features

- add elements v1 packages

- add useSession hook

### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.10 (2024-10-14)


### 🩹 Fixes

- add missing translations in all places


### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.9 (2024-10-10)


### 🩹 Fixes

- add missing swedish translations


### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.8 (2024-10-07)


### 🩹 Fixes

- ⚠️  remove ory-default-theme class

- remove capitalize class from messages


#### ⚠️  Breaking Changes

- ⚠️  remove ory-default-theme class

### ❤️  Thank You

- Jonas Hungershausen

## 1.0.0-next.7 (2024-09-27)

### 🚀 Features

- add two-step login card

### 🩹 Fixes

- registration text in swedish translation

- show identifier_first node in card header

### ❤️ Thank You

- Jonas Hungershausen

## 1.0.0-next.6 (2024-09-18)

### 🩹 Fixes

- **intl:** export locales object from package root

### ❤️ Thank You

- Jonas Hungershausen

## 1.0.0-next.5 (2024-09-17)

### 🚀 Features

- @testing-library/react based tests

- **theme:** show resend code button on top of code input

### 🩹 Fixes

- **core:** use SDK instead of HTML form submissions

- **core:** use empty strings instead of undefined default values

- **core:** code form submission precendence

- ⚠️ **theme:** scope css classes with .ory-default-theme

- **theme:** social sign in button styling

- **intl:** use correct abbreveation for swedish locale

- **core:** passkey script discovery

#### ⚠️ Breaking Changes

- ⚠️ **theme:** scope css classes with .ory-default-theme

### ❤️ Thank You

- Jonas Hungershausen
- Miłosz
