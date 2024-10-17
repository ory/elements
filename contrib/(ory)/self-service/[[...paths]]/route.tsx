import { createApiHandler } from "@/routers/app/proxy"

export const { GET, PUT, POST, config } = createApiHandler({
  custom_login_ui_path: "/login",
})
