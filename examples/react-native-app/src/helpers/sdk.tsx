import { Configuration, FrontendApi } from "@ory/client"

console.log("ORY SDK URL", process.env.EXPO_PUBLIC_ORY_SDK_URL)

export const newOrySdk = () =>
  new FrontendApi(
    new Configuration({
      basePath: "http://localhost:4000", // process.env.EXPO_PUBLIC_ORY_SDK_URL || "https://playground.projects.oryapis.com",
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
        withCredentials: false,

        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    "",
  )
