export const isVercel = process.env.VERCEL === "1"

export function isVercelAppDeployment() {
  return (process.env.VERCEL_URL || "").includes(".vercel.app")
}
