import { ApiResponse } from "@ory/client-fetch"

export function toValue<T>(res: ApiResponse<T>) {
  return res.value()
}
