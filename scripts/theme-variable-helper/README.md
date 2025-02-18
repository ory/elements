# Element React color variable processor

A little helper tool for processing the variables coming out of figma into
formats we can use in the tailwind configuration, the backoffice part that
provides the customization data.

## How to use

1. Open the Account Experience/Ory Elements figma file (you might not have
   access to the file, ask a maintainer to help you with this)
2. Run the `variables2css` plugin (might need to make a local copy first or turn
   on dev mode, if you don't have write permissions)
3. Make the following selections:
   - ALL collections
   - Type: JSON
   - Color: Hex
   - Unit: rem
   - Scale: 16px
4. Click Generate and then Copy
5. Paste the output into `input/figma-variables.json` (check the diff, if it's
   wildly off, something in the configuration of the plugin might've gone
   wrong!)
6. Execute `npm run process`
7. Commit the result!

## Notes

- `#NaNNaNNaNNaN` as the value of some of the variables is expected, and a
  limitation in Figma/the variables2css plugin
