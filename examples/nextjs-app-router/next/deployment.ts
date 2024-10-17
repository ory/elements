export const isVercel = process.env.VERCEL === "1"

export function isVercelPreviewDeployment() {
  return (process.env.VERCEL_URL || "").includes(".vercel.app")
}

export function isDevelopment() {
  return (
    ["development", "dev"].indexOf(
      process.env.VERCEL_ENV || process.env.NODE_ENV || "",
    ) > -1
  )
}
