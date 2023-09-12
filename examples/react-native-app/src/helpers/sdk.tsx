import { Configuration, FrontendApi } from "@ory/client"
import Constants from "expo-constants"
import axiosFactory from "axios"

console.log("ORY SDK URL", Constants.expoConfig?.extra?.orySdkUrl)

const axios = axiosFactory.create()

export const newOrySdk = () =>
  new FrontendApi(
    new Configuration({
      basePath: Constants.expoConfig?.extra?.orySdkUrl,
      baseOptions: {
        // Setting this is very important as axios will send the CSRF cookie otherwise
        // which causes problems with ORY Kratos' security detection.
        withCredentials: false,

        // Timeout after 5 seconds.
        timeout: 10000,
      },
    }),
    "",
    axios,
  )
