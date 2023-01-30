import { Configuration, FrontendApi } from "@ory/client"
import axiosFactory, { AxiosError } from "axios"

/**
 * We use a custom axios instance here to add custom error messages on the response.
 * This is not required, but it helps debug issues with the Ory SDK and Ory CLI tunnel.
 * Do not use this in production! Instead, handle the errors according to your application business logic!
 */
const axios = axiosFactory.create({
  withCredentials: true,
})

axios.interceptors.response.use(
  (v) => Promise.resolve(v),
  (error: AxiosError) => {
    console.debug(`Axios Intercepted Error ${JSON.stringify(error.response)}`)

    if (!error.config || !error.response) {
      // it's a network error
      return Promise.reject({
        response: {
          status: 0,
          message:
            "Network error - this could be related to CORS or an incorrect URL set on the `NEXT_PUBLIC_ORY_SDK_URL` environment variable. " +
            "Please check out the Ory documentation for more information: https://www.ory.sh/docs/getting-started/local-development",
        },
      })
    }

    return Promise.reject(error)
  },
)

// Create a new Ory API client
// This will default to the Ory playground project if no environment variable is set.
// Set the `NEXT_PUBLIC_ORY_SDK_URL` to your Ory CLI tunnel e.g. http://localhost:4000
// or on production to the custom domain you have added to your Ory project.
const ory = new FrontendApi(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL || "",
  }),
  "",
  axios,
)

export { ory }
