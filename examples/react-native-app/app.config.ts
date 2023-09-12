module.exports = ({ config }) => {
  // We gracefully destruct these parameters to avoid "undefined" errors:
  const { env = {} } = process || {}
  return {
    ...config,
    extra: {
      orySdkUrl:
        env.EXPO_PUBLIC_ORY_SDK_URL ||
        "https://playground.projects.oryapis.com",
    },
  }
}
