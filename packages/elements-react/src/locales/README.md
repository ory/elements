# Locales

This directory holds one JSON file per supported locale. Each file maps message
ids to ICU message strings. The source of truth for which messages exist is the
`defaultMessage` at the call site in `src/`, not `en.json`: `en.json` is a
locale file like the others and may lag the source.

## Adding or changing a message

1. Add the message in source with an `id` and a `defaultMessage`:

   ```tsx
   intl.formatMessage({
     id: "settings.example",
     defaultMessage: "Example",
   })
   ```

   For Kratos messages, add the id to
   `scripts/elements-helpers/input/kratos-messages.json` instead. Every message
   needs a `defaultMessage`; the `locales` command fails without one.

2. Regenerate the derived files:

   ```bash
   cd scripts/elements-helpers
   ./cli.ts locales
   ```

   This regenerates `src/util/i18n/generated/kratosMessages.ts`, removes keys
   that no longer exist in source from every locale file and prints the number
   of untranslated keys per locale. It never adds keys. When the text of an
   existing message changed, its key is removed from every locale file,
   including `en.json`, so every locale renders the new text until the
   translations arrive.

3. Commit the source change and every file the command changed. Do not edit the
   locale files by hand.

At runtime, a key that a locale lacks renders the `defaultMessage` from the call
site. That also applies to `en`.

Translations, including the `en.json` line, arrive in a separate pull request
opened by a scheduled job. The job runs the command below with `--ollama` and
the existing locale tests gate its output.

## Running the translator locally

Install [Ollama](https://ollama.com/download) and pull `translategemma:27b`.
Then:

```bash
cd scripts/elements-helpers
./cli.ts locales --ollama
```

Options:

- `--reTranslate <id...>` translates the given ids again in every locale.
- `--max-minutes <n>` stops starting new locales once `n` minutes have elapsed;
  the locales not reached are listed in the summary.
- `--summary-file <path>` writes the run summary as JSON.
- `--fail-on-missing` exits non-zero when any locale still lacks a key.

Translating one key across all locales takes several minutes on a laptop.

## Tests

`src/util/i18n/__tests__/translations.spec.ts` checks every locale file against
`en.json`: no key that `en.json` lacks, matching ICU arguments, matching empty
values and no untranslated copies of the English text. A locale may lack keys
that `en.json` has.

## Custom translations

Consumers override any message through the `customTranslations` option of the
`IntlProvider`; see the package README.
