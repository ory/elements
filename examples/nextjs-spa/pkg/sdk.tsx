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
    console.debug(`Axios Intercepted Error ${error}`)

    if (!error.config) {
      // it's a network error
      return Promise.reject({
        response: {
          status: "",
          message:
            "Network error - this could be related to CORS or an incorrect URL set on the `NEXT_PUBLIC_ORY_SDK_URL` environment variable. " +
            "Please check out the Ory documentation for more information: https://www.ory.sh/docs/getting-started/local-development",
        },
      })
    }

    if (!error.response) {
      // it's a network error
      return Promise.reject({
        response: {
          status: "",
          message:
            "Network error - this could be related to CORS or an incorrect URL set on the `NEXT_PUBLIC_ORY_SDK_URL` environment variable. " +
            "Please check out the Ory documentation for more information: https://www.ory.sh/docs/getting-started/local-development",
        },
      })
    }

    switch (error.response.status) {
      case 404:
        // it's a 404 error
        // lets handle this by redirecting the user to the error page with a generic error message
        error.response = {
          ...error.response,
          data: {
            ...error.response.data,
            message:
              "You have not configured the Ory SDK correctly. Set `NEXT_PUBLIC_ORY_SDK_URL` to point to the Ory CLI tunnel or your Custom Domain (on production). " +
              "Please check out the example README for more information.",
          },
        }
        return Promise.reject(error)
      default:
        // it's a response error
        return Promise.reject(error)
    }
  },
)

// Create a new Ory API client
// This will default to the Ory playground project if no environment variable is set.
// Set the `NEXT_PUBLIC_ORY_SDK_URL` to your Ory CLI tunnel e.g. http://localhost:4000
// or on production to the custom domain you have added to your Ory project.
const ory = new FrontendApi(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL,
  }),
  "",
  axios,
)

export { ory }
