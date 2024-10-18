import { createOryMiddleware } from "@ory/nextjs/dist/src/server"

// This function can be marked `async` if using `await` inside
export const middleware = createOryMiddleware({
  override: {
    login_ui_path: "/auth/login",
  },
})

// See "Matching Paths" below to learn more
export const config = {}
