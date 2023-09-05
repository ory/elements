// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { MockFlowResponse } from "../types"

// defaultMockFlowResponse is the default response for any flow request
// it is used to mock the Ory Network service
// the default response is a 200 with an empty body and a content type of application/json
export const defaultMockFlowResponse: MockFlowResponse = {
  status: 200,
  body: null,
  headers: {
    "Content-Type": "application/json",
  },
}
